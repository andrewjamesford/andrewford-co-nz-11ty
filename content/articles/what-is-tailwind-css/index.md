---
title: What is Tailwind CSS?
date: "2022-11-28T08:59:49Z"
template: post
draft: false
slug: "what-is-tailwind-css"
category: article
tags:
  - tailwindcss
  - css
description: An introduction to what Tailwind CSS is, and its pros & cons.
socialBackground: bg2
ogimage: "TailwindFlexboxCover.jpg"
---

Tailwind CSS is a utility-first CSS framework that can provide many benefits for a web development project. It lets you style your HTML content by appending a multitude of predefined utility CSS classes to your HTML elements. For example say you were creating a Card component with a heading, description and image using ReactJS.

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

1. Name our CSS class names: Naming can be difficult, especially when multiple team members are involved. It can lead to confusion, for example, if one person refers to a component as a "tile" and another calls it a "card."
2. Duplication: Repeating the same CSS properties multiple times throughout the CSS file(s) e.g. `margin: 0` and `padding: 1rem` we can end up with a mess that most developers on your team would be afraid to change for fear of regression issues.

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

Compare this to the same component but this time using CSS classes from Tailwind CSS below. Initially it's a shock to see such a mess of CSS classes for each HTML element. But each class is easy to remember as they map to existing CSS properties, and will not be repeated in the CSS file.

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

Some more reasons to use Tailwind CSS are:

- DRY: No repetition of code in your CSS files, `margin-left: 1rem` is only declared once in your stylesheet. CSS property declarations are [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) so aren't repeated
- Lack of confusion: No confusion of naming as all members of the team use the pre-existing CSS class names instead of creating new CSS classes
- Speed: Tailwind CSS provides pre-defined CSS classes that can be used to quickly style elements, allowing developers to focus on building the structure and functionality of their website or application.
- Consistency: By using the same pre-defined classes throughout the project, developers can ensure that the design is consistent across all pages and components.
- Customization: Tailwind CSS allows developers to customize the default styles and generate new classes with specific variations, giving more flexibility and control over the design.
- Accessibility: Tailwind CSS provides a set of utility classes to help implement accessibility best practices, such as providing sufficient contrast and using semantic HTML elements.
- Performance: Tailwind CSS allows you to only include the CSS you need (via a clever build process), leading to smaller CSS file sizes and faster load times for your website or application.

## What makes the Tailwind CSS developer experience (DX) good?

In terms of developer experience once you get over it looking like horrible **tag soup** with all those CSS classes scattered through your HTML/JSX files you will start to notice a couple of things:

- Tailwind CSS is ideal in team situations. By default, you don't have naming conflicts and there are no confusion about names as styling is done at the property level.
- The use of the Tailwind Labs official plugin for [VS Code](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) enable autocomplete functionality. If you already know the name of CSS properties and have used the likes of [Bootstrap](https://getbootstrap.com/docs/5.2/utilities/spacing/#margin-and-padding) for padding and margin you will quickly feel familiar with Tailwind.
- Another benefit is that you aren't changing the CSS, instead you are working on the HTML so there is little chance of breaking styling for other parts of your website.
- You will only have to do a minimal amount of CSS work for the likes of theming or specific custom styles which means your CSS won't grow in size much at all. In fact with the build process your HTML can be scanned to look for the CSS classes and determine if they are not used and can be removed from the CSS file of the website. Therefore only creating a CSS file with the CSS classes used.
- As the padding and margin values are predefined you won't get the same padding value declared multiple times scattered through your CSS file. You can also check at a glance are elements sharing the same padding or margin by the CSS classes applied without having to use the browser dev tools or find the class in the CSS.
- No need to write media queries as instead you can use the [utility classes outlined here](https://tailwindcss.com/docs/responsive-design) in the vein of `md:w-32` to only apply the CSS class on the page being **medium** sized.

## When should I use Tailwind CSS?

Based on my experience, Tailwind CSS is most effective when used on a team where some or most of the developers have limited CSS skills. Establishing a consistent design system using CSS can be a time-consuming process. It requires a solid understanding of CSS as well as strong communication skills to establish a process and create a style guide that all team members must adhere to, instead of relying on "janky" CSS hacks for the desired look from StackOverflow.

Tailwind CSS can simplify the documentation process by providing comprehensive documentation and resources for getting started, both from the official [Tailwind](https://tailwindcss.com/docs/installation) developers and the [community](https://www.youtube.com/watch?v=ft30zcMlFao). This can make it easier to understand and implement.

## What are the downsides of Tailwind CSS?

Although Tailwind CSS offers many benefits, there are some drawbacks that could affect both the short-term and long-term success of your project:

- File size: Tailwind requires a large number of CSS classes to be added to your HTML, which can lead to longer page load times and larger file sizes if not optimized properly.
- Learning curve: Tailwind CSS requires a different approach to writing CSS, which can take some time to learn and adjust to.
- Opinionated design: Tailwind CSS provides pre-defined classes that can be used to quickly style elements, but it also imposes a specific design aesthetic that may not align with the desired look and feel of the website or application.
- Overuse of classes: Using too many classes on a single element can make the HTML difficult to read and understand, leading to a more complex and harder to maintain codebase.
- Customization: Tailwind CSS is highly customizable, but this can also lead to increased complexity in terms of configuration, and can make it harder to maintain the design consistency across the project.
- Hard to remove: It can be challenging to remove Tailwind CSS once it has been implemented. This is because the embedded Tailwind classes are present throughout your HTML, component, or template files, and removing them incrementally can create conflicts with the Tailwind build system. Additionally, it may further complicate the project by requiring an additional build process for the new setup to incrementally replace styling.
- Waiting on bleeding edge CSS features: Recent years have seen significant advancements in browser CSS capabilities, such as [Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries), `:has()`, and [Subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Subgrid). While these features can enhance the design and functionality of a website, they can be difficult to implement using Tailwind. In some cases, it may be necessary to wait for them to become available in Tailwind or make changes to the implementation once they are supported.
- Native is forever: When incorporating a new framework like Tailwind into a project, it will require a learning phase. However, it's important to note that the knowledge acquired is specific to the Tailwind framework, including its class names and naming conventions, which may not be transferable to other frameworks. On the other hand, using CSS in its native form and understanding its intended use will result in a knowledge that will remain useful for a long time.
- Bare-bones by default: What makes Tailwind different to other frameworks like Bootstrap etc is that you will need to create basic components like footers and headers from scratch, unless you pay for [TailwindUI](https://tailwindui.com). These prebuilt components are not freely available as open source. Instead most build there own components from scratch using the Tailwind CSS classes.

Tailwind can be a suitable choice for almost any team, especially those that have no strong lead in CSS. Although it has some drawbacks, it sits between Bootstrap and native CSS in terms of flexibility and appearance. It avoids the common "look and feel" of websites built with Bootstrap, while providing some rails to prevent a large messy CSS file. To get the most out of Tailwind, it is important to adhere to its recommended practices and adjust your process to it's way.

If this hasn't put you off using Tailwind CSS in your next project I recommend you checking out the [Freecodecamp Learn Tailwind CSS - Course for Beginners](https://www.youtube.com/watch?v=ft30zcMlFao) and my cheat-sheet below.

{% include "promos/tailwindcheatsheet.njk" %}
