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

Tailwind CSS is a library of CSS utility classes that used in combination let you style your HTML content by appending a multitude of predefined CSS classes to your HTML elements. For example say you were creating a Card component with a heading, description and image using ReactJS.

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

1. Name our classes. Naming is hard and further complicated when you have multiple people on your team. For example someone calls something a tile and another calls it a card.
2. Potentially duplicate the same CSS properties multiple times throughout the CSS file e.g. margin and padding

```css
.cardContainer {
  border-radius: 0.75rem;
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px
      6px -4px rgb(0 0 0 / 0.1);
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

## What makes the Tailwind CSS developer experience good?

In terms of developer experience once you get over it looking like horrible **tag soup** with all those CSS classes scattered through your HTML/JSX files you will start to notice a couple of things:

- Tailwind CSS is ideal in team situations. By default, you don't have naming conflicts and there are no confusion about names as styling is done at the property level.
- The use of the Tailwind Labs official plugin for VS Code enable autocomplete functionality. If you already know the name of CSS properties and have used the likes of [Bootstrap](https://getbootstrap.com/docs/5.2/utilities/spacing/#margin-and-padding) for padding and margin you will quickly feel familiar with Tailwind.
- Another benefit is that you aren't changing the CSS, instead you are working on the HTML so it won't break other parts of your website.
- You will only have to do a minimal amount of CSS work for the likes of theming or specific custom styles which means your CSS won't grow in size much at all. In fact with the build process your HTML can be scanned to look for the CSS classes and determine if they are not used and can be removed from the CSS file of the website. Therefor only creating a CSS file with the CSS classes used.
- As the padding and margin values are predefined you won't get the same padding value declared multiple times scattered through your CSS file. You can also check at a glance are elements sharing the same padding or margin by the CSS classes applied without having to use the browser dev tools or find the class in the CSS.
- No need to write media queries as instead you can use the [utility classes outlined here](https://tailwindcss.com/docs/responsive-design) in the vein of `md:w-32` to only apply the CSS class on the page being **medium** sized

## When should I use Tailwind CSS?

In my experience Tailwind CSS is best used on a team where some/most of the developers CSS isn't strong. Creating a coherent design system with CSS is a long winded process. You will need to have a good understanding of CSS itself but also be strong at communicating a set process and construct a style guide for the rest of the developers on your team that must be followed (not copying some "janky" code from StackOverflow cause they can't work).

## What are the downsides of Tailwind CSS?
