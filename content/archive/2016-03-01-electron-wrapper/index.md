---
title: Electron Wrapper
date: "2016-03-01T22:29:54+00:00"
template: post
draft: false
slug: "/2016/03/01/electron-wrapper/"
category: "article"
tags:
  - desktop
  - electron
  - development
description: ""
---

It's now never been easier to make a desktop version of your favourite website/web app thanks to the <a href="http://electron.atom.io">Electron</a> project.

You may even be using an Electron app and didn't even realise that it was powered by web technology with an embedded version of Chrome. For example <a href="https://slack.com">Slack</a>'s desktop app is built on Electron. So is the desktop <a href="https://desktop.wordpress.com">WordPress</a> app.

Being a Windows user by day (at work) I've always missed having <a href="http://simplenote.com">Simple Note</a> (a great note taking app) as a desktop app. While they have a good web app, I'm always opening and closing sessions, deleting cookies etc with my work. So running it full-time can be a pain having to log in repeatedly.

To wrap a web app in Electron is very simple. Clone the Git repo for the <a href="https://github.com/atom/electron-quick-start">Electron starter kit</a>. Open the "main.js" file with your favourite text editor and change the following line:

<pre><span class="s1">mainWindow.</span><span class="s2">loadURL</span><span class="s1">(</span><span class="s3">'file://'</span> <span class="s4">+</span> <span class="s5">__dirname</span> <span class="s4">+</span> <span class="s3">'/index.html'</span><span class="s1">);</span></pre>

Now add the website address of the website you would like to wrap.

<pre><span class="s1">mainWindow.</span><span class="s2">loadURL</span><span class="s1">(</span><span class="s3">'https://app.simplenote.com'</span><span class="s1">);</span></pre>

Follow the rest of the Electron starter kit guide and install &amp; start the project. Electron should now run and display the website address you've added.

To build a Simple Note app for Windows for yourself, grab my git repo <a href="https://github.com/andrewjamesford/SimpleNoteWrapper">SimpleNoteWrapper</a>.

&nbsp;
