import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { decodeHTML } from "entities";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDirectory = path.resolve(__dirname, "..");
const articleDirectories = [
  path.join(rootDirectory, "content", "articles"),
  path.join(rootDirectory, "content", "archive"),
];
const publicAudioDirectory = path.join(
  rootDirectory,
  "public",
  "audio",
  "posts",
);
const manifestPath = path.join(rootDirectory, "content", "audio-manifest.json");
const cacheDirectory = path.join(rootDirectory, ".cache", "article-audio");
const defaultTtsToolsDirectory = path.resolve(
  rootDirectory,
  "..",
  "..",
  "tts-tools",
);
const defaultF5TtsDirectory = path.resolve(rootDirectory, "..", "..", "F5-TTS");

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const dryRun = args.has("--dry-run");
const slugArg = process.argv
  .slice(2)
  .find((arg) => arg.startsWith("--slug="))
  ?.replace("--slug=", "");
const providerArg = process.argv
  .slice(2)
  .find((arg) => arg.startsWith("--provider="))
  ?.replace("--provider=", "");
const defaultAudioProvider = process.env.TTS_PROVIDER || "f5";

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeManifest(entries, originalEntries) {
  const entriesBySlug = new Map(
    originalEntries.map((entry) => [entry.slug, entry]),
  );

  for (const entry of entries) {
    entriesBySlug.set(entry.slug, entry);
  }

  writeJson(
    manifestPath,
    Array.from(entriesBySlug.values()).sort((first, second) =>
      first.slug.localeCompare(second.slug),
    ),
  );
}

function findArticleFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...findArticleFiles(entryPath));
      continue;
    }

    if (entry.name === "index.md") {
      files.push(entryPath);
    }
  }

  return files;
}

function decodeHtmlEntities(text) {
  return decodeHTML(text).replace(/\u00a0/g, " ");
}

