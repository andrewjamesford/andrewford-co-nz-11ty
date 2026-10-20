---
title: "Building PageFlick with AI: From prototype to App Store"
date: "2026-10-20"
template: post
draft: false
slug: build-ios-app-with-ai
category: article
tags: []
ogimage: pageflick-building-with-ai.png
ogimageAlt: "Building PageFlick with AI. From prototype to App Store. PageFlick app icon and andrewford.co.nz."
ogimageWidth: 1200
ogimageHeight: 628
description: "I built PageFlick with Claude and ChatGPT in three weeks. What took 30 minutes, what testing changed, and the App Store review mistakes I should have caught."
---

## The Idea: Turning Pages Without Touching the Screen

On holiday in Bali, I watched my daughter try to read a book on her iPad in the pool. Every time she wanted to turn the page, she had to dry her hand first. The fix seemed obvious: don't touch the screen at all. Raise a finger and move your hand left or right, and the page turns.

<div style="max-width: 540px; width: 100%; margin: 1.5rem auto;">
  <iframe
    src="https://www.instagram.com/reel/DescSiVklFm/embed/"
    title="Instagram reel"
    width="540"
    height="780"
    loading="lazy"
    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
    allowfullscreen
    style="display: block; width: 100%; max-width: 100%; border: 0;"
  ></iframe>
  <p><a href="https://www.instagram.com/reel/DescSiVklFm/" target="_blank" rel="noopener noreferrer">Watch this reel on Instagram</a></p>
</div>

Today that idea is on the App Store. It's called PageFlick, an EPUB reader that turns pages with hand gestures, and it went from idea to release in three weeks. It runs on iPhone, iPad and Mac, and it's ready for iPhone Duo.

## Building a Prototype in 30 Minutes with Claude and ChatGPT

The crazy part is how fast the first proof of concept came together. I gave Claude and ChatGPT the same prompt and had each build its own version at the same time. Both were working in under 30 minutes.

That's partly the AI tools and partly Apple. Vision, AVFoundation, SwiftData, CloudKit, SwiftUI and Mac Catalyst cover almost everything an app like this needs, and the AI tools know those frameworks well.

## Why It Took Three Weeks: Experimenting When Code Is Cheap

Because when trying an idea costs almost nothing, you should try a lot of them. I rebuilt PageFlick several times, trying different gestures, layouts and feature sets before settling on version 1.0.

### What Changed During Testing

- **Buttons came back.** Old habits die hard. During testing I'd sometimes forget the gesture and reach for the screen. I guess the book was that good. So I added page buttons along the bottom, big enough to hit while running on a treadmill.
- **The gesture feedback got quieter.** At first a popover appeared every time the app recognised your gesture, so you couldn't miss it. In the end I went for something more subtle: a small hand icon that fills in when it sees your finger.
- **Sans-serif made the cut.** I'm a sucker for serif fonts when reading, probably because that's what most fiction paperbacks use. Some of my small group of testers surprised me by wanting sans-serif, so that's in there too.

When code is cheap, the thing that sets your app apart is your own taste. So experiment to your heart's content. Try the idea you'd normally talk yourself out of. Go wild.

## App Store Rejections to Avoid: Camera Permissions and Regions

Some of the three weeks was my own fault. A few problems I've hit before in my other apps got through to App Review again, and each one cost a round trip. Two to watch for:

- **Camera permission flow.** PageFlick was rejected under guideline 5.1.1(iv) because my screen explaining camera access had an "Allow Camera" button and a "Use Page buttons only" option that let you skip the system permission prompt. The fix was a neutral "Continue" button that goes straight to the system prompt, with no option to skip it from that screen. You can still deny camera access in the system prompt and read using the page buttons. I had the same rejection with [Health Scan Express](https://healthscanexpress.com/)
- **Regions.** Some of the countries you release in can need extra approval, so check before you tick every region.

I should have known better. Oh well, it's live now.

## Try PageFlick: A Hands-Free EPUB Reader for iPhone, iPad and Mac

[PageFlick](https://getpageflick.com/) is free for one book, synced across all your devices, including where you're up to. An in-app purchase unlocks unlimited books. I hope you enjoy it.
