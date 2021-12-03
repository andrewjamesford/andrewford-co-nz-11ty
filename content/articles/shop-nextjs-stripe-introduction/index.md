---
title: Build a shop with Next.js and Stripe
date: "2021-12-03T22:02:38Z"
template: post
draft: true
slug: "shop-nextjs-stripe-introduction"
category: article
tags:
  - nextjs
  - stripe
  - shop
  - series
description: Introducing a new series on how to build a shop using Next.js and Stripe
---

In this series I'm going to walk through the process of building an online shop using the [React](https://reactjs.org) Framework [Next.js](https://nextjs.org). While you may have built a website with React, hopefully using the likes of [Create React App](https://create-react-app.dev) which will get you the barebones together to start building. It doesn't get you that far before you have a huge amount of decisions to make. What routing should I use for my pages, what CSS in JS library or should I use Tailwind. Very quickly you can be overloaded with decisions. This stems mostly from the fact that React is not a framework. It's a library.

Next.js on the other hand is "The React Framework for Production". With it a lot of the decisions have been made for you, letting you get up and running much faster. More importantly it solves a lot of the common problems that building a website/web app entail.

You will need to have an understanding of HTML, CSS and React of course to follow along with this series.

To get started building a Next.js application, hopefully you have Node installed (if not [download here](https://nodejs.org/en/) and open up your terminal.

```
npx create-next-app@latest
```

Follow the prompt and give it a name "shop-nextjs-stripe"

Now head into the directory with your new project and start the local development .

```
cd shop-nextjs-stripe
npm run dev
```

Open your code editor and take a look at the folder structure. You will see 3 folders. The "pages" folder is where the routing happens. That will direct the url in your app for example if you had a file called `contact-us.js` so when in your browser you head to `http://localhost:3000/contact-us` the content from