function cleanArticleText(markdown) {
  return decodeHtmlEntities(
    markdown
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/~~~[\s\S]*?~~~/g, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/^\[\^[^\]]+\]:.*(?:\n[ \t]+.*)*/gm, " ")
      .replace(
        /{%\s*(?:image|figure|heroImage|heroFigure|youtubeThumb)[\s\S]*?%}/g,
        " ",
      )
      .replace(/{%\s*include\s+["']promos\/[^"']+["']\s*%}/g, " ")
      .replace(/<https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^>]*>/gi, " ")
      .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
      .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
      .replace(/`[^`]+`/g, " ")
      .replace(
        /<\/?(?:figure|figcaption|picture|source|img|iframe|video|audio)[^>]*>/gi,
        " ",
      )
      .replace(/<[^>]+>/g, " ")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^>\s?/gm, "")
      .replace(/^\|?(?:\s*:?-+:?\s*\|)+\s*$/gm, " ")
      .replace(/[*_~]/g, "")
      .replace(/\|/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function hashContent(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function getArticleSlug(filePath, frontmatterSlug) {
  if (!frontmatterSlug) {
    return path.basename(path.dirname(filePath));
  }

  const slugSegments = frontmatterSlug.split("/").filter(Boolean);
  return slugSegments.at(-1) || path.basename(path.dirname(filePath));
}

function commandError(command, commandArgs, error) {
  return new Error(
    [
      `${command} failed with ${commandArgs.length} argument${commandArgs.length === 1 ? "" : "s"}`,
      error.message,
      error.stdout,
      error.stderr,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

function runFfprobe(commandArgs) {
  try {
    return execFileSync("ffprobe", commandArgs, {
      cwd: rootDirectory,
      encoding: "utf8",
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    throw commandError("ffprobe", commandArgs, error);
  }
}

function runTtsToolsBatch(commandArgs, cwd) {
  try {
    return execFileSync("uv", commandArgs, {
      cwd,
      encoding: "utf8",
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    throw commandError("uv", commandArgs, error);
  }
}

function runF5CloneVoice(commandArgs, cwd) {
  try {
    return execFileSync("bash", commandArgs, {
      cwd,
      encoding: "utf8",
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    throw commandError("bash", commandArgs, error);
  }
}

function runFfmpeg(commandArgs) {
  try {
    return execFileSync("ffmpeg", commandArgs, {
      cwd: rootDirectory,
      encoding: "utf8",
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    throw commandError("ffmpeg", commandArgs, error);
  }
}

function formatDuration(seconds) {
  const roundedSeconds = Math.round(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = String(roundedSeconds % 60).padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function getAudioDuration(filePath) {
  const output = runFfprobe([
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ]).trim();

  return formatDuration(Number(output));
}

function getGeneratedDate() {
  const generatedAt = new Date();
  const year = generatedAt.getFullYear();
  const month = String(generatedAt.getMonth() + 1).padStart(2, "0");
  const day = String(generatedAt.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function resolveTtsToolsDirectory() {
  return path.resolve(process.env.TTS_TOOLS_DIR || defaultTtsToolsDirectory);
}

function resolveF5TtsDirectory() {
  return path.resolve(process.env.F5_TTS_DIR || defaultF5TtsDirectory);
}

function splitTextIntoChunks(text, maximumCharacters) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (!currentChunk) {
      currentChunk = sentence;
      continue;
    }

    const candidateChunk = `${currentChunk} ${sentence}`;

    if (candidateChunk.length <= maximumCharacters) {
      currentChunk = candidateChunk;
      continue;
    }

    chunks.push(currentChunk);
    currentChunk = sentence;
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks.flatMap((chunk) => {
    if (chunk.length <= maximumCharacters) {
      return [chunk];
    }

    const words = chunk.split(/\s+/);
    const wordChunks = [];
    let currentWordChunk = "";

    for (const word of words) {
      const candidateWordChunk = currentWordChunk
        ? `${currentWordChunk} ${word}`
        : word;

      if (candidateWordChunk.length <= maximumCharacters) {
        currentWordChunk = candidateWordChunk;
        continue;
      }

      if (currentWordChunk) {
        wordChunks.push(currentWordChunk);
      }

      currentWordChunk = word;
    }

    if (currentWordChunk) {
      wordChunks.push(currentWordChunk);
    }

    return wordChunks;
  });
}

function generateChunksWithTtsTools({
  slug,
  cleanText,
  textPath,
  chunksDirectory,
}) {
  const ttsToolsDirectory = resolveTtsToolsDirectory();
  const audioPromptPath = path.resolve(
    ttsToolsDirectory,
    process.env.TTS_AUDIO_PROMPT_PATH || "sample03.mp3",
  );

  if (!fs.existsSync(ttsToolsDirectory)) {
    throw new Error(
      `TTS tools directory not found: ${ttsToolsDirectory}. Set TTS_TOOLS_DIR to override.`,
    );
  }

  if (!fs.existsSync(audioPromptPath)) {
    throw new Error(
      `TTS audio prompt not found: ${audioPromptPath}. Set TTS_AUDIO_PROMPT_PATH to override.`,
    );
  }

  fs.rmSync(chunksDirectory, { recursive: true, force: true });
  fs.mkdirSync(chunksDirectory, { recursive: true });
  fs.writeFileSync(textPath, cleanText);

  const pythonCode = `
import sys
from pathlib import Path
import tts_batch_processor as batch

input_path = Path(sys.argv[1])
chunks_directory = Path(sys.argv[2])
slug = sys.argv[3]
audio_prompt_path = sys.argv[4]
max_parallel_chunks = int(sys.argv[5])

batch.AUDIO_PROMPT_PATH = audio_prompt_path
batch.MAX_PARALLEL_CHUNKS = max_parallel_chunks
chunks_directory.mkdir(parents=True, exist_ok=True)

text = input_path.read_text(encoding="utf-8").strip()
chunks = batch.process_text_into_chunks(text)
if not chunks:
    raise SystemExit("No TTS chunks were produced")

output_base = chunks_directory / slug
files = batch.generate_audio_parallel(chunks, str(output_base), "generated")
if any(file is None for file in files):
    raise SystemExit("One or more TTS chunks failed")
