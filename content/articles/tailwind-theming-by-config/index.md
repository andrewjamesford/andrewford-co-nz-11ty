---
title: Tailwind Theming by Config
date: '2021-04-06T21:47:02Z'
template: post
draft: true
slug: 'tailwind-theming-by-config'
category: article
tags:
- 
description: Description here
--- 

A common approach to building web apps in large organisations are theming them for multiple brands. The app will function in the same way but look different for each corresponding theme with alternate fonts and colours, logo etc. This can be a big headache, and you can be left maintaining multiple copies of the same code base. Ideally we don't want to do that.

At work we use [Tailwind CSS](https://tailwindcss.com) which is a utility first CSS framework. Rather than making custom CSS classes for each part of a component you are working on, you add multiple utility classes to each element and never run the issue of another developer (or your self in the future) breaking your design. CSS classes stay consistent and in practise I've found you only need to add on the off occasion a custom CSS class.

The app I'm currently working on has the need for multiple themes/branding but at it's core is the same app. I needed to use the same code base for a ReactJS app but have different colours and logos. Most importantly I needed to have flexibility and have options to hide and show form fields, components etc if needed. I also wanted to have an easy way to switch which theme/brand the app was using across the board at the deployment level. So same GIT repo, 3 different deployments, in our case to Azure.

To achieve the theming of Tailwind I used a plugin called [tailwind-theme-variants](https://github.com/JakeNavith/tailwindcss-theme-variants). This allowed me to create 3 variants. We will call them Alpha, Beta, Gamma. Each have 4 brand colours. So anywhere through out the applicaiton I can prefix the brand name to a CSS class for example:

```
<div className="alpha:bg-alpha-color1 beta:bg-beta-color1 gamma:bg-gamma-color1 text-sm">
My component
</div>
```
In the example above when the user is looking at the `alpha` themed version of the app this component will have the background colour of alpha colour 1. Versus the `beta` themed version will have the background colour of beta colour1. This allows some great flexibility to theme your app while at the same time making it easy to manage.


