---
title: "New Year, New Blog Generator"
date: '2021-02-07T21:07:46Z'
template: post
draft: true
slug: '2021/02/07/new-year-new-blog-generator'
category: article
tags:
- 11ty
- static site generator
description: "Switched the blog from Gatsby to 11ty"
--- 

For 2021 I wanted to switch to a new blog engine. [GatsbyJS](https://www.gatsbyjs.com) had served me well the last [couple of years](/2018/03/31/new-year-new-blog/) I've been using it... but there was a huge number of dependencies with the NPM packages I used (mainly due to the theme). I'd get constant pings from Github Dependabot to update packages by approving pull requests. 

I also wanted something simpler. Easy to build (and faster), less issues with dependencies, and super easy to style and tweak. After seeing some buzz from other web developers and a quick read of the documentation I chose Eleventy (or 11ty for short). [Eleventy](https://www.11ty.dev) calls itself a "simpler static site generator" and it lives up to its catch phrase. 

With the switch to [11ty](https://www.11ty.dev) my blog now has 3 NPM packages vs 70+ previously. It's very simple in comparison. There are no service workers, ReactJS components or inline CSS. Instead it's output is simple HTML with a CSS style sheet generated from your choice of [template language](https://www.11ty.dev/docs/). 

The entire minimal styling, build and migration of content took less than a month in very little of my spare time to complete (even with a couple of weeks of holidays during that month). 