`;

  runTtsToolsBatch(
    [
      "run",
      "python",
      "-c",
      pythonCode,
      textPath,
      chunksDirectory,
      slug,
      audioPromptPath,
      process.env.TTS_MAX_PARALLEL_CHUNKS || "2",
    ],
    ttsToolsDirectory,
  );
}

function generateChunksWithF5Tts({
  slug,
  cleanText,
  textPath,
  chunksDirectory,
}) {
  const f5TtsDirectory = resolveF5TtsDirectory();
  const cloneVoiceScriptPath = path.join(f5TtsDirectory, "clone_voice.sh");
  const f5OutputDirectory = path.join(f5TtsDirectory, "output");
  const maximumCharacters = Number(process.env.F5_TTS_MAX_CHARS || "120");

  if (!fs.existsSync(f5TtsDirectory)) {
    throw new Error(
      `F5-TTS directory not found: ${f5TtsDirectory}. Set F5_TTS_DIR to override.`,
    );
  }

  if (!fs.existsSync(cloneVoiceScriptPath)) {
    throw new Error(
      `F5-TTS clone voice script not found: ${cloneVoiceScriptPath}.`,
    );
  }

  const chunks = splitTextIntoChunks(cleanText, maximumCharacters);
  const chunkPlanPath = path.join(chunksDirectory, "plan.json");
  const chunkPlan = {
    contentHash: hashContent(cleanText),
    maximumCharacters,
    chunks,
  };
  const existingChunkPlan = readJson(chunkPlanPath, null);

  if (JSON.stringify(existingChunkPlan) !== JSON.stringify(chunkPlan)) {
    fs.rmSync(chunksDirectory, { recursive: true, force: true });
  }

  fs.mkdirSync(chunksDirectory, { recursive: true });
  fs.writeFileSync(textPath, cleanText);
  writeJson(chunkPlanPath, chunkPlan);

  if (chunks.length === 0) {
    throw new Error(`No F5-TTS chunks were produced for ${slug}`);
  }

  for (const [index, chunk] of chunks.entries()) {
    const paddedIndex = String(index + 1).padStart(3, "0");
    const outputFileName = `${slug}-${paddedIndex}.wav`;
    const f5OutputPath = path.join(f5OutputDirectory, outputFileName);
    const chunkOutputPath = path.join(chunksDirectory, outputFileName);

    const cachedChunkIsReusable =
      fs.existsSync(chunkOutputPath) && fs.statSync(chunkOutputPath).size > 0;

    if (cachedChunkIsReusable) {
      console.log(`Reusing F5-TTS chunk ${paddedIndex}/${chunks.length}`);
      continue;
    }

    fs.rmSync(f5OutputPath, { force: true });
    console.log(`Generating F5-TTS chunk ${paddedIndex}/${chunks.length}`);
    try {
      runF5CloneVoice(
        [cloneVoiceScriptPath, chunk, outputFileName],
        f5TtsDirectory,
      );
    } catch (error) {
      throw new Error(
        [
          `F5-TTS failed while generating chunk ${paddedIndex}/${chunks.length}.`,
          `Try lowering F5_TTS_MAX_CHARS below ${maximumCharacters} if this is a segmentation fault.`,
          error.message,
        ].join("\n"),
      );
    }

    if (!fs.existsSync(f5OutputPath)) {
      throw new Error(`F5-TTS did not create expected file: ${f5OutputPath}`);
    }

    fs.copyFileSync(f5OutputPath, chunkOutputPath);
  }
}

function generateChunks({
  slug,
  cleanText,
  textPath,
  chunksDirectory,
  audioProvider,
}) {
  if (audioProvider === "tts-tools") {
    generateChunksWithTtsTools({ slug, cleanText, textPath, chunksDirectory });
    return;
  }

  if (audioProvider === "f5") {
    generateChunksWithF5Tts({ slug, cleanText, textPath, chunksDirectory });
    return;
  }

  throw new Error(
    `Unsupported audio provider: ${audioProvider}. Use "tts-tools" or "f5".`,
  );
}

function combineChunks({ slug, chunksDirectory, outputPath }) {
  const chunkFiles = fs
    .readdirSync(chunksDirectory)
    .filter((fileName) => fileName.endsWith(".wav"))
    .sort()
    .map((fileName) => path.join(chunksDirectory, fileName));

  if (chunkFiles.length === 0) {
    throw new Error(`No WAV chunks generated for ${slug}`);
  }

  const concatListPath = path.join(chunksDirectory, "concat.txt");
  fs.writeFileSync(
    concatListPath,
    chunkFiles
      .map((filePath) => `file '${filePath.replace(/'/g, "'\\''")}'`)
      .join("\n"),
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  runFfmpeg([
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatListPath,
    "-codec:a",
    "libmp3lame",
    "-q:a",
    "4",
    outputPath,
  ]);
}

function updateFrontmatter({
  filePath,
  parsed,
  audioSrc,
  duration,
  generatedAt,
}) {
  parsed.data.audio = true;
  parsed.data.audioSrc = audioSrc;
  parsed.data.audioDuration = duration;
  parsed.data.audioGeneratedAt = generatedAt;
  parsed.data.audioVoice =
    parsed.data.audioVoice || process.env.TTS_VOICE || "Andrew";
  parsed.data.audioDisclosure =
    parsed.data.audioDisclosure || "AI narrated using Andrew's voice";

  fs.writeFileSync(filePath, matter.stringify(parsed.content, parsed.data));
}

