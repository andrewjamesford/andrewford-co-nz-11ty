---
title: What is Tailwind CSS?
date: "2022-11-28T08:59:49Z"
template: post
draft: true
slug: "what-is-tailwind-css"
category: article
tags:
  -
description:
---

Tailwind CSS is a library of utility CSS classes that in combination let you style your HTML content by adding the additional CSS classes to your HTML elements. For example say you were creating a Card component with a heading, description and image using ReactJS.

```jsx
const Card = ({ heading, description, image }) => {
  return (
    <div className="cardContainer">
      <img src={image} className="cardImage" alt="" />
      <div>
        <h3 className="cardHeading">{heading}</h3>
        <div className="cardDescription">{description}</div>
      </div>
    </div>
  );
};
```

Using standard CSS we would create classes for all the elements in our Card component like the example above. This would require us to create these individual classes in a CSS file. In this scenario there are two things that need to be done:

1. Name our classes. Naming is hard and further complicated when you have multiple people on your team. Someone calls something a tile and another calls it a card.
2. Potentially duplicate the same CSS properties multiple times throughout the CSS file e.g. margin and padding

```css
.cardContainer {
  border-radius: 0.75rem;
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: white;
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px
      var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(
      --tw-ring-shadow,
      0 0 #0000
    ), var(--tw-shadow);
}
.cardHeading {
  font-weight: bold;
}
```

Compare this to the same component but this time using CSS classes from Tailwind CSS below. Initially it's a shock to see such a mess of CSS classes for each HTML element.

```jsx
const Card = ({ heading, description, image }) => {
  return (
    <div className="rounded-xl shadow-lg bg-white p-4 mb-4 flex gap-2">
      <img src={image} className="rounded-lg" alt="" />
      <div>
        <h3 className="font-bold">{heading}</h3>
        <div className="font-serif">{description}</div>
      </div>
    </div>
  );
};
```

## Why should I use Tailwind CSS?

So why would you use Tailwind and pollute your components with all these class names?

The most common answer to why is you don't have to worry about naming classes or naming collisions in your CSS. Instead you can just get on with using the CSS properties you already know and set about applying them to your HTML elements. You don't even need to view the CSS file. You can just remain working on the component with the occasional look at the [Tailwind documentation](https://tailwindcss.com/docs/box-sizing).

Some reasons to use Tailwind CSS are:

- No repetition of code. CSS property declarations are [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) so aren't repeated
- No confusion of naming as all members of the team use the pre-existing CSS class names instead of creating new CSS classes
- There is a [VS Code plugin](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) that enables autocomplete functionality which again helps speed up the flow of styling
- The build process also scours your files for the CSS classes that you have actually used and only adds them to the production build reducing the size of the CSS file.

## What makes the Tailwind CSS developer experience better?

In terms of developer experience once you get over it looking horrible **tag soup** with all those CSS classes scattered through your HTML/JSX files you will start to notice a couple of things:

Tailwind CSS is ideal in team situations. By default, you don't have naming conflicts and there are no confusion about names as styling is done at the property level. The use of the Tailwind Labs official plugin for VS Code enable autocomplete functionality. If you already know the name of CSS properties and have used the likes of [Bootstrap](https://getbootstrap.com/docs/5.2/utilities/spacing/#margin-and-padding) for padding and margin you will quickly feel familiar with Tailwind.

## When should I use Tailwind CSS?
