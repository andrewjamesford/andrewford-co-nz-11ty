---
title: "Easy ad-blocking via iOS 14 profiles"
date: '2021-02-16T09:08:57Z'
template: post
draft: false
slug: '2021/02/16/easy-ad-blocking-on-ios'
category: article
tags:
- dns
- adguard
- ios
description: "How to easily block ads on iOS 14 via profile"
--- 

[Aguard offer a DNS service](https://adguard.com/en/adguard-dns/overview.html) to block ads (and also have a family filter called "Family protection") I use this on my home router these days (previously I used [Pi-hole](https://andrewford.co.nz/2018/08/03/an-almost-ad-free-household)) but the downside of this is when I or my family use their devices on another network they don't have ad blocking. 

Adguard now provide [iOS & MacOS profiles](https://adguard.com/en/blog/encrypted-dns-ios-14.html) that can be installed on your devices that will enable ad blocking no matter the network and are super easy to install. 

These profiles are supported on the following:

- tvOS 14+
- iOS 14+
- iPadOS 14+
- MacOS 11

## How to install

### Install on iOS and iPadOS
1. Open the Settings app.
2. Tap Profile Downloaded.
3. Tap Install in the upper-right corner, then follow the onscreen instructions.
   

### Install on macOS
1. Open the downloaded `.mobileconfig` file.
2. Open System Preferences.
3. Go to Profiles.
4. Click Install.
   
### Install on tvOS
1. Open the Settings app.
2. Go to General → Privacy.
3. Hover over Share Apple TV Analytics without pressing.
4. Press Play on the remote.
5. Select Add Profile.
6. Make the downloaded `.mobileconfig` file accessible publicly and enter its URL.
7. Install the profile following the onscreen instructions.

Credit to [nextdns](https://apple.nextdns.io) for the above instructions.

## Alternatively

If you'd like to use a different service rather than Adguard there are a multitude of ways to use other profiles or create your own. 

### [Encrypted DNS Party](https://encrypted-dns.party)

Has a page of profiles you can download config files from and you can view the [source on GitLab](https://gitlab.com/nitrohorse/ios14-encrypted-dns-mobileconfigs) and download from there alternatively.


### [Paul Miller profiles](https://paulmillr.com/posts/encrypted-dns/)

Paul Miller has created profiles for a number of DNS providers. He too has the source available for his on [GitHub](https://github.com/paulmillr/encrypted-dns).

### [Not Jakob DNS profile creator](https://dns.notjakob.com)

"Not Jakob" has made some pre-made profiles and has created a tool where you can configure your profile how you like with options for IPv4/IPv6, Wi-Fi network exclusions, Cellular enable/disable etc. The source is [available on GitHub](https://github.com/fyr77/dns-mobileconfig).

### [NextDNS Apple Configuration Profile](https://apple.nextdns.io)

[NextDNS](https://nextdns.io) offer a tool for their DNS service to generate profiles to use on your devices. 

### What about Android?

For Android users an alternative is [Rethink DNS](https://www.bravedns.com) which is more of a firewall/DNS service.

