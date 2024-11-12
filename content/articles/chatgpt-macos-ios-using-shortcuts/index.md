---
title: Make ChatGPT easy to use on macOS and iOS using Shortcuts
date: "2023-02-04T14:23:11Z"
template: post
draft: false
slug: "chatgpt-macos-ios-using-shortcuts"
category: article
tags:
  - chatgpt
  - macos
  - ios
  - shortcuts
description: A tutorial on making it easy to use ChatGPT on macOS and iOS using shortcuts.
ogimage: "popclip-in-action.png"
---

## What is ChatGPT?

ChatGPT is an open-source chatbot that uses GPT-3 (Generative Pre-trained Transformer) to generate natural language responses based on the user's input. In the tech community, there is a lot of excitement for where Machine Learning tools like it can be used next.

## What could I use ChatGPT for?

[ChatGPT](https://chat.openai.com/chat) can be used for a variety of purposes, including creating conversational chatbots and virtual assistants, automated customer service bots, natural language processing tasks such as sentiment analysis or text summarization, and more.

You could use it to rewrite a paragraph that your not happy with in a document, move past your writers block or use it like a personal assistant to write an email reply. The number of uses get larger by the day, as people figure out novel ways to incorporate it into their lives.

While you can use it directly from the website (via copying and pasting) or through plugins for tools like [Obsidian](http://obsidian.md) with the [Ava plugin](obsidian://show-plugin?id=ava). I wanted to be able to use it from any application on both macOS or iOS, so I put together a way to use the ChatGPT API via an [Apple Shortcut](https://support.apple.com/en-nz/guide/shortcuts/welcome/ios).

## What are Apple Shortcuts?

Apple Shortcuts is a powerful automation app for iPhone, iPad and Mac that allows users to create automated workflows. It can be used to automate tasks such as sending messages, navigating maps, controlling music playback, opening apps and more. With Apple Shortcuts, users can save time by automating repetitive tasks so they can focus on the things that matter most.

## Creating a "shortcut" using the ChatGPT API

**🚨 Update 🚨**

**Since I wrote this Open AI have released an iOS app with a shortcut action [see how it works here](https://andrewford.co.nz/articles/chatgpt-shortcut-on-ios).**

{% image "./openai-create-new-key.png", "How to create an OpenAI key" %}

To be able to use the Shortcut I've created you will need to first create an account with [OpenAI](https://beta.openai.com/signup). Head to their sign up page, fill in your details then got to the [View API Keys page](https://platform.openai.com/account/api-keys). Follow the instructions above.

{% image "./openai-api-key-generated.png", "Generate OpenAI key" %}

You then need to create an API key to use with our Shortcut, click on the "+ Create new secret key" button. Copy the new key by clicking the green button.

Either on macOS or on iOS [click this link to my shortcut](https://www.icloud.com/shortcuts/376d66df029f4a74b2e2098fd0253cd1) and "Add Shortcut".

Open up the shortcut (right click and Edit on macOS) to edit. Paste the key into the Text section of the shortcut shown in the image below and close the shortcut.

{% image "./add-key-shortcut.png", "Add key to shortcut" %}

For personal use they credited $18 until May for me when I created an account. I've barely run up any credit so far. Under $0.10, in fact it's very cheap.

## How to use it?

This shortcut is flexible in that it can be used in multiple ways. If no text is selected it will take the contents of the clipboard. Otherwise you can select text in iOS and then use the Share icon like in the video below.

youtube.com/embed/LdzR17IGpQw

On macOS it's a little different. You first select the text and copy it to your clipboard. You can then invoke the shortcut by going up to the menu bar and running the shortcut from there.

{% image "./shortcuts-macOS.png", "Run a shortcut on macOS from the menu bar" %}

## Alternative way to use the shortcut (macOS)

{% image "./popclip-in-action.png", "PopClip in action" %}

I'm a big fan of the app [PopClip](https://pilotmoon.com/popclip/) on macOS that acts like the pop up selection menu for copy and paste on iOS (as seen in the image above). It can be used to invoke a Shortcut and I've created an [extension](https://andrewford.co.nz/assets/ChatGPTpopclipext.zip) that allows me to select some text with the mouse and then trigger the ChatGPT shortcut. See the video below to see how it works.

youtube.com/embed/xqFsMzWzi5U

The developer of PopClip has created an [extension snippet](https://forum.popclip.app/t/a-popclip-extension-for-chatgpt/1283) that will paste the response after your cursor in a text editor app.
