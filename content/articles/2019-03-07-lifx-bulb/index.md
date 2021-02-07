---
title: "Lifx bulb"
date: '2019-03-07T10:26:42Z'
template: post
draft: false
slug: '2019/03/07/lifx-bulb'
category: article
tags:
- lifx
- home automation
- homekit
description: "A cautious first step to home automation"
---

I recently took my cautious first step to automating a light in my own home. As a self proclaimed privacy advocate I've been very weary of IOT devices, I know all too well that most give far too much personal details away.

There are only two actual needs in my own home that **need** automation that I see. One being the outside light on the front porch, and the other being the swimming pool pump/filter. I'm quite happy to get off my butt and turn on/off a light. So from the get go my needs have been rather simple. I'd been put off buying a Philip Hue light kit as it requires its own hub and comes with a minimum of two bulbs. Finally Lifx has come to New Zealand in December last year, with the benefit of being standalone units that connect directly to WiFi without the need for a hub.

I wanted a no frills, white only light bulb of the E27 variety and LIFX had what I wanted, even better was for an introductory price of only $38 (at the time) from [Noel Leeming](https://www.noelleeming.co.nz/shop/computers-tablets/smart-home/smart-lighting/lifx-l3a19mw08e27-mini-white-e27/prod169514.html). The Lifx range support all the 3 of the most popular control systems, Apple Home kit, Goole Home and Amazon Alexa. While it had crossed my mind to use a Raspberry Pi to control home automation, I didn't want the hassle of setup.

![Setup LIFX bulb](./lifx2.png)

The process for setup was very easy, first set the bulb up by plugging it in to it's socket and switching the power on. Install the Lifx app on your phone and run through the set up wizard. Once that's done, you can update firmware and optionally set up like in my case for it to work with Homekit, by scanning the code that came with the device.

![Apple Home](./lifx1.png)

So the good thing is it's nice to be able to switch the light on from the car and not stumble up the stairs in the dark when I forgot to leave the light on.
But there are some glaring bad points with smart bulbs in general. You have to leave the light switch on for them to work and there is no easy way to turn the light on if you don't have a smart speaker in the room or you iPhone/mac/iPad handy. Ideally there needs to be a cheap, preferably hub-less, Homekit supporting switch, preferably that can hide the existing switch. I may have to investigate [this option](https://www.aqara.com/en/smart_hub-product.html) more.

As a side note I had originally ordered a [Kogeek Wifi enabled smart switch](https://www.koogeek.com/p-kh02.html) but unfortunately it was incompatible with my light wiring. I still think while having the need for an electrician to install, a smart light switch is a far better alternative than a smart bulb.

