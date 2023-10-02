---
title: Internet Parenting
date: "2018-08-04T09:52:00+00:00"
template: post
draft: false
slug: "/2018/08/04/internet-parenting"
category: "article"
tags:
  - parenting
  - internet
  - privacy
  - safety
description: "Parenting in this modern age is harder now then ever. I share some tips to shield your kids from the bad."
---

As a father of three kids and an IT professional I'm all too aware of the great things of the internet, and the _not_ so great things of the internet especially for young children.

To try and shield my kids from things I think they shouldn't need to see yet I've implemented a few technologies and software to do so.

## Blocking content

I run a [Raspberry Pi](https://www.raspberrypi.org/) at home running among other things [Pi-Hole](https://pi-hole.net/) - a network wide ad-blocker. A great feature the Pi-Hole software has is the ability blacklist sites on your network. This allows you as a parent to block sites you don't like or feel are inappropriate for your kids. You can even automate the black listing of entire categories of sites by using a pre-configured [block list](https://github.com/StevenBlack/hosts).

{% figure "./pi-hole-blacklist.jpg", "Pi-Hole blacklist", [1280, 1024, 720, 320], [1280, 1024, 720, 320] %}

In our house we outright block a few websites. The likes of YouTube, Instagram and Snapchat to name a few. While there are some good things on these platforms, my wife and I agree that at our kids current age the negatives out way the good. All these social sites are intended to be addictive and that’s something our kids don’t need at such a young age. Tim Cook CEO @ Apple doesn't allow his nephew on [social media for example](http://fortune.com/2018/01/20/tim-cook-wont-allow-his-nephew-on-social-media/).

You can achieve a similar ability to black list sites without a Raspberry Pi / Pi-hole using [OpenDNS Home](https://signup.opendns.com/homefree/).

## Separate SSIDs for individual WiFi

A number of routers allow you to have more than one [SSID](https://www.lifewire.com/definition-of-service-set-identifier-816547) and enable and disable as necessary. This is great for setting up a SSID for each kid in your family. When the kids are breaking the rules simply log in to the router and disable their SSID. If that's not an option on your router you could always plug in a second router specially for the kids, and switch on/off as necessary.

{% figure "./wifi-ssids.jpg", "Separate WiFi SSIDs for the kids", [1280, 1024, 720, 320], [1280, 1024, 720, 320] %}

## Restricting devices

On iOS there are restriction settings on iOS to stop changing of options (like WiFi and DNS), block websites and the ability to stop App Store downloads. These are quite limited at the moment but this will all change with [iOS 12](https://www.macrumors.com/roundup/ios-12/#parental_controls).

### Nintendo Switch Parental controls

The Nintendo Switch has great parental controls that allow you to easily set daily time limits for use of the console. We have ours set to an hour a day during the week, increasing it on the weekends to two hours. Games as well can be black or white listed, if you'd prefer the kids not to play certain titles.

{% figure "./nintendo-switch-parental-controls.jpg", "Nintendo Switch Parental Controls", [1280, 1024, 720, 320], [1280, 1024, 720, 320] %}

Parental controls can be controlled by an app for [iOS & Android](https://www.nintendo.com/switch/family-fun/parental-controls/), it has a nice little toggle to disable the time limit for the day.
