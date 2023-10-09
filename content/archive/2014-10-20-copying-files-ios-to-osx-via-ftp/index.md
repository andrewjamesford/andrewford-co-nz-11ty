---
title: Copying files from iOS to OS X via FTP
date: "2014-10-20T23:05:09+00:00"
template: post
draft: false
slug: "/2014/10/20/copying-files-ios-to-osx-via-ftp/"
category: "article"
tags:
  - FTP
  - Transmit
  - apps
  - iOS
description: ""
---

{% figure "./transmit-icon-150x150.jpg", "Transmit for iOS", [1280, 1024, 720, 320], [1280, 1024, 720, 320] %}

First of all if you haven't bought [Panic](http://panic.com)'s great new FTP client for iOS [Transmit](https://itunes.apple.com/nz/app/transmit-ios/id917432930?mt=8&uo=4&at=10lnRx) I suggest you go grab it. With the introduction of iOS 8 an app like Transmit helps become that bridge to easily transfer files to your Mac/Server and your iPad or iPhone _without_ using a cloud service.

[Panic](https://www.panic.com/transmit-ios/) mentions in their FAQ for [Transmit for iOS](https://itunes.apple.com/nz/app/transmit-ios/id917432930?mt=8&uo=4&at=10lnRx) you can transfer files to your mac via FTP. This is a great alternative to AirDrop if your Mac doesn't support it.

First of all enable SSH/SFTP on your mac by going to **System Preferences &gt; Sharing** and enable **Remote Login**.

Add a **New Server** in Transmit for iOS, adding an **SFTP** account.

Add the name from OS X of your computer "computername.local" in the address field, your user and password. You can find this on the **System Preferences &gt; Sharing** pane.

{% figure "./transmit-upload-desktop.png", "Select your desktop folder, tap the + icon and select the file to upload. You can preview images simply by tapping the filename.", [1280, 1024, 720, 320], [1280, 1024, 720, 320] %}

Connect to your Mac from Transmit and go to your Desktop and click the **+** icon. This will bring up the recent images and gives you access to iCloud Drive, Photo Library and some other options. Simply select your file to upload and it will be transferred to your mac.

File transfers are extremely quick and there are no privacy concerns as it's direct on the same network.

You can also buy Panic's [Prompt 2 with Transmit for iOS](https://itunes.apple.com/us/app-bundle/id926959558?mt=8&uo=4&at=10lnRx) which is as equally good, together as a bundle (saving you some money).
