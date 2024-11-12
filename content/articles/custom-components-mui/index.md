---
title: Create Custom Components in MUI
date: "2024-05-01T23:58:44Z"
template: post
draft: false
slug: "custom-components-mui"
category: article
tags:
  - mui
  - material
  - ui
  - reactjs
  - custom
  - storybook
description: "In this article we will create custom components in MUI (Material UI) using ReactJS and Storybook."
ogimage: "custom-components.png"
---

{% figure "./custom-components.png", "&quot;Create Custom Components using
MUI&quot; / Bing Image Creator"
%}

The Material UI (MUI) library is a popular choice for building React
applications. It provides a set of components that follow the Material Design
guidelines, making it easy to create beautiful and consistent user interfaces.
In this article, we will create custom components in MUI using ReactJS and
Storybook.

The following is a transcript of the video tutorial below.

youtube.com/embed/f6Bjdmlx35s

## Introduction & Getting Started

So in this video we're going to end up with three components in our own custom
storybook.

So you need to open your terminal and we're going to install the latest vite
react and typescript template.

```sh
npm create vite@latest mui-customisation -- --template react-ts
```

We now need to open VS Code and we're going to open up the folder with the
project that we've just created.

Now I like to use dev containers when I'm working on projects.

Open the command palette, command shift p or control shift p and select dev
containers add dev container configuration file, then add it to the workspace
and type in **Nodejs & Typescript** and use the defaults there.

Once this is finished a alert will say to reopen any container and we want to do
this to load it under docker.

You will also be asked to rebuild the container.

Once that completes the terminal will allow us to install the latest version of
storybook to follow through the defaults here.

```sh
npx storybook@latest init
```

Now close the little pop-up here and use **Ctrl + C** to end the terminal
session.

Now let's ensure all our packages are installed.

I like to use the prettier code formatter so I make sure that I've got the
extension installed. Now let's open up a terminal, install the prettier package
and let's make a new file for the prettier config.

```sh
npm install --save-dev --save-exact prettier
```

`prettierrc.json`

```json
{
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "arrowParens": "avoid"
}
```

So that's `prettierrc.json` and then we add the json config that we want to use.

Under the storybook directory we want to start by opening up the `main.ts` file
and then we're going to add some add-ons to it.

```ts
addons: [
 '@storybook/addon-links',
 '@storybook/addon-essentials',
 '@storybook/addon-onboarding',
 '@storybook/addon-actions',
 '@storybook/addon-interactions',
 '@storybook/addon-themes',
],
```

Next we are going to add the typescript options.

```ts
typescript: {
 reactDocgen: 'react-docgen-typescript',
 reactDocgenTypescriptOptions: {
 compilerOptions: {
  allowSyntheticDefaultImports: false,
  esModuleInterop: false,
 },
 shouldExtractLiteralValuesFromEnum: true,
 shouldRemoveUndefinedFromOptional: true,
 propFilter: (prop) =>
  prop.parent
   ? !/node_modules\/(?!@mui)/.test(prop.parent.fileName)
   : true,
 },
},
```

Now these are going to be able to generate the documentation in the storybook
for us.

Next we're going to edit the `preview.ts` file and we've got a few items to add.

We have to add the font files and we need to add the material ui theme provider.

```ts
//import type { Preview } from "@storybook/react"
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/material-icons";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import theme from "../src/theme";
//const preview: Preview = {
```

Now that we've added the decorators and the parameters we need to add the
corresponding modules for that.

