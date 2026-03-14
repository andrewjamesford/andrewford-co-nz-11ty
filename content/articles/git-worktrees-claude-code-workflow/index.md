---
title: The Git Feature I Wish I'd Known About Years Ago (And How Claude Code Makes It Easy)
date: "2025-08-17T13:06:33Z"
template: post
draft: false
slug: "git-worktrees-claude-code-workflow"
category: article
tags:
  - git
  - productivity
  - development-workflow
  - claude-code
  - automation
  - version-control
  - developer-tools
description: "Git worktrees let you work on different branches at the same time without the stash-switch-repeat cycle that kills productivity. Learn how I created a custom Claude Code command that sets up parallel development environments with just a simple natural language request."
---

We've all been there. You're deep in the middle of implementing a feature when suddenly you need to fix a critical bug. Your code isn't ready to commit, you're right in the middle of something important, and the traditional git workflow feels clunky. Stash your changes, switch branches, lose your mental context, then reverse the process when you're done.

<https://www.youtube.com/watch?v=tuRRuVcZTew>

After years of this frustrating dance, I discovered **git worktrees** - and they completely changed how I work with Git.

## What Are Git Worktrees?

[Git worktrees](https://git-scm.com/docs/git-worktree) provide a mechanism to manage multiple working trees associated with a single Git repository. This allows developers to check out and work on different branches simultaneously in separate directories without interfering with each other.

Instead of the stash-switch-unstash cycle, you can literally have your main feature branch open in one directory while working on a bug fix in a completely separate directory. No context switching, no losing your place, no interference between branches.

## The Problem in Action

Let me show you exactly what I mean. In [this video demonstration](https://www.youtube.com/watch?v=tuRRuVcZTew), I start with a common scenario: I'm on my main branch with untracked files - right in the middle of working on something. Suddenly, I need to create a new branch to fix a sign-up issue in my application.

With traditional Git, this would mean stashing my changes, creating a new branch, switching to it, and then remembering to switch back and unstash later. With worktrees, it's completely different.

## My Claude Code Solution

I've automated this entire process with a custom Claude Code command. In my [Claude Code repository](https://github.com/andrewjamesford/claude-code/blob/main/commands/chores/worktree.md), I've created a `/worktree` slash command that handles all the complexity for you.

Here's how it works:

1. **Natural Language Interface**: Instead of remembering git syntax, I just tell Claude what I want: "create a new branch for signup fix"

2. **Automatic Setup**: The command:

   - Checks for existing worktrees
   - Creates the new branch and separate directory
   - Sets up the development environment (runs `npm install`, etc.)
   - Provides clear next steps

3. **Parallel Development**: I end up with two completely separate directories:
   - `my-project/` (main branch with my current work)
   - `my-project-signup-fix/` (new bug fix branch)

## The Magic in Practice

As shown in the video, after running my custom command, I get a separate directory structure where both environments coexist peacefully. The packages are already installed, the branch is set up, and I can immediately start working on the fix without losing any context from my main work.

When I'm done with the bug fix, I can commit and push from that directory, then simply return to my main project directory where everything is exactly as I left it.

## Why This Changes Everything

Git worktrees solve fundamental workflow problems:

- **No Context Switching**: Keep multiple branches active simultaneously
- **Preserve Working State**: No need to stash incomplete work
- **Parallel Development**: Work on features while builds run in another worktree
- **Separate Dependencies**: Each worktree maintains its own `node_modules`, virtual environments, etc.
- **Easy Comparisons**: Compare implementations across branches side-by-side

## Getting Started

If you want to try this workflow:

1. **Learn about git worktrees**: Check out the [official documentation](https://git-scm.com/docs/git-worktree)
2. **Get my custom command**: Visit my [GitHub repository](https://github.com/andrewjamesford/claude-code/blob/main/commands/chores/worktree.md) to grab the Claude Code slash command
3. **Watch the demo**: See it in action in [my video walkthrough](https://www.youtube.com/watch?v=tuRRuVcZTew)

The combination of git worktrees and Claude Code's natural language interface has completely transformed how I handle parallel development tasks. No more workflow interruptions, no more lost context - just smooth, efficient development.

_Have you tried git worktrees? What's your experience with context switching in Git? Let me know on [X](https://x.com/codeandrewford)!_
