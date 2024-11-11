---
title: Another easy Eleventy upgrade
date: "2024-10-06T10:10:02Z"
template: post
draft: false
slug: "another-easy-eleventy-upgrade"
category: article
tags:
  - eleventy
  - blog
  - static site generator
  - ssg
description: Another easy upgrade with the NodeJS simple static site generator Eleventy (11ty) from v2 to v3.
---

The latest version of [Eleventy v3](https://www.11ty.dev/blog/eleventy-v3/) is out. If you haven't heard of Eleventy also known as 11ty it's a fast [Static Site Generator (SSG)](https://jamstack.org/generators/) that uses NodeS. It converts in my case Markdown files into a fast, easy to maintain blog that I've used since Jan 2021. As per usual upgrading to it was easy. So what's new?

- ESM (ECMAScript Modules) support - so now you can use `import` and `export` in your templates!
- It's smaller, has fewer dependencies, and is faster to install.
- Plus a whole lot of other [goodies](https://github.com/11ty/eleventy/releases/tag/v3.0.0)

The upgrade plugin makes it super easy to upgrade. First up I wanted to take advantage of ESM syntax. I renamed my `eleventy.config.js` to `eleventy.config.mjs`. Installed the helper plugin by running:

```sh
npm install @11ty/eleventy-upgrade-help@3
```

Added the upgrade plugin to the `eleventy.config.mjs` file.
[Commit here](https://github.com/andrewjamesford/andrewford-co-nz-11ty/commit/5c7421fc21f68cf2f1af680a8826d93bdea51d27#diff-bc439a121124275aa68da5261208c3092bc56117c0984e3a134ae4285831b104R88)

```js
import UpgradeHelper from "@11ty/eleventy-upgrade-help";

// Added the upgrade helper plugin  inside the default function
eleventyConfig.addPlugin(UpgradeHelper);
```

Asked GitHub Copilot to "Update to esm syntax" and made sure the `eleventy.config.mjs` file was referenced in the chat. That converted all my `require` statements into `import` statements.

See the difference here between my [previous v2 config](https://github.com/andrewjamesford/andrewford-co-nz-11ty/blob/d4ca22e9e512c9fa8a5697beed1af9707d33e192/eleventy.config.js) to my [v3 config](https://github.com/andrewjamesford/andrewford-co-nz-11ty/blob/618c465e82021fdab51ecc68f7c26048b7a660e5/eleventy.config.mjs).

{% highlight "diff-js" %}
// v2 require statements
-const { DateTime } = require("luxon");
-const markdownItAnchor = require("markdown-it-anchor");
-const markdownIt = require("markdown-it");

-const pluginRss = require("@11ty/eleventy-plugin-rss");
-const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
-const pluginBundle = require("@11ty/eleventy-plugin-bundle");
-const pluginNavigation = require("@11ty/eleventy-navigation");
-const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

-const pluginDrafts = require("./eleventy.config.drafts.js");
-const pluginImages = require("./eleventy.config.images.js");
-const embedYouTube = require("eleventy-plugin-youtube-embed");

// v3 import statements
+import { DateTime } from "luxon";
+import markdownItAnchor from "markdown-it-anchor";
+import markdownIt from "markdown-it";

+import pluginRss from "@11ty/eleventy-plugin-rss";
+import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
+import pluginBundle from "@11ty/eleventy-plugin-bundle";
+import pluginNavigation from "@11ty/eleventy-navigation";
+import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

+import pluginDrafts from "./eleventy.config.drafts.js";
+import pluginImages from "./eleventy.config.images.js";
+import embedYouTube from "eleventy-plugin-youtube-embed";
{% endhighlight %}

Then it was time to test everything was working. Sure enough everything worked as expected. I removed the upgrade helper plugin and did a little tidy up switching syntax from commonjs to esm (es6/es2015) and pushed the branch to test the preview build (got to love Netlify's setup). The preview build looked good too, so I merged it into main. All done and dusted in under an hour. This is how all upgrades should work.
