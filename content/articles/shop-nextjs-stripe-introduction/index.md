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

You will need to have an understanding of HTML, CSS and React of course to follow along with this series. I teach all these subjects on the Client Side paper at [Developers Institute](https://www.developers.ac.nz) 😉

To get started building a Next.js application, hopefully you have Node installed (if not [download here](https://nodejs.org/en/) and open up your terminal.

```shell
npx create-next-app@latest
```

Follow the prompt and give it a name "shop-nextjs-stripe"

Now head into the directory with your new project and start the local development .

```shell
cd shop-nextjs-stripe
npm run dev
```

Open your code editor and take a look at the folder structure. You will see 3 folders. The "pages" folder is where the routing happens. That will direct the url in your app for example if you had a file called `contact-us.js` so when in your browser you head to `http://localhost:3000/contact-us` the content from that component.

Your **pages** folder will have a **api** folder and two files `_app.js` and `index.js`. 

Open the project in a [browser](http://localhost:3000) and you should see something like this

![Next.JS Starter](./nextjs-start.png)

Great so now the project is up and running in development mode 🙌

In your code editor we will now open the `index.js` file in the `pages` folder.

We are going to remove everything and replace it with the following:

```jsx
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="Products" />
      </Head>
    </>
  );
}
```

That's cleared the standard install junk. Time to make our first component. Let's make a new folder called `components` and add a file `layout.js` in that directory. Add the following:


```jsx
import React from "react";
import Head from "next/head";

import styles from "../styles/layout.module.css";

export const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
};

```

This will be the layout shared across all our pages in the shop. To add to that we will add a Header and a Footer component.

Again in the `components` folder create a `header.js` and a `footer.js` file.

In the header file add the following:

```jsx
import React from "react";

export const Header = () => {
  return <header></header>;
};


```

In the footer file add the following:

```jsx
import React from "react";

export const Footer = () => {
  return <footer></footer>;
};
```

Now we need to update the layout component like so (see the comments in the code):

```jsx
import React from "react";
import Head from "next/head";

// Add the following imports
import { Header } from "./header";
import { Footer } from "./footer";

import styles from "../styles/layout.module.css";

export const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Add the Header */}
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
      {/* Add the Footer */}
      <Footer />
    </>
  );
};
```

We now have a Layout component we can re-use throughout our application with the Header and Footer on every page. We can pass the content for the page via the **children** prop.

You may have noticed we have a reference to a CSS module but haven't added that to the `styles` folder yet. Let's add the CSS and it's file. Create a `layout.module.css` file in the `styles` folder with the following code:

```css

.container {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.main {
  padding: 5.3rem 0 1rem 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

```

Now we can add the Layout component to every page. Let's add it to the `index.js`:

```js
import Head from "next/head";
import styles from "../styles/Home.module.css";

// Import the layout components
import { Layout } from "../components/layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="Products" />
      </Head>

          {/* Add the Layout component to the Home page. */}
      <Layout></Layout>
    </>
  );
}



```
