---
title: New Year, New Blog
date: "2018-03-31T08:24:45+00:00"
template: post
draft: false
slug: "/2018/03/31/new-year-new-blog/"
category: "link"
tags: 
- blog
- gatsbyjs
- reactjs
- netlify
description: "New year, new blog running on Gatsby"
---

So it's a new year 2018, and it's time for a new blog. While Wordpress has been a great blogging platform over the last 7 years for me it's time to use something that is "closer to the metal" and more [modern](https://jamstack.org/). That's why I've gone with [GatsbyJS](https://www.gatsbyjs.org/) a CMS built on [ReactJS](https://reactjs.org/) and [WebPack](https://webpack.js.org/). It's has all the latest features like GraphQL, Service Workers and an extensive plugin library.

With the move to the using Gatsby I'm also moving hosting. Without the need for a database anymore the need for using a VPS isn't existent. All content now is stored in a [Github repo](https://github.com/andrewjamesford/andrewford-co-nz-gatsby) and on push a git webhook triggers a new build on [Netlify](https://www.netlify.com/) that then serves my built version of my site. My content is stored as source code in [Markdown](https://daringfireball.net/projects/markdown/) files, what I'm writing in now using VS Code. My change history of my Markdown files is saved in Git. Gatsby's build system pulls together the Markdown files, turns them into static HTML for search bots and serves JSON content to viewers browsers in a fast single page application using ReactJS. It's the best of both worlds, and fast for both user and bot.

In my job I work in React all day so this is a simple extension to me to work on Gatsby. This isn't ideal for everyone else but the beauty of Gatsby is it can have it's content populated by dozens of other means. For example you could pull content in from Wordpress, Drupal or Google Sheets. The content is simply treated like an API and more than likely there is already a [plugin available](https://www.gatsbyjs.org/plugins/) to serve it.

Previously I've hosted my Wordpress site on a small VPS on Ramnode. Managing all updates & upgrades of Ubuntu including security patches and backups. It's been a valuable learning experience for me using Linux and doing all my own server maintenance. But with the move it will be just one less job to do, so I can focus on writing.

