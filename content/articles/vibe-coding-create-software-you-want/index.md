---
title: Vibe Coding to Create the Software You Want
date: "2025-06-01T17:26:10Z"
template: post
draft: false
slug: "vibe-coding-create-software-you-want"
category: article
tags:
  - ai-tools
  - vibe-coding
  - popclip
  - markdown
  - macos
  - workflow-automation
  - software-development
description: "Discover how vibe coding with AI tools can help you build custom software that fits your workflow. Learn how to create a PopClip extension for instant Markdown formatting on macOS using AI agents, and build tools that adapt to your work instead of forcing you to adapt to them."
ogimage: "vibe-coding-create-software-you-want.png"
---

{% figure "./vibe-coding-software.png", "Vibe Coding to Create the Software You Want" %}

## Vibe Coding to Create the Software You Want

Lately, I've been leaning hard into AI tools — getting agents to help me write scripts or build extensions for the tools I already use heavily. One of those tools is [**Popclip**](https://pilotmoon.com/popclip/) on macOS.

If you're not familiar, Popclip gives you a little popup toolbar when you select text — kind of like what you get on iOS with copy, paste, and lookup options. But unlike iOS, Popclip is totally extensible. And once you start customising it, you quickly realise how powerful it can be.

## Markdown Is Everywhere

It used to be that Markdown was just a "developer thing" — for README files or blog engines like Jekyll. Now it's _everywhere_:

- Writing notes in **Obsidian**
- Formatting messages in **Slack** or **Teams**
- Opening pull requests and writing issues on **GitHub**
- Writing docs and snippets in **wikis**
- Prompting AI tools like **ChatGPT**, **Claude**, or **Raycast**

Once you start paying attention, you realise how often you're formatting the same way: **bold**, _italic_, # headers, and so on. It becomes muscle memory. But for lists and block elements, it still feels clunky. That got me thinking...

## What If I Could Just Format Selected Text Instantly?

I wanted a quick, frictionless way to apply **Markdown** formatting to any **selected text** _anywhere_ on macOS. Whether I'm in Obsidian, a browser, or some Electron app, I just want to highlight something and turn it into a bullet point, inline code, or task item. Nothing fancy—just fast.

I already had basic options in Popclip like **Bold** and **Italic**, but I wanted more. I wanted it to _feel_ seamless. Not another window. Not a menu bar app I had to dig into. Just highlight -> click -> done.

## Building What I Want

So I started planning a Popclip extension for Markdown formatting - bullets, inline code, block quotes. All standard Markdown, all consistent, and easy to apply.

But I had no idea where to start. This is where [Vibe Coding](https://en.wikipedia.org/wiki/Vibe_coding) really shines.

> Vibe coding involves describing the desired functionality or problem in plain language to an AI model, which then generates the corresponding code.

For low-stakes software like a script or extension, you don't need a full-blown dev process. It's not meant for millions of users or critical infrastructure. It's just something to smooth out the rough edges of daily work.

## How I Did It

I began by outlining what I needed, gave the agent some docs, and linked to example plugins. Within minutes, I had a proof of concept doing eighty percent of what I wanted.

[AGENTS.md](https://github.com/andrewjamesford/popclip-markdown-formatter/blob/main/AGENTS.md#L1)

Once that's in place, I start outlining the task in detail. Examples help massively. Through iterative conversations with the agent, I get most of the way there without having to read the code line by line. It's the kind of work I can do while watching YouTube or multitasking. I just check in, review the results, and guide the next step.

Is it perfect? Nope. Sometimes things break and I roll back. But that's what Git is for. As the plugin stabilises, I'm even getting the agent to write tests so I don't have to manually verify every tweak.

## The Final Product

{% figure "./popclip-markdown-formatter.png", "Popclip Markdown Formatter Extension" %}

This extension is now part of my daily flow. Doesn't matter if I'm replying in Slack, cleaning up a README, or writing an AI prompt — it's just _there_. That's the kind of tool I love — one that adapts to how I work instead of forcing me to adapt to it.

"Vibe coding" is about building workflows and tools that _fit your rhythm_ with minimal effort. You don't need to launch a full app. Sometimes, it's a script, an extension, a shortcut. But it makes a real difference — and reminds you that you _can_ shape the way your tools behave.

If something feels clunky or repetitive, don't just put up with it. You've got the skills — and the agents — to fix it.

You can download the [Popclip Markdown Formatter extension project available here](https://github.com/andrewjamesford/popclip-markdown-formatter).
