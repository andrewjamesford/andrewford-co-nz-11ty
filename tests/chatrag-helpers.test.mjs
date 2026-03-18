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

test("formatDocumentSlug does not append a trailing slash to file urls", () => {
  assert.equal(
    formatDocumentSlug("fasttempo-privacy-policy.html"),
    "/fasttempo-privacy-policy.html"
  );
});

test("getRawDocumentSlug prefers permalink frontmatter over file path inference", () => {
  const slug = getRawDocumentSlug({
    pageContent:
      'permalink: "/2017/05/27/probably-already-work-facebook/"\n---\ntitle: Test\n---',
    metadata: {
      source:
        "/Users/andrewford/Developer/Projects/Blog/andrewford-co-nz-11ty/content/archive/2017-05-27-probably-already-work-facebook/index.md",
    },
  });

  assert.equal(slug, "/2017/05/27/probably-already-work-facebook/");
  assert.deepEqual(
    getSourceLinks(
      [
        {
          pageContent:
            'permalink: "/2017/05/27/probably-already-work-facebook/"\n---\ntitle: Test\n---',
          metadata: {
            source:
              "/Users/andrewford/Developer/Projects/Blog/andrewford-co-nz-11ty/content/archive/2017-05-27-probably-already-work-facebook/index.md",
          },
        },
      ],
      "https://andrewford.co.nz"
    ),
    ["https://andrewford.co.nz/2017/05/27/probably-already-work-facebook/"]
  );
});
