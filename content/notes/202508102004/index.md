---
title: Get Instant Notifications When Claude Code Needs You
date: "2025-08-10T20:04:35Z"
template: post
draft: false
slug: "202508102004"
category: note
tags:
  - claude code
  - hooks
  - notifications
  - ntfy
  - automation
  - developer tools
description: "Learn how to get instant push notifications when Claude Code needs your attention using hooks and ntfy.sh - never miss when your AI assistant needs input again"
---

_Never miss when your AI coding assistant needs your attention - get push notifications to your phone or desktop using ntfy.sh with Claude Code Hooks_

{% image "./ntfy-notification.png", "Claude Code Notification Example" %}

## The Problem: Claude Code Works in Silence

If you're using Claude Code for complex, long-running tasks, you've probably experienced this frustration: You start Claude on a task, switch to another window or grab coffee, only to return 10 minutes later to find it's been patiently waiting for your permission to edit a file or run a command. All that time wasted because you didn't know it needed your input.

Claude Code is incredibly powerful at autonomous coding, but it still needs human approval for certain actions - and by default, it waits silently. This is where Claude Code's new [hooks feature](https://docs.anthropic.com/en/docs/claude-code/hooks-guide) combined with ntfy.sh creates a perfect notification solution.

## What Are Claude Code Hooks?

Claude Code hooks are user-defined shell commands that execute at various points in Claude Code's lifecycle. Hooks provide deterministic control over Claude Code's behavior, ensuring certain actions always happen rather than relying on the LLM to choose to run them.

Think of hooks as triggers that fire automatically at specific moments:

- **PreToolUse**: Before Claude uses any tool (like editing a file)
- **PostToolUse**: After a tool completes successfully
- **Notification**: When Claude needs your attention
- **Stop**: When Claude finishes responding

The Notification hook is particularly useful - it runs when Claude needs your permission to use a tool or when the prompt input has been idle for at least 60 seconds.

## Enter ntfy.sh: Dead Simple Push Notifications

ntfy is a simple HTTP-based pub-sub notification service. It allows you to send notifications to your phone or desktop via scripts from any computer, and/or using a REST API. What makes ntfy perfect for this use case:

- **No authentication required** for basic usage
- **Cross-platform** - works on Android, iOS, and desktop browsers
- **Simple HTTP API** - just send a POST/PUT request
- **Free tier** available at ntfy.sh
- **Self-hostable** if you prefer to run your own server

## The Solution: Combining Claude Code Hooks with ntfy

Here's the elegant solution that sends you push notifications whenever Claude needs your attention:

### Step 1: Set Up Your ntfy Topic

First, you'll need a topic on ntfy.sh:

1. **On your phone**: Install the ntfy app from [Google Play](https://play.google.com/store/apps/details?id=io.heckel.ntfy), [F-Droid](https://f-droid.org/en/packages/io.heckel.ntfy/), or [App Store](https://apps.apple.com/us/app/ntfy/id1625396347)

2. **Choose a topic name**: Pick something unique and hard to guess (topics are public). For example: `my-claude-alerts-x7y9z`

3. **Subscribe to your topic**:
   - Open the ntfy app
   - Tap the "+" button to subscribe to a topic
   - Enter your topic name
   - The app will now listen for notifications on this topic

### Step 2: Configure the Claude Code Hook

Add this configuration to your Claude Code settings file. You can place it in either:

- **Project-specific**: `.claude/settings.json` (for this project only)
- **User-wide**: `~/.claude/settings.json` (for all your projects)

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -d \"Claude needs your attention\" ntfy.sh/$NTFY_TOPIC"
          }
        ]
      }
    ]
  }
}
```

### Step 3: Set Your Environment Variable

Set the `NTFY_TOPIC` environment variable to your chosen topic:

```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export NTFY_TOPIC="my-claude-alerts-x7y9z"
```

Or set it temporarily for your current session:

```bash
export NTFY_TOPIC="my-claude-alerts-x7y9z"
```

### Step 4: Test It

Start Claude Code and give it a task that requires permission:

```bash
claude "Create a new file called test.py with a hello world function"
```

When Claude needs your permission to create the file, you'll receive a push notification on your phone/desktop!

### Not Receiving Notifications?

1. **Check your topic subscription**: Ensure you're subscribed to the correct topic in the ntfy app
2. **Test manually**: Try sending a test notification:

   ```bash
   curl -d "Test message" ntfy.sh/your-topic-name
   ```

3. **Verify environment variable**:

   ```bash
   echo $NTFY_TOPIC
   ```

4. **Check Claude Code logs**: Look for any error messages when the hook executes

## Conclusion

Hooks provide deterministic control over Claude Code behavior without relying on LLM decisions. By combining Claude Code's hooks with ntfy's simple notification service, you've created a powerful automation that ensures you never miss when your AI assistant needs your attention.

This setup transforms Claude Code from a tool that requires constant monitoring into a true background assistant that only interrupts you when necessary. Whether you're working on complex refactoring, running test suites, or letting Claude handle routine tasks, you can now focus on other work knowing you'll be alerted the moment your input is needed.

The beauty of this solution lies in its simplicity - just a few lines of configuration give you instant, cross-platform notifications without any complex authentication or setup. Start using it today and reclaim those lost minutes waiting for Claude to finish its work.

## TLDR; / Quick Reference

**Basic Hook Configuration:**

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -d \"Claude needs your attention\" ntfy.sh/$NTFY_TOPIC"
          }
        ]
      }
    ]
  }
}
```

See it in my [Claude Code settings repo on GitHub](https://github.com/andrewjamesford/claude-code)

**Environment Setup:**

```bash
export NTFY_TOPIC="your-unique-topic-name"
```

**Test Command:**

```bash
curl -d "Test notification" ntfy.sh/$NTFY_TOPIC
```

---

_Ready to try it out? Set up the [ntfy app](https://ntfy.sh/), set up your hook, and never miss another Claude Code notification again!_
