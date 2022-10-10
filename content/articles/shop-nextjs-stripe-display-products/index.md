---
title: Build a shop with Next.js and Stripe - Display the products from Stripe
date: "2022-10-09T16:31:45Z"
template: post
draft: true
slug: "shop-nextjs-stripe-display-products"
category: article
tags:
  - nextjs
  - stripe
  - products
description: Continuing with the Next.js & Stripe online shop we now will display the products from Stripe.
---

Continuing with the Next.js & Stripe online shop we now will display the products.

We first need to get the products from Stripe and we need to do that in a secure manner and not expose our secret Stripe key.
So let's start with creating a new file called `products.js` in the `/pages/api/` folder.

We need to install the **stripe** NPM package first. Run the following command to install it:

```shell
npm install --save stripe
```

Add the following to the `products.js` file:

```js
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    // Request products from stripe using our Stripe Secret Key
    const products = await stripe.products.list({
      limit: 100,
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
```

- Add host to .env file
- Add Stripe NPM package
- Create api end point for products api
- Create products component to list products
- Add getServerSideProps
- Style products component
- Add stripe to images domain

---