```ts
//export default preview

export const decorators = [
  withThemeFromJSXProvider({
    themes: {
      default: theme,
    },
    defaultTheme: "default",
    Provider: ThemeProvider,
    GlobalStyles: CssBaseline,
  }),
];

export const parameters = {
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

So let's install moving material, emotion react and emotion styled.

```sh
npm install @mui/material @emotion/react @emotion/styled
```

After that we need to install the font, the material icons, there's a font and
the icons themselves.

```sh
npm install @fontsource/roboto @fontsource/material-icons @mui/icons-material @storybook/addon-themes
```

Now let's close that terminal and we're going to add the `theme.ts` file.

```ts
import { createTheme } from "@mui/material/styles";
import { blue, purple, red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: purple.A700,
    },
    secondary: {
      main: blue.A200,
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
```

So this is what we're referencing in that preview.

We're going to reference the styles in the create theme and we're going to
reference some colors.

After that we will reference the palette that we want to use.

You can see there with the primary, secondary and era.

And under the stories directory we're going to remove the unused file here for
the header and the page.

## Custom Button Component

So now we're going to open the button component file (`Button.tsx`) and we're
going to clear out the stuff we don't need.

Now because we're using the material ui button we actually want to create a new
vision of it to customize it.

And we've also got to add the button base props and the extra properties that we
are going to add as an interface there.

So we've added a label.

After that we've then added the button component itself and we've added some
default properties.

Now let's open up the `Button.stories.tsx` file.

And we're going to remove the default content.

First of all we're going to add the meta properties and that's for the type of
the button.

[GitHub Source - Button.tsx](https://github.com/andrewjamesford/mui-customisation/blob/main/src/stories/Button.tsx)

And we're going to create a story object which we're going to add some options
to for its arguments.

So in this one we've got color primary and label primary button.

So let's open up a terminal.

And we can run npm run storybook to get it up and running.

```sh
npm run storybook
```

Now because I've got the Vite extension for VS Code I get a little pop-up there
and I can preview in an editor in VS Code.

So let's look at our button in storybook and you can see there we've got the
documents for it.

So this has got all the previous properties that are coming from mui and we can
change them by the controls there.

You can see we've got a label so we can change that and we should be able to see
the changes reflected.

We can also change the size and the variant for the button.

So now let's open up the button file so you can do command P for that or control
P on Windows.

Now one of the easiest ways to update the styling of this button is to come in
and update the theme.

So if we change the primary color to green here we can open up storybook and see
it's reflected here.

## Custom Dropdown Component

Now let's look at the file explorer and we're going to create a new component.

Now we're going to call this one [drop down].

[GitHub Source - Dropdown.tsx](https://github.com/andrewjamesford/mui-customisation/blob/main/src/stories/Dropdown.tsx)

So again we extend the existing component from mui and in this case the select.

We then create a type for its base properties.

And then we create a interface.

Next we can add the drop down component and then we can add our default
properties for this component.

We can add the story file now then it's going to be called
`Dropdown.stories.tsx`.

So just like the button story we have to add the meta story object and the drop
down component itself to the file.

[GitHub Source - Dropdown.stories.tsx](https://github.com/andrewjamesford/mui-customisation/blob/main/src/stories/Dropdown.stories.tsx)

We need to create the meta object and do its export and its type of story.

Now we're going to add the example for the story there.

We want to import the mui menu item component which we're going to use in our
example.

Now that we've imported the menu items, we now need to create an array of the
children items that are going to be of our drop down.

So the options that people can select.

Now we can add the children as arguments to the example.

Now that we've added the child items to the example, let's go over some ways
that we can actually do some customization of the actual component itself in
terms of its look and feel.

So we can add a star attribute and just like how we would with CSS, we actually
have access to all the standard CSS options available.

So in this case I am setting the background to orange.

Let's take a look in the storybook so that we can see how it's turned out and
you can see it is orange in the background there.

## Custom Datatable Component

Now let's create our new component `DataTable.tsx`.

[GitHub Source - DataTable.tsx](https://github.com/andrewjamesford/mui-customisation/blob/main/src/stories/DataTable.tsx)

Now this one's going to be a bit more customized in the sense that we've got a
lot of elements that are going to make up the component.

So this is the data table and in it it will need to import a whole lot of
components.

As you can see here there's table, table body, table cell, table container,
table head and table row.

Next we'll make an interface for the data for the table and interface for the
header cell.

And an interface for the table header props made up of the header cells.

The table props come next where we've got the data, the head cell and whether
the table is zebra striped.

So we're going to need a table header component which is going to take the
properties needed for that header row.

And now for the component itself which is the data table.

We can de-structure the props for the table into the variables we want to use.

We're now going to use the esx prop which is a shortcut used for defining custom
styles that also has access to the theme.

So now I've made a SX variable and if the property for zebra striped is true
then it's going to set the background color to the gray that's available from
mui.

We're going to add the table container, table header etc and to the table row
component we're going to add the sx object to the sx props.

So that's going to allow us to customize the table row to show the zebra
striping if it has been set to true.

We now need to make a data table stories file `DataTable.stories.tsx`.

[GitHub Source - DataTable.stories.tsx](https://github.com/andrewjamesford/mui-customisation/blob/main/src/stories/DataTable.stories.tsx)

And like previously we need to import the component and we also need to create a
utilities file.

We're going to create our data on top of that.

As usual we need to pull in the meta and the story object.

And then we need to set these meta so that it gets all the properties.

Now of course we need to export that, create the story.

We need to make a set of data for the headers.

We're going to make a function now to help create data and our story
`DataTableUtils.tsx`.

```tsx
import { Data } from "./DataTable";

export function createData(
  id: number,
  movieName: string,
  director: string,
  year: number,
  rating: number
): Data {
  return { id, movieName, director, year, rating };
}
```

So now we're going to create our data using the utility function create data.

Now we can add the example for our story and we're going to pass the rows data
in there as you can see and the header cells.

We're now going to make a zebra striped example.

Looking back in the browser we're going to look at the data table and you can
see the docs have all rendered there and we've got an example here.

On the following one we have the zebra stripes because we have the zebra striped
value set to true.

So you can see in the example here I have put a minimum width of 300 pixels and
when we try to close it to that size it stays at that minimum width.

It's common with responsive design that you want to have different breakpoints
and show different sizes so you can do this with the esx prop by using the
array.

So in the first example here the breakpoint is for the larger size and it's set
to be the 750 pixel mark.

Now if we make the viewport smaller we can see that the minimum width switches
down to the 300.

## Summary

So we've built a storybook now with three custom components.

We've got the button here and we use the theme there to set that primary color.

Remember that you can change the color set in the theme.

We have a custom data table which is made up of many components and we also have
the ability to customize it in terms of adding a striped value.

Not only that we are using the arrays to set the minimum width of the table
there.

Finally we have a drop down and we've gone for the most over the top way of
styling and we can actually add a style property and change the CSS properties
on the actual component.

So don't forget to like and subscribe my video here and check out the GitHub
project linked in the comments as well as the text guide.