function main() {
  const manifest = readJson(manifestPath, []);
  const manifestBySlug = new Map(manifest.map((entry) => [entry.slug, entry]));
  const articleFiles = articleDirectories.flatMap((directory) =>
    findArticleFiles(directory),
  );
  const updatedManifest = [];
  let generatedCount = 0;
  let skippedCount = 0;

  for (const filePath of articleFiles) {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    const slug = getArticleSlug(filePath, parsed.data.slug);
    const audioProvider =
      providerArg || parsed.data.audioProvider || defaultAudioProvider;

    if (slugArg && slug !== slugArg) {
      continue;
    }

    const existingManifestEntry = manifestBySlug.get(slug);

    if (!parsed.data.audio) {
      if (existingManifestEntry) {
        updatedManifest.push(existingManifestEntry);
      }
      continue;
    }

    const cleanText = cleanArticleText(parsed.content);
    const contentHash = hashContent(cleanText);
    const audioSrc = `/audio/posts/${slug}.mp3`;
    const outputPath = path.join(publicAudioDirectory, `${slug}.mp3`);
    const articleCacheDirectory = path.join(cacheDirectory, slug);
    const textPath = path.join(articleCacheDirectory, `${slug}.txt`);
    const cachedContentMatches =
      fs.existsSync(textPath) &&
      hashContent(fs.readFileSync(textPath, "utf8")) === contentHash;
    const recoveredManifestEntry =
      !existingManifestEntry &&
      providerArg === undefined &&
      cachedContentMatches &&
      fs.existsSync(outputPath) &&
      parsed.data.audioDuration &&
      parsed.data.audioGeneratedAt
        ? {
            slug,
            provider: audioProvider,
            contentHash,
            audioSrc,
            duration: parsed.data.audioDuration,
            generatedAt: parsed.data.audioGeneratedAt,
          }
        : null;

    if (!force && recoveredManifestEntry) {
      skippedCount += 1;
      updatedManifest.push(recoveredManifestEntry);
      if (!dryRun) {
        writeManifest(updatedManifest, manifest);
      }
      console.log(`Recovered ${slug}: audio is current`);
      continue;
    }

    const unchanged =
      !force &&
      existingManifestEntry?.contentHash === contentHash &&
      (existingManifestEntry?.provider || "tts-tools") === audioProvider &&
      fs.existsSync(outputPath);

    if (unchanged) {
      skippedCount += 1;
      updatedManifest.push(existingManifestEntry);
      console.log(`Skipped ${slug}: audio is current`);
      continue;
    }

    if (dryRun) {
      console.log(`Would generate ${slug}`);
      updatedManifest.push(
        existingManifestEntry || {
          slug,
          provider: audioProvider,
          contentHash,
          audioSrc,
          duration: parsed.data.audioDuration || "",
          generatedAt: parsed.data.audioGeneratedAt || "",
        },
      );
      continue;
    }

    const chunksDirectory = path.join(articleCacheDirectory, "chunks");

    fs.mkdirSync(articleCacheDirectory, { recursive: true });

    console.log(`Generating audio for ${slug}`);
    generateChunks({
      slug,
      cleanText,
      textPath,
      chunksDirectory,
      audioProvider,
    });
    combineChunks({ slug, chunksDirectory, outputPath });

    const duration = getAudioDuration(outputPath);
    const generatedAt = getGeneratedDate();

    updateFrontmatter({
      filePath,
      parsed,
      audioSrc,
      duration,
      generatedAt,
    });

    updatedManifest.push({
      slug,
      provider: audioProvider,
      contentHash,
      audioSrc,
      duration,
      generatedAt,
    });
    writeManifest(updatedManifest, manifest);
    generatedCount += 1;
    console.log(`Generated ${audioSrc} (${duration})`);
  }

  for (const entry of manifest) {
    if (
      !updatedManifest.some((updatedEntry) => updatedEntry.slug === entry.slug)
    ) {
      updatedManifest.push(entry);
    }
  }

  if (!dryRun) {
    writeManifest(updatedManifest, manifest);
  }

  console.log(`Done. Generated ${generatedCount}, skipped ${skippedCount}.`);
}

main();
