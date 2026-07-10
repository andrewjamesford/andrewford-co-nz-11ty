---
title: Sweating the details
date: "2026-06-15T15:10:01Z"
template: post
draft: false
slug: sweating-the-details
category: article
tags:
  - ios
  - fasting
  - details
description: >-
  After 200 commits and 3 months of daily use, I finally released FastTempo — my
  fasting timer app for iPhone and Apple Watch. Here is why I waited.
audio: true
audioSrc: /audio/posts/sweating-the-details.mp3
audioDuration: "1:53"
audioGeneratedAt: "2026-07-10"
audioVoice: Andrew
audioDisclosure: AI narrated using Andrew's voice
---

For my second iOS app I've sat on releasing it for 3 months. Yes that's right I've had it in a good working state for that long. I use FastTempo every day on my iPhone and Apple Watch. Every time I came to wanting to release it I found I wasn't happy. In fact it was around 200 commits from when I had the MVP ready. That's 200 nitpicks and changes.

{% figure "./fasttempo-website.png", "FastTempo Website" %}

Admittedly this was a more complicated app compared to [Health Scan Express](https://healthscanexpress.com/). Health Scan Express has a simple capture, form, history and settings page. When you add the complications of synchronising between the iPhone and Apple Watch this was a much more complicated app. There were some refactors of syncing, rethinking the saving of data.

Notifications I found the hardest to get right. What's the minimum needed? What is the easiest way to see when your fast started? How long to go? When do I need to have finished eating by to stay within my 8 hour window?

As I was living with the app I found its issues, its rough edges. But as it was mine I could sand them down. Re-think what was wrong and what it needed and what was unnecessary.

At some point you do have to hit the release button. I'm sure there are many things left to fix or smooth off, but that will require more eyes than just my own.

I hope it helps you in your fasting journey, it's available now on the [App Store](https://apps.apple.com/us/app/fasttempo-fasting-timer/id6757407552)

{% figure "./fasttempo-app-store.png", "FastTempo Website" %}

<div class="promotion" style="background: transparent; border: none;">
  <img src="/images/fasttempo-logo.svg" alt="FastTempo logo" width="80" height="80" style="margin-top: 1rem;">
  <div class="promotion-title">FastTempo</div>
  <p class="promotion-body">A fasting timer for iPhone and Apple Watch. Track your fasting window, see when you started, and know exactly when your eating window closes.</p>
  <a href="https://apps.apple.com/us/app/fasttempo-fasting-timer/id6757407552" class="no-hover" style="display: inline-block; margin: 1rem;">
    <img src="/images/Download_on_the_App_Store_Badge_US-UK.svg" alt="Download on the App Store" width="120" height="40">
  </a>
</div>
