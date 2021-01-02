---
title: Javascript (jQuery) sliders round up
date: "2011-08-05T10:28:17+00:00"
template: post
draft: false
slug: "/2011/08/05/javascript-jquery-sliders/"
category: "article"
tags:
  - animation
  - carousel
  - CSS3
  - javascript
  - jquery
  - slider
description: ""
---

I've used a number of Javascript based image sliders on a number of projects in the last year. They all have some points of difference so I thought I'd share what they are and make people aware of them.


## Nivo Slider

[http://nivo.dev7studios.com/](http://nivo.dev7studios.com/)

![Nivo Slider](./nivo-slider.png)

I'm currently using Nivo slider on this website for the home page. It's currently pulling in the Featured Post image  using a custom function for my Wordpress theme. Nivo slider has a great set of animation effects and has a number of options. If you want a no hassle installation for Wordpress Dev7Studios offer a paid plugin as well. There are even a number of other platforms already supported with Drupal, Joomla and Sitefinity.

What I like about Nivo slider is the different types of transitions rather than just the standard slide in from left to right/ top to bottom.   I'm using "sliceDown" on my own site, where it segments up the image and makes each segment slide down, a unique different effect to most other sliders around. Check out the <a title="Nivo Slider demo page" href="http://nivo.dev7studios.com/theme-demos/" target="_blank">demo</a> page here to see the prebuilt themes too.

Points of difference:

<ul>
    <li>Unique transitions to most other sliders - slice down/up, fold, box rain/random</li>
    <li>Plugins already available for popular CMS (Wordpress, Joomla &amp; Drupal)</li>
    <li>Nice looking prebuilt themes</li>
</ul>

Sites I've implemented on:

<a href="http://andrewford.co.nz" target="_blank">andrewford.co.nz</a>

&nbsp;

<h2>jQuery Cycle</h2>

<a title="jQuery Cycle" href="http://jquery.malsup.com/cycle/" target="_blank">http://jquery.malsup.com/cycle/</a>

&nbsp;

![jQuery Cycle](./zespri-slider.png)

This great plugin has the most effects of all the sliders here, it also has the honor of being the oldest project of the round up. Very highly configurable, huge number of options and can be paused, progressed etc from a JavaScript call. I've used it on multiple projects and combined with jQuery easing the transition effects can be very smooth and extended (ease in, bounce etc).

Points of difference:

<ul>
    <li>Huge number of effects</li>
    <li>Mature project, has been around since 2007</li>
    <li>Large number of demos available on the site</li>
</ul>

Sites I've implemented on:

<a title="ZESPRI" href="http://zespri.com" target="_blank">zespri.com</a>

<a title="Offerzone" href="http://offerzone.co.nz" target="_blank">offerzone.co.nz</a>

<h2>Orbit</h2>

<a title="Zurb Orbit slider" href="http://www.zurb.com/playground/orbit-jquery-image-slider" target="_blank">http://www.zurb.com/playground/orbit-jquery-image-slider</a>

Orbit is a new comer to the group that uses CSS3 to keep the size of the library down to a mere 4kb. It also has a nice loading animation/pause button.

Points of difference:

<ul>
    <li>Loading/countdown animation</li>
    <li>Very small at 4kb</li>
    <li>Compatibility: IE7+, FF 3.5+, Chrome, Safari</li>
</ul>

Sites I've implemented on:

<a title="CV for Andrew Ford" href="http://cv.andrewford.co.nz" target="_blank">cv.andrewford.co.nz</a>


<h2>bxSlider</h2>

[http://bxslider.com/](http://bxslider.com/)

This is my current favorite slider. I'm currently using it to do two complete types of transition on the same page, one a simple fade with a pager control and the other a carousel type cycle where I show 3 items and scroll only one at a time using a previous and next buttons. There are a ton of options and plenty of call back functions. Like a before the slider loads so I could stop horrible flashing of images before they were positioned.

Points of difference:

<ul>
    <li>A move slide quantity option (killer feature)</li>
    <li>Ticker option to have your images/slides constantly scrolling</li>
    <li>Great call back functions, next, previous, before and after.</li>
</ul>

Sites I've implemented on:

Coming soon