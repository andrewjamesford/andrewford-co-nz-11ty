---
title: Charles proxy is your friend
date: "2015-02-20T07:35:39+00:00"
template: post
draft: false
slug: "/2015/02/20/charles-proxy-is-your-friend/"
category: "article"
tags:
  - dev
  - mobile
  - proxy
  - development
description: "Charles Proxy is a great tool for inspecting mobile traffic and finding out what parameters are being passed."
---

At <a href="http://monitorbm.com" title="Monitor Business Machines">work</a> I've been updating some mobile apps (iOS &amp; Android) that yesterday had their web service updated to pass me two parameters I needed (by one of the other developers). Me being a dummy I forgot to ask what those two parameters were called.

So this morning I remembered my handy dev tool Charles Proxy would be able to help in this situation. It's very easy to setup Charles to act as your proxy for your phone so that you can inspect all the traffic on your computer.

<ol>
<li>To get started grab a copy of <a href="http://www.charlesproxy.com" title="Charles Proxy">Charles Proxy</a>, it has a free trial.
</li>
    <li>Open up terminal or your command prompt and type "ipconfig" for Windows or "ifconfig" for Mac. </li>
    <li>In Charles under Proxy > Proxy Settings enable Http Proxy by checking the box on the Proxies tab.</li>
    <li>Now open up your iPhone Settings > Wi-Fi > Wifi Network Name tap the "i" icon and scroll down to HTTP PROXY. </li>
    <li>Select "Manual" and enter the IP address from the terminal/command prompt and the port 3000</li>
</ol>

Now you should be able to see all the traffic from your phone in Charles Proxy and inspect the data. It will show data requested and responded from each URL. So in my case I was able to look at the JSON response and find the exact parameters I needed.
