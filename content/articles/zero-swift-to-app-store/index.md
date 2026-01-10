---
title: From zero Swift to in the App Store
date: '2026-01-10T13:48:32Z'
template: post
draft: true
slug: 'zero-swift-to-app-store'
category: article
tags:
- ai
- claudecode
- app
- swift
description: "How I built an app with zero understanding of Swift to a published app in the iOS App Store"
--- 

It's such a cliche in the age of AI to build an app with zero knowledge to publishing your own app in the App Store. But I made it happen too. This is now the new reality, those with agency can and will easily build what they desire. 

For myself I'm on a health kick after getting an Apple Watch and well middle age happening I've started to track my weight conciously. After previously using a smart scale I'd been disastisfied what was on offer. There hasn't been a lot of options for *reasonably priced* smart scales that can save your data to Apple Health. More importantly you may not always be using your own scales to record your weight so an idea formed of an app that can easily save your weight and sync. 

I didn't want any clumsy bluetooth connection that works sometimes. A lot of people simply take a photo of the scales. It's a simple but elegant solution, but I know I could do one better. We now have access to AI tools that can read text and spit it out into a computer friendly format.

So that's what I did I made an app that you take a photo of your scales, send it to a smart AI that can read the weight and then save it to Apple Health. Armed with Xcode, VSCode, Claude Code and a plunger of coffee I'd made a prototype in a couple of hours.

Hours to build an app from scratch not knowing barely any swift that can upload an image, create an API (very rough) get the AI to extract the weight value into JSON and then take that value in the app and save it to the Health App with all the other health data like your steps etc are saved in the one location. 

## The How

What I find that works for me is to create a PRD that's a Product Requirements Document. This need not be made entirely by me instead I work with Claude iterating on a clear and concise document that covers the MVP (Minimal Viable Product) that will meet what I want to achieve. I write this up in markdown and get it to a point where I'm ready to give it to Claude Code. This can take hours to write up but I find it's worth it to get it clear what I want and how I want it built. 

I then create a GitHub repository and add my PRD markdown file to the root. I then run the `/init` command in Claude Code to add a CLAUDE.md file. Then I'm ready to give Claude Code my PRD file and ask for it to Plan out the build of the app based on the PRD and also ask it to ask questions if it requires any clarification.

Claude can sometimes plan for quite some time so be prepared to wait. I find it very good at coming back with questions that help remove any ambiguity. 

Once both Claude and I are happy I ask Claude to create a TODO.md file of all the tasks it needs to perform. This becomes a check list for both me and Claude to keep track of the progress. 

My personal preference is to keep track of what Claude does by asking it to do one task at a time. There is a lot of people using the "Ralph Wiggum" skill or script to get Claude to code while they sleep. It's a completely valid way to build your app and is worth having a go. I find I like to check in and see what the AI has done. It's hard to let go of the wheel after 25 years.

In the case of my app Health Scan Express I split the project across 3 git repos. One for the iOS app, one for the NodeJS API and finally a marketing website. Claude Code thankfully has a way to look at other folders using `/add-dir <path>` so that it knows what the API code looks like when working with the iOS app and vice versa.

This will get you to a reasonably good working prototype of the app you outlined in your PRD. The next steps are you want to build out the application come next. To do this and keep a good level of quality within your codebase it's time to start adding some guard rails to ensure the codebase doesn't become a mess of spaghetti and flakey.

## Guard Rails?

Like all good coding practices they map very well to **AI Engineering**, putting in place tests and code quality tools all help to keep everthing in check including the AI itself. 

To start with I add a linting and formatting tool to help keep the code and coding style consistent. For swift we have `swiftlint` and `swiftformat`. For typescript I'm a fan of `biomejs`. I'd suggest also to use a typed language, again adding guardrails to your codebase to avoid ambiguity of functions and models etc.