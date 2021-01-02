---
title: 'Announcing TypeScript 2.4 - Dynamic Import Expressions'
date: "2017-06-29T14:07:52+00:00"
template: post
draft: false
slug: "/2017/06/29/announcing-typescript-2-4-dynamic-imports/"
category: "article"
tags:
  - TypeScript
  - link
description: ""
---

<a href="https://blogs.msdn.microsoft.com/typescript/2017/06/27/announcing-typescript-2-4/">Daniel Rosenwasser</a>:
<blockquote>Dynamic import expressions are a new feature in ECMAScript that allows you to asynchronously request a module at any arbitrary point in your program. These modules come back as Promises of the module itself, and can be await-ed in an async function, or can be given a callback with .then.

What this means in short that you can conditionally and lazily import other modules and libraries to make your application more efficient and resource-conscious.</blockquote>
A great new feature for ECMAscript now available in TypeScript.