---
title: Build a shop with Next.js and Stripe - Checkout
date: "2022-10-15T19:56:32Z"
template: post
draft: true
slug: "shop-nextjs-stripe-checkout"
category: article
tags:
  -
description: Continuing with the Next.js & Stripe online shop we now will add the checkout functionality
---

{% include "seriesstripenextjs.liquid" %}

Continuing with the [Next.js & Stripe online shop](https://andrewford.co.nz/articles/shop-nextjs-stripe-introduction/) we now will configure our shop to be able to purchase via Stipes hosted checkout page.

To do this we need to create a new API router to post the ID of the product we wish to purchase. In the `pages/api/` folder create a new file `checkout_session.js`. Add the following to this file:

```js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Check priceId has been provided
      if (!req.body?.priceId) {
        throw new Error("Price ID not provided");
      }
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: req.body.priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.HOST}/success`,
        cancel_url: `${process.env.HOST}/canceled`,
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
```

This function will only allow only POST requests. It also checks to ensure that the request body contains the price ID for the product, before redirecting to Stripe making the request with our private Stripe key.

We now need to update the product component (`products.js`), adding the form with the product price ID to post. See the changes to add below highlighted with a `+`.

```diff-jsx
export const Products = ({ products }) => {

  return (
    <>
      {products.length ? (
        <ul className={styles.products}>
          {products.map((product) => (
            <li key={product.id}>
+              <form action="/api/checkout_sessions" method="POST">
                <Image
                  src={product.images[0]}
                  alt={`Image of ${product.name}`}
                  layout={"responsive"}
                  width={0}
                  height={0}
                  priority={true}
                />
                <h2>{product.name}</h2>
                <p>{product.description}</p>
+               <button type="submit" role="link" className={styles.link}>
+                 Buy Now
+               </button>
+               <input
+                 type="hidden"
+                 name="priceId"
+                 value={product.default_price}
+               />
+             </form>
            </li>
          ))}
        </ul>
      ) : (
        <div>No products</div>
      )}
    </>
  );
};

```

The last step we need to add the Stripe front end library which generates a new shopping object. Let's first install via the terminal:

```shell
npm install --save @stripe/stripe-js
```

Once thats been added we can then add the following to the `index.js` file to create Stripe object. Make sure it sits outside the component for the page.

```js
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
);
```

We now need to more pages `success.js` and `canceled.js` to be added to the `pages` folder.

Success will have the following:

```jsx
import Head from "next/head";
import Link from "next/link";
import { Layout } from "../components/layout";

export default function Success() {
  return (
    <>
      <Head>
        <title>Order Success</title>
        <meta name="description" content="Products" />
      </Head>
      <Layout>
        <h1>Order Success</h1>
        <p>Thanks for ordering.</p>

        <Link href="/">Return to products</Link>
      </Layout>
    </>
  );
}
```

Canceled will have the following:

```jsx
import Head from "next/head";
import Link from "next/link";
import { Layout } from "../components/layout";

export default function Canceled() {
  return (
    <>
      <Head>
        <title>Order Canceled</title>
        <meta name="description" content="Products" />
      </Head>
      <Layout>
        <h1>Order canceled</h1>
        <p>Your order has been canceled.</p>
        <Link href="/">Return to products</Link>
      </Layout>
    </>
  );
}
```

In the `checkout_session.js` file we supply a `success_url` and a `canceled_url` value. This is where we redirect the user from the checkout page.

When you click on the "Buy Now" button you will be redirected to the Stripe checkout like in the image below.

![The hosted Stripe checkout](stripe-checkout.png)

If you complete the purchase, then you will be directed to the success page.

![Succesful order](order-success.png)

Otherwise you click the left arrow / back you will be redirected to the cancel page.

![Canceled order](canceled-order.png)

We have now completed the display of products and have the checkout page working correctly. Well done. 👏

You can [checkout the GitHub repository](https://github.com/andrewjamesford/shop-nextjs-stripe) for this project. Please note there are branches for each step. For more help with setting up Stripe checkout take a look at the [documentation](https://stripe.com/docs/checkout/quickstart) on the Stripe website.

{% include "seriesstripenextjs.liquid" %}

{% include "newsletter.liquid" %}
