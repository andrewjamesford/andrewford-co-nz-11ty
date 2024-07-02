---
title: Preview CSS on your live site with Charles proxy
date: "2014-05-16T20:36:45+00:00"
template: post
draft: false
slug: "/2014/05/16/preview-css-on-your-live-site-with-charles-proxy/"
category: ""
tags:
  - css
  - proxy
description: "What if you could check/preview your CSS changes before you push your changes to your site? You can with Charles proxy."
---

What if you could check/preview your CSS changes before you push your changes to your site? You can with <a href="http://charlesproxy.com" title="Charles proxy" target="_blank">Charles</a> proxy. Check out the video below from <a href="http://learnable.com" title="Learnable" target="_blank">Learnable.com</a>.

youtube.com/embed/y8Okx-RWK3M

First enable local mapping. Under "Tools" > "Map Local".

{% figure "./Charles-proxy-mapping1.png", "Charles enable map local", [1280, 1024, 720, 320], [1280, 1024, 720, 320] %}

Charles enable map local

Then select the CSS file you want to override with your local copy.

{% figure "./Charles-proxy-mapping2.png", "Charles CSS mapping", [1280, 1024, 720, 320], [1280, 1024, 720, 320] %}

Too easy. When you next refresh your browser you will see the changes you made to your CSS. You now have a great way to double-check your changes before go live.

Have a good explore around all the features of <a href="http://charlesproxy.com" title="Charles proxy" target="_blank">Charles</a>, it's a great tool to have in your toolbox.
