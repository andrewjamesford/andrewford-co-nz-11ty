import test from "node:test";
import assert from "node:assert/strict";
import {
  formatDocumentSlug,
  getRawDocumentSlug,
  getSourceLinks,
} from "../api/routes/chatrag.mjs";

test("getRawDocumentSlug infers article paths from frontmatter slugs", () => {
  const slug = getRawDocumentSlug({
    pageContent: 'slug: "rag-to-build-chatbot-with-langchain"\n',
    metadata: {
      source:
        "/Users/andrewford/Developer/Projects/Blog/andrewford-co-nz-11ty/content/articles/rag-to-build-chatbot-with-langchain/index.md",
    },
  });

  assert.equal(slug, "articles/rag-to-build-chatbot-with-langchain");
  assert.equal(
    formatDocumentSlug(slug),
    "/articles/rag-to-build-chatbot-with-langchain/"
  );
});

test("getSourceLinks normalizes metadata-derived slugs into site urls", () => {
  const sources = getSourceLinks(
    [
      {
        pageContent: "---\ntitle: Test\n---",
        metadata: {
          source:
            "/Users/andrewford/Developer/Projects/Blog/andrewford-co-nz-11ty/content/pages/about.md",
        },
      },
    ],
    "https://andrewford.co.nz"
  );

  assert.deepEqual(sources, ["https://andrewford.co.nz/pages/about/"]);
});
