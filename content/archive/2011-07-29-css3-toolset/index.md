---
title: CSS3 and my toolset
date: "2011-07-29T20:41:38+00:00"
template: post
draft: false
slug: "/2011/07/29/css3-toolset/"
category: article
tags:
  - CSS3
  - Tools
description: "A collection of tools I use to create CSS3 styling."
---

These days I'm trying as much as possible to get away without having to create pixels with websites. To do this I use CSS3 (part of the subset of the HTML 5 standard) to create the styling of elements without needing to open up Fireworks or Photoshop. There are a couple of benefits for this approach:

1. The page weight is usually smaller, and the site doesn't require multiple http requests (it shouldn't anyway if your using image sprites)
1. The elements can easily grow and shrink to fit content without having to resort to techniques like "sliding doors"
1. Less time is spent exporting and optimising images for use in the CSS

To visually create the styling without resorting to lots of painful CSS properties in my chosen HTML/CSS editor I use the following web sites to quickly create the look I want or that I'm trying to mimic from provided designs.

## [Layer Styles](http://www.layerstyles.org)

Layer Styles is a great tool if your familiar (or even if your not) of Photoshop effects. It mimics the same panel interface as Photoshop with the check box and slider panes. Once your happy with the look of the styling you've created simply copy the CSS from the code pane on the bottom of the page. There is one caveat of the Layer Styles, you will need to add the vendor prefixes to your CSS. To save you the hassle simply copy and paste your CSS into the tool below.

## [Prefix my CSS](http://prefixmycss.com/)

Prefix my CSS will add the vendors (Mozilla, Opera, Webkit) prefixes to your styling for what ever browser your've been creating your styles for. Easy as that.

## [Ultimate CSS gradient creator](http://www.colorzilla.com/gradient-editor/)

If your used to Photoshops gradient effect tool you'll love the Ultimate CSS gradient creator. It allows you to place multiple gradient points along the bar and adjust to your hearts content. Alternatively you can just grab one of the pre-generated presets and edit that. The CSS produced is already prefixed and also there are fall backs for older browsers and IE.

## [jsFiddle](http://jsfiddle.net)

jsFiddle is a front end developers playground. The page is divided into 4 panes where you can quickly add your HTML, CSS and JavaScript. Simply hit the run button and you'll see the results of your pasted in CSS of the above tools. One of the killer features I love about jsFiddle is the ability to create short codes to your mockup so you can quickly test cross browser simply by copying the short code address into the address bar. There are a ton more features on jsFiddle enough to write an entire article or two. Definitely worth checking out.
