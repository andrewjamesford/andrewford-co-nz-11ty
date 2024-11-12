---
title: Make ChatGPT even easier shortcut on iOS
date: "2023-06-24T16:23:02Z"
template: post
draft: false
slug: "chatgpt-shortcut-on-ios"
category: article
tags:
  - chatgpt
  - ios
  - shortcut
description: A better way to use ChatGPT on iOS and not lose your context using this shortcut.
---

## Use the ChatGPT app shortcut action on iOS

**UPDATE**
Unfortunately the shortcut doesn't work anymore. I'd suggest you use the FREE [AI Actions](https://apps.apple.com/nz/app/ai-actions-for-shortcuts/id6465250302) app from Sindre Sorhus which will allow you to build your own custom AI actions in Shortcuts or the official [ChatGPT app](https://apps.apple.com/us/app/chatgpt/id6448311069).

Previously I wrote about [how to use ChatGPT on macOS and iOS using Shortcuts](/articles/chatgpt-macos-ios-using-shortcuts). I've now created a iOS Shortcut that uses the [ChatGPT app](https://chatgpt.com) and it's shortcut action to do your bidding. This means you don't need to create an OpenAI API key to use it, history is available in the app and less _copy & pasting_ on an iPhone (which is not always easy).

youtube.com/embed/fD1nNVAyY7E

### How to use it

1. Install the [ChatGPT app](https://apps.apple.com/us/app/chatgpt/id6448311069) from the App Store
2. Install my [ChatGPT shortcut from here](https://www.icloud.com/shortcuts/34ad5973ed41401bab872a407e324da1) and click the "Get Shortcut" button
3. Make sure you have signed in to the ChatGPT app (if not open it now and login)
4. From the share sheet on an article on Safari scroll the page down to you come across the share action "ChatGPT" and tap it
5. The shortcut will open a prompt asking "What would you like ChatGPT to do?"
6. Enter a prompt of your own choosing, I like to use "Summarize this article" or "Summarize this page"
7. The shortcut will show a loading icon and then display your answer in an alert box with a "Done" button
8. The shortcut automatically copies the answer to your clipboard so you can paste it into another app

{% figure "./chatgpt-ios-shortcut.webp", "Using the shortcut to summarise an article" %}

### How it works

The shortcut takes input from the Share Sheet "Text", "Rich Text", "Safari web pages" and "Articles". It then gets your prompt from the input box that pops up. It then appends say the URL of a website to your prompt. For example I was on an article on [Stuff](https://i.stuff.co.nz/national/education/300847887/chatgpt-how-teachers-are-bringing-ai-tech-into-the-classroom) and this is what is passed to ChatGPT:

```text
"Summarise this article" +
https://i.stuff.co.nz/...
```

The shortcut then passes that to the action provided by the ChatGPT iOS app which returns the answer. The shortcut then displays the answer in an alert box and copies it to the clipboard.

### Why should I use this shortcut?

The shortcut is a native iOS shortcut that uses the ChatGPT app action to perform an action directly from the context that you currently in. Say you have seen an article and you would like to summarise it.

Instead of having to select and copy text to your clipboard which can be hard to do on a iPhone or iPad you can just tap the share sheet and select the ChatGPT shortcut. The shortcut will then perform what you prompt it to do.

The best part about this as this is you are using your logged in account in the ChatGPT app and can open the app and see the history of all the prompts you have made. This is a great way to keep track of what you have been doing or to go back to read a previous summary.

### What are the limitations?

The only limitation is because the ChatGPT app is not on MacOS you can't use this same shortcut on your Mac. You can still use the [ChatGPT shortcut for macOS and iOS](/articles/chatgpt-macos-ios-using-shortcuts) which uses the OpenAI API.
