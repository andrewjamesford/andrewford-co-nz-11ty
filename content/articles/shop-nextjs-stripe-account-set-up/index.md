---
title: Build a shop with Next.js and Stripe - Stripe account set up
date: "2022-10-12T13:02:18Z"
template: post
draft: false
slug: "shop-nextjs-stripe-account-set-up"
category: article
tags:
  - nextjs
  - stripe
  - shop
  - series
  - account
description: Continuing with the Next.js & Stripe account setup
socialBackground: bg5
---

{% include "seriesstripenextjs.liquid" %}

<iframe class="video" width="560" height="315" src="https://www.youtube.com/embed/cEL2Jtp8RLs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[Continuing with the Next.js & Stripe](https://andrewford.co.nz/articles/shop-nextjs-stripe-introduction/) online shop series we will setup your Stripe account. Head to [Stripe's website](https://dashboard.stripe.com/register) and setup a new account (if you don't already have one).

## Register a Stripe account

{% image "./content/articles/shop-nextjs-stripe-account-set-up/stripe-api-page.png", "Stripe Developers API keys page", "(min-width: 30em) 50vw, 100vw" %}

Once signed up go to the "Developer" page and select the "API keys" on the left hand side menu.

We need to now create an ENV file for our project so it can use these API keys to retrieve our products from Stripe. In the folder of your project create a new file called `.env.local` and add the following two variable names.

```
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

Grab the keys from the API keys page and add them to the corresponding variables in the `.env.local` file.

_Please be aware that these keys are for testing and you will need to generate new keys for when you go live (production)._

## Create products for our online shop

You can manage all the content for your online shop through the Stripe dashboard. This has a lot of benefits. You don't require a CMS to manage your products, you can use different currencies/pricing for different regions and you can manage your product images all in the same interface.

From the menu, access the "Products" page then click the purple "Add Product" button.

{% image "./content/articles/shop-nextjs-stripe-account-set-up/add-product-stripe.png", "Product information form", "(min-width: 30em) 50vw, 100vw" %}

Add some details for your product, add a price and upload an image. Make sure to select "One Time" for the product price.

{% image "./content/articles/shop-nextjs-stripe-account-set-up/product-one-time-price.png", "Product One Time price", "(min-width: 30em) 50vw, 100vw" %}

Now repeat until you have finished creating all the new products you wish to create. You should end up with a product list similar to this.

{% image "./content/articles/shop-nextjs-stripe-account-set-up/stripe-products-list.png", "List of products on Stripe", "(min-width: 30em) 50vw, 100vw" %}

Congrats you have now successfully added your shop products to Stripe. Stay tuned for the next update where we will display your shop products in your shop.

{% include "seriesstripenextjs.liquid" %}

{% include "newsletter.liquid" %}
