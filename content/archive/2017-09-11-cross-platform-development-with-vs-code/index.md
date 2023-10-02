---
title: Cross Platform development with VS Code
date: "2017-09-11T21:03:03+00:00"
template: post
draft: false
slug: "/2017/09/11/cross-platform-development-with-vs-code/"
category: "article"
tags:
  - bash
  - powershell
  - VS Code
  - development
description: ""
---

A quick tip for when using Visual Studio Code in a cross platform team. You may have [tasks](https://code.visualstudio.com/docs/editor/tasks) (in the tasks.json) config file. They may be specific for Bash or Powershell (such as in my case).

VS Code allows specific platform properties. So in my case I have the tasks use Bash for my Mac, whereas the other developers use Powershell on Windows. It's as simple as defining an override for your platform like so (OSX):

{% figure "./tasks.png", "Tasks.json example", [1280, 1024, 720, 320], [1280, 1024, 720, 320] %}