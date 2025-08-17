#!/usr/bin/env node

/**
 * Migration script to move notes to articles with SEO-friendly names
 */

const fs = require("fs").promises;
const path = require("path");

const migrations = [
  {
    oldPath: "content/notes/202507061346",
    newSlug: "creative-process-with-ai-on-ipad",
    title: "Creative process with AI on iPad",
  },
  {
    oldPath: "content/notes/202507231344",
    newSlug: "wasted-25-years-writing-code-structured-communication",
    title:
      "I Wasted 25 Years Writing Code — Here's What I Should Have Done Instead",
  },
  {
    oldPath: "content/notes/202508102004",
    newSlug: "claude-code-instant-notifications-ntfy",
    title: "Get Instant Notifications When Claude Code Needs You",
  },
];

async function migrateNote(migration) {
  const { oldPath, newSlug, title } = migration;
  const newPath = `content/articles/${newSlug}`;

  console.log(`Migrating: ${oldPath} → ${newPath}`);

  try {
    // Create new directory
    await fs.mkdir(newPath, { recursive: true });

    // Read all files in old directory
    const files = await fs.readdir(oldPath);

    for (const file of files) {
      const oldFile = path.join(oldPath, file);
      const newFile = path.join(newPath, file);

      if (file === "index.md") {
        // Read and update frontmatter
        const content = await fs.readFile(oldFile, "utf8");
        const updatedContent = content
          .replace(/slug: ".*?"/, `slug: "${newSlug}"`)
          .replace(/category: note/, "category: article")
          .replace(/template: post/, "template: post");

        await fs.writeFile(newFile, updatedContent);
        console.log(`  ✓ Updated ${file} with new slug and category`);
      } else {
        // Copy other files (images, etc.)
        await fs.copyFile(oldFile, newFile);
        console.log(`  ✓ Copied ${file}`);
      }
    }

    console.log(`  ✓ Migration completed for ${title}\n`);
  } catch (error) {
    console.error(`Error migrating ${oldPath}:`, error);
  }
}

async function generateRedirects() {
  console.log("Generating redirects for netlify.toml...\n");

  const redirects = migrations
    .map(({ oldPath, newSlug }) => {
      const oldSlug = oldPath.split("/").pop();
      return `[[redirects]]
from = "/notes/${oldSlug}/*"
to = "/articles/${newSlug}/:splat"
status = 301`;
    })
    .join("\n\n");

  console.log("Add these redirects to netlify.toml:");
  console.log("=".repeat(50));
  console.log(redirects);
  console.log("=".repeat(50));
  console.log();
}

async function main() {
  console.log("Starting notes to articles migration...\n");

  // Migrate each note
  for (const migration of migrations) {
    await migrateNote(migration);
  }

  // Generate redirects
  await generateRedirects();

  console.log("Migration completed!");
  console.log("\nNext steps:");
  console.log("1. Add the redirects above to netlify.toml");
  console.log("2. Update templates to remove notes references");
  console.log("3. Remove the content/notes folder");
  console.log("4. Test the migration");
}

if (require.main === module) {
  main().catch(console.error);
}