---
title: Collaboration when Learning Software Development
date: "2023-03-24T18:12:29Z"
template: post
draft: false
slug: "collaboration-when-learning-software-development"
category: article
tags:
  - vscode
  - collaboration
  - replit
  - classroom
  - remote learning
description: Recent advancements in collaborative software tools have made it easier for remote learners to participate in coding solutions together.
---

When teaching software development it's great to have class participation. What better way for learners to learn by taking turns to code up a solution. In a in-person classroom this could be done by simply having class members swap seats to switch who is using the keyboard and mouse of who is coding.

This used to be a lot more difficult when teaching remotely, you could always share a screen via [Zoom](https://zoom.us) or [Google Meet](https://meet.google.com) but it wasn't easy for another learner to work on the exact same code base without syncing files in some way. That has changed a lot in the last couple of years with some great new tools that allow much easier collaboration working on the same code base.

## Live Share for Visual Studio Code

A perfect choice for those that already use the extremely popular [Visual Studio Code](https://code.visualstudio.com) from Microsoft is the [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare) extension. It allows you to share the code on your local PC with a link it copies to your clipboard. Simply send that link to the learners in a [Zoom](https://zoom.us) or [Google Meet](https://meet.google.com) call. Then the entire class will be able to connect to the same session.

{% image "./vscode-live-share.png", "Using the VS Code Live " %}

One user (the instructor) can act as the Host and share the exact file they are working on and force the other clients to focus on items you wish to highlight. It even shows the cursor position with a little pop up of the person that moved it. It's even possible to share your terminal.

While it may get the code sharing running up quickly it's only downside is to run the code locally you would have to setup the environment (installing Node or Python etc which may or may not be an issue).

## Replit

Another option that allows screen sharing with nothing but a link and a browser is [Replit](https://replit.com/). It's an entire IDE ([Integrated Development Environment](https://en.wikipedia.org/wiki/Integrated_development_environment)) in your browser.

{% image "./replit-python.png", "Replit with Python " %}

The best part is you can have multiple people collaborate, run tests, use the terminal all while previewing the resulting code results in a browser (with a console). It's great for getting started quickly as it has a whole suite of templates for all sorts of projects including NodeJS, Python, Java, Ruby, Go, C#, ReactJS, Vue, and HTML/CSS. No stress about setting up the development environment, just select the appropriate template, run and share the link with your class.

The other benefit is the code can be forked easily. In the past I've used it for demos while teaching. Learners can take what you started with, fork (make another copy) and make changes to further their own learning in their own time. Of course they can share any changes after.

These are just two tools that can make collaboration in the classroom or the workplace as easy as clicking on a link. Try it out in your next classroom or [mob programming](https://en.wikipedia.org/wiki/Mob_programming) session.
