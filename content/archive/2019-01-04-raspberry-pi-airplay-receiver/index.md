---
title: "Raspberry Pi Airplay Receiver"
date: "2019-01-03T20:59:41Z"
template: post
draft: false
slug: "2019/01/04/raspberry-pi-airplay-receiver"
category: link
tags:
  - airplay
  - raspberry pi
  - audio
description: "How to make your Raspberry Pi into an AirPlay receiver"
---

[9to5toys](https://9to5toys.com/2019/01/03/raspberry-pi-airplay-receiver-setup/) have a straight forward guide to turn you Raspberry Pi into an AirPlay receiver. Similar to the [Raspotify](https://andrewford.co.nz/2018/07/28/raspotify) project I previously installed on my Pi, this will work from applications other then Spotify like [Overcast](https://overcast.fm/) for example.

You shouldn't need to do much then run the following if your Pi is already setup.

```
sudo apt-get upgrade
sudo apt-get install shairport-sync
```

Once installed test the install by running:

```
sudo systemctl enable shairport-sync
sudo service shairport-sync start
```

Your Raspberry Pi should now be an option to AirPlay audio to, which again is a far better option then Bluetooth.

{% figure "./airplay-receiver-framed.png", "Kakapo my Raspberry Pi showing as an AirPlay receiver", [1280, 1024, 720, 320], [1280, 1024, 720, 320] %}
