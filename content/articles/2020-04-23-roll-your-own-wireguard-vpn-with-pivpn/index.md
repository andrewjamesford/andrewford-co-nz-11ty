---
title: "Roll your own WireGuard VPN with PiVPN"
date: '2020-04-23T13:08:03Z'
template: post
draft: false
slug: '2020/04/23/roll-your-own-wireguard-vpn-with-pivpn'
category: article
tags:
- vpn
- wireguard
- pivpn
description: "Now it's very easy to setup your own WireGuard VPN on your a Raspberry Pi" 
---

[PiVPN](https://www.pivpn.io) has offered easy setup of your own VPN with [OpenVPN](https://openvpn.net) on a [Raspberry Pi](https://www.raspberrypi.org/) (or Debian/Ubuntu server) for quite some time. Now they offer the option to install a [WireGuard](https://www.wireguard.com) VPN using the same easy to use script. 

WireGuard is a relatively new protocol, that offers a faster, simpler and leaner protocol compared to OpenVPN. The biggest difference when using on mobile are the connections are initiated much faster in my own experience. WireGuard also offer a modern iOS app that offers easy On Demand activation with exceptions via [SSID](https://en.wikipedia.org/wiki/Wi-Fi) when on WiFi. This is great to have the VPN only activate automatically on WiFi that is not your home setup. 

The process for setup is documented on the [PiVPN](https://www.pivpn.io/#install) site and the interactive install makes the setup relatively easy. The only difficultly I found was trying to open the port on my router to the Pi on my local network. Entire setup for myself, including on devices was less than 30 mins. Applications are available for almost all platforms to install on your devices (phones, tablets & PCs) on the [WireGuard install page](https://www.wireguard.com/install/). 

Personally I really liked the setup of mobile by QR code via command line. It is a great feature, no need to copy a file to the phone.