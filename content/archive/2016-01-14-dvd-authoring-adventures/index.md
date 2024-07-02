---
title: DVD authoring adventures
date: "2016-01-14T06:30:48+00:00"
template: post
draft: false
slug: "/2016/01/14/dvd-authoring-adventures/"
category: "article"
tags:
  - link
description: "Dan Moren on Six Colors walks through his use of ffmpegX to convert a video to MPEG2 format for DVD."
---

<a href="https://sixcolors.com/post/2016/01/adventures-in-dvd-authoring/">Dan Moren on Six Colors</a> walks through his use of <a href="http://www.ffmpegx.com">ffmpegX</a> to convert a video to MPEG2 format for DVD.

An alternative to ffmpegX is to use ffmpeg directly from the command line. If you have used <a href="https://github.com/donmelton/video_transcoding">Don Melton's transcode-video tools</a> (and you definitely should) you will have already installed <a href="https://www.ffmpeg.org">ffmpeg</a> via <a href="http://brew.sh">Homebrew</a>.

To do the conversion open a terminal and type the following replacing "source-video.mkv" and "destination-video.mpg" with your own source and destination file names:

<pre>ffmpeg -i "source-video.mkv" -target ntsc-dvd  "destination-video.mpg"</pre>

Oh and make sure you set your target for your region, either PAL (pal-dvd) or NTSC (ntsc-dvd).

Now to creating your DVD. <a href="http://burn-osx.sourceforge.net/Pages/English/home.html">Burn</a> is still around for OSX and working great on El Capitan for burning DVD's. It also lets you add DVD menus from a selection of themes. Simply drag your new file into the "Video" tab to burn your DVD and again make sure your region is set to either NTSC or PAL in the preferences.
