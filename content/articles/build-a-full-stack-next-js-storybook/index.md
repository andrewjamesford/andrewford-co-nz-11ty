---
title: Build a Full-Stack web app with Next.js - Part 6 - Storybook
date: "2023-10-30T14:01:33Z"
template: post
draft: false
slug: "build-a-full-stack-next-js-storybook"
category: article
tags:
  - storybook
  - reactjs
  - nextjs
  - component
  - javascript
  - isolation
description: "In this installment we create a Storybook for our project and start building out our Header component. I walk through some of the features of Storybook and how it can help you build your React components in isolation."
ogimage: "full-stack-6.jpeg"
---

{% figure "./full-stack-6.jpeg", "&quot;Building a storybook&quot; / Bing Image Creator" %}

The following is a transcript of my live stream on Oct 29, 2023 on Building a Full-Stack web app with Next.js. This is part 6 of the series. In this installment we create a Storybook for our project and start building out our Header component. I walk through some of the features of Storybook and how it can help you build your React components in isolation.

The project is available on [GitHub as LMS NextJS](https://github.com/andrewjamesford/lms-nextjs).

Check out [Storybook](https://storybook.js.org/) for more information.

youtube.com/embed/EGn-MsRIs4U?si=xT4O5dqmXvoaX0D0

---

Can you hear me alright?

Just double checking the stream, always pays to.

Cool so we're good, we're good to go.

Sound is working.

Getting a little bit of feedback here on my headset but that's OK, I can put up with that.

OK so we've got this header here.

We built it last time, it's not much to it.

As you can see it's just literally a HTML header component with the H1 inside it there.

We didn't place it anywhere inside our app but we can keep going on that.

Let's take a look at what we've actually done so far.

So we have gone through some planning last week.

So let's switch to Chrome, we'll just take a look at that.

So in Chrome we set up the planning for the Kanban board in GitHub projects.

And you can see we have created a backlog of routes and components and items that we need to do.

In the in progress column we've got the header component there so that's underway.

Now we can do a couple of things to help us in terms of building our React components.

One thing I like to do when working on a new project is to actually have a thing called Storybook.

Now Storybook is a way for us to have a playground where we can build our components in isolation.

We can style them to our sort of heart's content away from the main app and it means that we can sort of configure them, set up easily the different properties for them, even have some dummy data set up so that we can maybe enable, disable, add new titles, content, you name it, that kind of thing.

We can do that.

I have done a previous, I believe I did a previous video on that before so if you have a look back through my YouTube channel there's some guide sort of thing on how to do that but we'll start again from scratch.

We're going to add it to the project.

We'll get that going.

We will continue on building out our header component and we will continue on trying to start getting this project coming together.

Okay, so what do we do when we want to start something?

We look at the docs.

Let's look for Storybook here.

Storybook.

js.

org.

So this is the one.

Okay, so that's all new.

Looks like they've updated it.

That's cool.

Okay, so if we go to the Get Started guide, that's always a good place to start.

They've got a good channel on how to get it all set up and running but we'll do the same.

So they want us to initially install Storybook for the project and make sure that you read this part here.

Storybook is not made for empty projects.

Storybook needs to be installed.

If I work on empty projects, there are many ways to bootstrap in a framework.

We have an app already.

So I think we should be good.

We have the dependencies etc.

So let's get this underway then.

So I'm going to copy that mpx command and that's going to do the initialization on our project.

So let's go back to VS Code here.

Make sure I'm in shot.

Okay, so let's have a look.

We have VS Code.

Okay, we've got the console line is running at the moment.

I'm just going to stop that and on my workspace here, I've got my alamos next.

js project.

Okay, so I'm going to paste that in.

mpx storybook latest initialize.

Okay, cool.

So just double check.

Make sure you've committed your code first.

I can see here I'm good to go.

Just to make sure.

I'm going to do a good status.

Make sure that I'm in the code first.

I can see here I'm good to go.

Okay, no problem.

Okay, let's run that.

Okay.

While it's doing its thing, we should be able to start planning out what we're going to do with our component here.

So I've got that.

Let's talk about this folder structure.

I've created a separate components folder and it's got the header component in it and the logout button.

Okay, we have detected that you're using ESLint storybook provides a plugin that gives the best experience for storybook and helps follow best practices.

Would you like to install it?

Yes, I would.

Okay, so it's going to add that ESLint plugin.

Keep doing it.

So we've got the components folder.

So these components that are going to be used across the site.

They're not page components as such.

So it's all about working in a structure that you are going to understand.

I like to keep mine relatively simple.

But of course, things change.

You can move stuff around as you build out your project.

It's not set in stone.

This is code.

Remember, this is not granite that we are making our project out of.

So we can undo things.

Okay, so it's taking a little bit of time there.

Not a problem.

Okay.

Once we have got that set up, we should have the Chrome, of course.

We should be able to get to the likes of the wizard.

Okay, so before goes well, you just see a set up wizard that will help you start a story of introducing you to the main concepts and features, including how that UI is organized, how to write your first story, and how to test your components responses to various inputs utilizing controls.

Okay, nice.

Cool.

We're going to need to have this command here to start the story of workup.

I'm going to copy that and let's go back and check on what code has done.

Are we finished yet?

No, we've got one more question.

You need to install the following packages, npm 10.

Okay, let's do that.

Okay, so that's kind of open that.

Let's grab this.

Switch back to Chrome.

Cool.

Okay, so let's go through a tour.

That's going to give us a bit of a guided tour of how it works.

Start that.

Storybook is built from stories.

Storybook stories represent the key states of each of your components.

We automatically added four stories for this button component in this example file button dot stories dot JS.

To note that it's got these separate files here called stories.

So we can have our variations there.

Story previews are interactive.

So when you modify code or story, storybook automatically updates how it previews your components.

And this is the key core beauty of storybook here.

You are going to be able to see your components in isolation without any impact from the actual UI itself.

Maybe other things could impact what your look and feel looks like.

So the way that you make your components with storybook is that you then hopefully make them all just independent of each other.

And that's the whole goal of building components because we want to be able to reuse them.

So storybook previews are interactive.

And you'll see here it's got this cool playground here where we have the controls and we can set values.

We can change this value here to false.

Hey, confetti.

Nice.

So with that, we can change that state from being primary to not being primary.

So it's just got a false there.

So that means that we can very quickly have just by properties alone, we can change a button to be of the primary type.

So what would that be?

That it could be maybe like on A form.

Maybe you've got a save and a cancel.

You probably make the primary button the save because that's the interaction you're trying to ask the user to do.

And then the cancel would be the non-primary look.

So less sort of eye-catching there.

Okay.

So now it's got this little wizard here on how to write a story.

So these imports, first import meter and story object for type safety and autocompletion and typescript stories.

We're not using the likes of typescripts.

So we want to use it in this case.

Next import a component, in this case, the button component.

And then the default export, it contains metadata about this component stories.

The title field optional controls where stories appear in the sidebar.

Okay.

So you got that button, you got a title.

So this is what you can name it for your example here.

So each named export is a story.

So its content specifies how the story is rendered in addition to other configuration options.

So you can have the, like in this case, the button component.

The button component has these variations, one being a primary.

It's in a secondary, large and small.

I can see there on the left.

So we follow through this.

We can see all these arguments here.

So in this story file, we can set up each of these stories and each have its own object.

And each object has its own arguments.

Okay.

So these are all stuff that you set.

These are the properties for the components themselves.

So I would imagine this button component has got the properties of primary, label and background.

Okay.

So those are properties for that component.

So if you cast your mind back to where your views react, maybe in the past.

So properties are things that you pass into your react components.

We'll go over that shortly.

Okay.

So we'll continue with that.

We've got the arguments.

Create your first story.

Now it's your turn.

See how easy it is to create the first story by following these steps below.

Copy the warning story.

Open the button story in your current where you can do a tree and paste it at the bottom of the file and save.

Just copy the code for now.

And we'll close that.

Okay.

Let's have a look at back to our project now.

We should see a few different things here.

Let's switch back to code.

All right.

So in our VS code, we can see the little green there.

A little bit difficult to see.

Maybe it needs to bump up in size.

But you can see here, there is now a folder called stories.

So we've got stories.

It's the same level as our components folder.

And in that stories, we have a few files that it's created for us.

Okay.

So we've got a button, funnily enough, a header, an ASM CSS, etc.

And even a storage for that header.

So let's just take a look at it.

It's probably a little bit more complex than our one.

That's fine.

And that's okay.

We can leave it like that.

And in there, we can have our component.

We've got the CSS there.

And I've got the, looks like some MDX there.

Okay.

So it's made that folder for us.

It's set up the configuration.

We should see in our package.json.

If we look at our source control here, we should be able to see the difference between it.

And we can see there.

So what has it done?

What has it added to our project?

It's added the storybook there.

So it's got the port number running there, running the build, and then inside those dev dependencies, because these are for running locally, of course.

So it's when they're in the dev dependencies folder structure.

So we've got the storybook add-on essentials and add-on interactions, add-on links, add-on bombarding.

So all these are parts of the sort of the tutorial.

And with React and testing library to go along with it with storybook itself.

Okay.

Cool.

Okay.

I'm 100% happy with that so far.

If we close it.

Now the one thing I'm not kind of happy about is we've got our nice sort of component structure.

And this comes down to personal preference.

This is not set in stone or anything.

The one downside, I guess, storybook is that by initially it will store all these files.

We can remove those.

That's not a big problem.

So let's actually go through and look at that.

What are we going to need?

We have our header component.

Okay.

And we want to have a stories component for it.

We could actually just steal this, which is not a bad idea.

It's going to give us some ideas as well.

And why not?

So we've got the header stories there.

So I'm not a big fan of just having the stories folder.

I prefer just to put my stories into the components instead.

That way when I do so, then it's just going to sit in that folder with it.

I like to keep them together.

Let's do that.

Okay.

No, I don't want that.

I don't want to hear from stories.

I want the header, which is this one.

Okay.

So it's doing that.

Now already we've got a difference here.

It's got an argument of a name.

This is a pretty good idea.

We'll leave it at that, I think.

Use this not a bad idea to show on our header component.

Let's actually go back to our storybook.

Not a storybook, our sketches of what we actually did for design.

Because that would probably be helpful.

Let's have a look at the ScalaDrawer.

Okay.

Did we have a username in there?

No.

Okay.

That's okay.

We don't need to have the same.

So we'll just take that out for now.

Sorry, I haven't switched screen.

So that's our ScalaDrawer.

Looking at it now, our homepage.

Simply got the logo and menu.

Very basic.

Okay.

So we'll step back to this.

What was our design?

Let's get back to code.

Okay.

All right.

So I've got the users there.

We've got the arguments.

Okay.

So we've got our Jane Doe.

Let's take that out.

Just for the time being.

I'm sure we'll add some arguments in shortly.

Okay.

So we've got an example header, layout full screen.

We've got the headers themselves.

Cool.

Okay.

So we've got the headers there.

Header there.

We've got some assets and the like.

We'll keep the configuration.

Okay.

So we'll leave all that there.

It's all good.

Okay.

And we'll have, so we've got the MDX there.

That's okay.

Got the header file.

Let's see.

It says, probably going to make a new one anyway.

So I'll do that.

Actually, it wants to add a module, don't I?

So we're going to use CCS modules on this project.

Okay.

So I've got the module there.

We've got the stories.

Okay.

We've got the configuration.

And a few others in here.

So what I'm going to do, let's double check.

I think these are being used in terms of the configuration.

So we'll leave the assets for the time being.

We'll have the configuration there.

This is because I don't have MDX as a file type, I believe.

It's not showing up correctly.

Let's put it to JSX.

No, it's not going to, it's even worse.

No, I'm going to have to get some configuration for some plugin to do MDX at some point.

I might just switch that back to plain text because it's a lot harder.

There we go.

I'm going to keep that there.

I'm going to take away, I mean, buttons are good, but these aren't the buttons that we're going to use.

So let's take those out.

Remove those.

Hopefully this isn't going to break.

No, it's going to break it a little bit.

I'm going to have to stop it in a sec.

And we're going to have a header here and a page, stories as well.

So let's remove all those.

And even more errors.

Yay.

Okay, so I'll stop everything.

That's fine.

We can always start it up again.

So now I've sort of pulled back what we had in our stories folder to be a little bit less over the top in terms of having it all sort of dumped in one place.

So I'm going to keep mine in my components folder.

I may at some point actually make separate folders for each one.

Let's sort of see how we go.

Okay, let's run this up.

Okay, so we have our storybook NPM script down here.

Let's run that.

So let's go kick off the storybook and it's going to run the dev there.

Okay.

So periodically, that all should be good.

Let's switch back to Chrome.

Make sure that that is the case.

Okay, and let's switch to.

We've got some red errors.

That's all cool.

Okay.

We've got the docs there.

We've got the logged in unable to read a story.

It's confirmed and it's missing from the default export and the same for that as well.

Okay.

So what have we done wrong?

It's always good to take a look back at what our code base is complaining about.

Let's switch back to code.

Now, cool thing is it's working.

Okay, so we've probably got an import problem.

Yes, we do.

We've got a export header imported as header was not found in header possible exports default.

Let's go back and take a look at our story.

So what is expecting in here?

We've got our header like so and our header.

js file.

Export default function header.

Okay, so what's gone wrong?

What could that possibly be?

It's saying export header imported as header was not found in .

header.

Export.

So, okay.

So what is actually happening?

And our export default here, that's where we are having the issue.

So let's have a look.

We can go back and actually have a look at what the previous one was.

We can do so by looking at.

Because we've deleted it now, of course.

So we go back to Chrome itself.

And if we have a look at sort of an example.

Okay.

So what's happening is in our component, we are exporting it as default rather than exporting it as header.

Okay.

Storybook doesn't like that.

So we need to change our code to do that.

Let's go back to code.

Okay, so.

We can just have a function header.

Export default header, like so.

Oops.

Okay, so that's rebuilding again.

I've got that export default header.

And let's go back to Chrome.

Still got the same issue.

So what have I done wrong?

Okay, I still haven't done this correctly.

I should be exporting it differently.

Unable to render story is component annotation is missing from the default export.

Okay.

So.

Can't.

It has a anonymous function there, like so.

I changed my keyboard, so I'm a little bit clumsy on the keys at the moment.

Okay.

Switch back to Chrome.

Still not gonna issue.

What would I do to solve this?

This is like a great question.

You are gonna have times when you will not be able to sort of see what is happening.

So it's really good to figure out how to solve these issues.

Okay, so what have I done wrong?

You know, let's probably.

What's one way I could find out why that is not working?

Well, example here is component annotation is missing from the default export.

Okay.

Why is it complaining about that?

That's a good question.

Is there something wrong with my code or is there something wrong with my configuration?

Okay.

There is multiple ways that we can create components.

They don't have to all have, I guess, this normal export default function style, which is very common from Next.js.

It's like the sort of the default there.

Okay.

Yeah, so it's got the same.

if we look at our different components, they are similar.

So what could we do?

We could always go back and have a look at a previous project.

That's a perfectly great way to do that.

I know I've got something already set up.

If we go to my blog.

Now, under my articles here.

Okay.

UI component library.

Like I said, I previously created a video on using Storybook before.

So it's very much the same sort of structure.

Okay, so using the buttons.

Okay.

So if we look at the project, we can actually get an idea of how it was working.

I've got some typescripts, but that's okay.

So we've got this project.

I've got the source.

Let's go to the components.

If only nothing is hitting component already.

So export constant hitting.

So that's where I went wrong.

So I was still exporting as default when I should be exporting as the named value of the component.

So let's go and jump back to the likes of our code.

So let's do that.

Just before we do that, though, I'm going to copy and paste.

Why?

Because I can.

Switch back.

Okay.

Again, this is typescript.

So I'm not going to have any of these values inside of the properties as typed values.

Instead, I just need it like that.

Like that.

I don't need the export default.

Now, will we have to stop start it?

Probably.

Okay.

Okay.

So why is that not leaking?

Export constant header.

Export constant hitting.

Now, stories.

This might help.

Okay.

Okay.

What can we do?

What can we do?

Obviously, there's something I am not noticing.

That's okay, though.

After battle of software development is trying to figure things out.

We're not going to get put off already.

So we can do that.

So we've got the import from the header.

I'm going to go back and take a look at my story.

Okay.

So we've got the import, the header.

We're taking that from our header.

Take a deep breath.

Well, that couldn't be a bit of a problem.

So we've got hitting.

I should have had export constant header.

Okay.

And let's switch back to code now.

And here's where I went wrong.

Okay.

Cool.

Oh, good.

Okay.

So what did I do wrong?

I wasn't exporting a default.

I was expecting a default with JavaScript.

I named my component wrong.

So I called it heading instead of header.

So be careful about silly things like that.

It's very easy to get tripped up over that kind of stuff.

That is part of the course.

That is what happens.

We all make silly mistakes like that.

Don't see anyone popping up in the comments pointing out we're undone something wrong.

That's okay.

Be happy if you guys shout out if there's anything that is not working correctly or you can be going, hey, do that silly.

Yeah, please shout it out in the comments.

That would be helpful for me.

Even after all these years, I still make plenty of mistakes.

Okay.

So we've got the header.

We've got the default header there.

We've got the stories.

So we've got our example.

I'm not a big fan of saying example.

I'm just going to say components.

Hopefully this is not going to break it.

Let's refresh.

Yeah, no, it's complaining now.

Okay, so you kind of need to take that path out.

The path is, of course, got the name.

There.

It's okay.

Now it's called components.

It's got header.

It's got our docs.

It's got our logged in, logged out.

Cool.

Okay, so I'm happy with that now.

It's looking a little bit better.

Switch back to the likes of code.

Okay, so I just renamed that total there.

So now it's components and header.

And that way we won't have.

Oh no, it's not like a big fan of having example there.

It's not particularly cool.

All right.

Components, header.

Got my name.

I've got a logged in state, a logged out state.

Do I need that?

Probably not.

I'm just going to call one default.

That's where we can complain.

And I can get rid of the logged in out state now.

Switch back.

It's probably going to be complaining.

Let's see.

Is it?

No.

Ah, nice.

Because I was on the docs one, it didn't complain.

Got to watch out for these paths in the URL bar here.

Because if you.

It's just literally using them as parameters in a query string.

So if they're not correct, then of course the page isn't going to load.

So if you change the name or something, it is going to impact on it.

So watch out for that.

Okay.

Cool.

Okay.

So I've got my header.

I just got the default.

Again, there's not much to it.

Going and taking a look at our scull drawer.

Let's take a look at what we created as our look and feel.

Okay.

So we've got the.

What we call it?

The.

Logo.

We've got a menu.

And that's pretty much it.

The menu will sit on the right hand side.

The logo on the left.

It's the same throughout the different sizes.

So our mobile tablet view and on a desktop view.

The top bar here of this header will continue to reach out to the full width of its size.

So what can we do about that?

Let's place.

Maybe let's just make a logo.

I'm just going to put a placeholder in, which is fine for the time being.

What we have here.

So we've got a header.

I'm just going to be really original and jump back into our code.

And I'm going to call it LMS.

So that's our logo as such.

So I'm going to give that a div.

And then we'll put a name.

Okay.

So now we've got our logo.

And then we're going to put the menu in in a sec.

Switch back to the likes of Chrome.

Okay.

Cool.

So that's updated.

We're starting to get there.

Well if we want to actually start doing any styling, there's one thing that we need to do.

Because at the moment it's just using sort of default font sizes and default fonts.

So if we look at that, yeah, it's just coming directly from the user agent style sheet, which is the browser itself.

Okay.

Let's switch back to code.

Okay.

So we've got LMS there.

I've made this module, CSS module here.

So we need to import that.

Okay.

So the best thing sometimes is to find an example.

Let's see if we can find a file for a module.

Yeah.

So we've got an example there.

Okay.

Let's do the same.

So in our header, we're going to need to import the header.

module.

css file.

It's going to import it as styles and then we're going to be able to use this in our styling.

Okay.

So back to our header component.

Import styles from, and this is going to be just the local file there.

Header module.

css, like so.

And then we can do something like this.

Class name.

We're going to be using a JavaScript variable because it's styles and we can have our header.

Okay.

And we can do the same for the logo.

So copy that bit.

Cool.

Okay.

So jumping back to VS Code, Chrome, sorry.

We should now have that loading and let's actually add some styles to that so that we can actually see that.

That is correctly working.

So let's go to our style sheet.

Okay.

And we've got logo there.

Font family.

I'm actually just going to keep it real generic and switch it to sort of a sans-serif.

Okay.

And then we should be able to switch back.

Now.

logo.

Just going to do just to make sure that it's displaying correctly.

Okay.

So probably got.

Okay.

What have I done wrong?

Well, we've got a background.

We've got a color there.

We've not got it unpacking on the font.

Probably because H1.

I don't know.

Well, there you go.

So no quotes.

My bad.

I don't know why I decided to do that.

Sometimes you do some weird things sometimes.

I'm going to take those off.

It's going to be inherited.

I'm going to get rid of the background color there.

And we should have another one for the header.

Okay.

So thinking about our designs.

Pretty basic.

Had a border radius.

And it's, you know, I say one rim.

It's probably too big actually.

0.5 rem.

Border radius.

We're going to need background color.

What could we have?

We could have maybe, I don't know, what's a cool color.

We're actually, because we've only done it as wireframes there, we've got no sort of look and feel coming on yet.

Let's pick something.

Probably a bit too pink.

Maybe.

That's not cool.

Too bright.

Not a big header of that.

So you can see there, it's got a little, yeah, that could work.

Sort of olivey green.

Yeah, I'm cool with that.

And then I'm going to add some padding.

Cool.

Maybe it didn't, I could go bigger.

You know, we could be a bit more chunky.

Let's make it one rim there.

Cool.

Okay, so we can see there in our component, we're getting these CSS module class names are coming through.

Cool thing about CSS modules is that it will get a unique name there every time it is rendered.

That's built into the next JS.

So what it's doing is going through a build process, putting, appending a unique identifier on the end of the class.

It uses the component name and then followed by the class name that you have in your module folder with the underscore.

And then of course the unique identifier.

That way, it should always be unique and you shouldn't get any CSS sort of clashes with that.

So one of the benefits of using CSS modules.

The other cool side of that, because everything has been put inside its own file.

When you come to get rid of the component, you can feel comfortable in removing that CSS file at the same time.

It's got some cons.

One being, you could end up with a, if you're not diligent about your CSS styling, you could end up with a whole lot of repeated sort of classes in those individual modules.

So you may need at some point to go back and refactor and pull those out, maybe into a global style sheet that you're using throughout your project.

Just so that you're not reinventing everything.

But yeah, it all comes down to preferences.

It's not right or wrong way.

It's just sort of strengths and weaknesses and pros and cons.

Okay, so we've got the LMS there.

If we take a look at the browser.

Cool, cool.

Okay, it's going to move the browser down a little bit.

Cool.

Right, and so we've got our components, got our logo.

If we switch back to the code there, we've got our CSS classes and alike.

Border radius background color padding, our font style itself.

We've got the, we're just using the black default color there.

Cool.

Okay, so that's starting to come together.

Okay, so we've got that come together and go switch back to Chrome now.

Okay, now I haven't placed this.

Well, start us there's two things I am not running the project at the moment so it's for we're just going to crash now.

I'm only running the storybook.

Secondly, our header component does not sit in any of our actual layout for the app itself yet.

It's purely sitting standalone and our storybook.

Cool thing about that is that because it's standalone in our storybook, we can do a few things inside of our storybook here and we can sort of test for likes of different sizes.

So if you actually have a look here, it looks like a cool thing.

That's working correctly.

So we've got the small.

We can do that.

Okay, so we have small mobile layer so we can actually have a small view of it.

We can have a large mobile tablet and sort of reset it can be like it is top.

So it's all there.

Quite cool.

We've also got the likes of what else we got here.

We've got the flight grid view.

So you can see it's good for the background.

You can change the background or preview for an image there if you would like.

There's a ruler just really cool to the showing.

So using sort of one room there, which is 16 pixels in this case for our padding.

And you can see that is displayed there with the measurements plug in.

This is all this is all default to a storybook.

We haven't had to add these as separate notice.

Also, it's got a little refresh here so you can remount it.

Which is pretty cool.

And you've even got a sort of zoom so you can zoom in on your components.

Reset it.

It's pretty cool.

You can also sort of add these outlines as well, which is again, we're really nice.

It's a good way to just visually see how your component is built as well.

Cool.

OK, so go to LMS.

We have our logo.

Now at the start of the project, cast your mind back.

I imported the Radix components.

So let's just double check that that's all up and going.

So if we go into project here, we have the Radix UI theme.

OK, so we're using that in our project.

Cool.

So what I'm going to do is what you should always do when you are working on projects.

Try to commit often.

I think we're at a good point.

We've got it.

We've got storybook set up.

We've got our header component displaying.

We know that our CSS modules are working correctly.

And we can actually check that in now, feel confident that it's looking pretty good.

So let's do that.

So I added a storybook.

Project.

And set up header component.

So commit that.

And we'll sync those changes.

Awesome.

Like I said, we've got Radix there.

If we jump back to the likes of Chrome.

Let's do that.

So.

Got our LMS.

Now, let's go and take a look at the Radix UI library again.

OK.

So we've already done this part.

We've already set this up.

Part of our project.

Now, the reason we're using this library, we've got a whole lot of pre-configured components that we can use out of the box.

We don't have to start from scratch.

So that's why we're using them.

Another good important point about them is they have some good defaults already set up in terms of accessibility.

So we can continue with that.

OK, so let's go down to this layout here.

What do we got out of the box here?

Let's just have a quick look through.

So we've got, let's get the overview of the theme.

So the theme has the colors there.

So you can configure that.

So that's currently we have that configured.

No, I think it's just using the defaults completely at the moment, which is fine.

So we can set all those things, which is pretty cool.

We've done something already that we probably shouldn't know if we set the radius.

So there's an ability there to do all that as well.

Colors, etc.

That's OK.

We can just undo those.

So pretty cool.

It's already got quite a lot of color scales and lights set up.

We've got a dark mode already, which is pretty cool.

So we'll be able to add that as needed.

Visual style, panel background.

So we've got panel elements there.

So we can have a translucent.

We can have it solid, etc.

Very cool.

The typography.

It's all pretty much set up and done for you.

Pretty awesome.

Layout.

OK.

We could just use our own CSS to perform our layout.

But one of the benefits of using something like this library is that we can use that to instead have that consistency.

We can sort of step back and just have our CSS modules for the styling of things which are completely custom, which aren't as part of the Radix UI.

So we'll use what we've already got set up here.

So there is some layout components already.

We've got a box, flex and grid, which is awesome.

So we can set up our.

looking back to our design.

OK.

Pretty basic setup.

Logo on the left, menu on the right.

We want to do that sort of layout.

So a good way that we could do that, we could use maybe the flex layout, which would allow us to do that quite easily.

We could actually use a good layout as well.

Probably not needed.

I'm just going to have the flex, have the logo on the left and the menu on the right.

But also know, I believe there is a menu already.

It's a right click one, so that's not the one we'll have after.

I think there's a nav.

Let's see.

Drop down menu, components, tabs.

We want tabs, we want.

We just want a list of menu items.

Drop down menu.

Scroll area separator.

Could use that.

Let's go take a look back at the playground, I think.

It's always good to do that.

OK, so playground.

We've got some sort of menu up here that could be useful.

Let's have a look at the playground.

Like I said, the themes all set up like that.

Really cool little side note here.

You can see on the right hand side we've got a whole theme builder in this playground.

We can literally copy that theme, apply that to our theme provider and then we'll be set to go.

It would look the same as what we're doing in here.

So where was those?

There's the tabs.

There's the links there.

Let's see if we can find it.

Separator, slider, tabs, text area, text field, tooltip.

They just use buttons.

Can I use these badges?

Let's see what they actually are.

Product link.

Product link container.

Maybe we will have to put our own menu.

OK.

Always the fun part of working with any new project.

This is the first time I've used Radix UI.

I wanted to give it a try.

A bonus of that is you get to see me fumble around.

Just like you guys would if you hadn't used it as well.

So we've got the tabs there.

I'm not really a big fan of doing that for the tabs.

I want the actual menu structure to be something that's going to work.

It's going to work well on a mobile.

I don't think we need a context menu like that.

I don't think that's really going to be helpful.

And I'm not a big fan of that.

Maybe if we're more sort of app-based, rather than an LMS, maybe I would use that.

I think we could just have a selection of menu items.

OK.

We may actually end up having to use some of the Existings.

And we can take a look at the parameters here.

So the other thing we've also got available to us is the ability to take these parameters.

And we can use these as well.

We'll take a quick look at what's in here.

Switch back.

OK.

It's going to take a break for a few minutes.

And then we'll come back and we'll start deciding how we're going to make our menu.

OK.

Thank you.

Thank you.

I'm back.

Okay, I'm back.

Okay, so we've got some examples here.

I'm quite a fan of these sort of links here.

I don't believe that they're using anything that's out of the ordinary.

So we could just create our own ones like that.

It's not a silly idea.

Let's take a look at them further.

Aren't they being built with anything special in mind there?

Okay, so we've got inactive state.

Link there, we've got here to product link inner.

So it looks like we've just got some custom styling here anyway.

We have the looks of it.

And not something that's already available there, which is fine.

We can use that.

So our buttons, like so.

Something like that.

It's a button.

I wonder if it's a context menu.

So it's like a trigger one.

The drop down menu is more, again, it's a button like so.

We could just have them as buttons.

That's one way we could do it.

We just probably want them.

Let's just links I think.

Text field, text area, tabs.

Yeah, I think I'm going to create them with a similar look as what we are used to.

Does it have any advice on that in the documentation?

That's a good question.

Add the theme components, start building, customizing your theme, using the theme panel.

So called this radius there.

I think we can actually get a lot of these custom CSS properties.

Radix exposes themes, all tokens as CSS custom properties.

So this is the Radix way where we can take what's already part of that themeing structure.

And we can actually incorporate it into our own custom styles, which is pretty cool.

We're going to apply a theme to this project using Radix.

Radix is UI themes.

And then what we can do from there is we can take these tokens and actually apply them across our CSS.

So for a comprehensive list of all available tokens, see their respective source files.

So say like in the case of our radius.

No, not so much.

Think about it maybe in terms of our color.

OK.

So this is all the theme colors here.

So with that, we would have a color of amber.

These are all the tokens.

We go back to the help.

Let's see.

So they got T file font size.

So if we grab this, that's the modifying of it, but we'd be able to see all the tokens like that.

OK, so we can use these for our project.

So we've got font size one.

We've got weight, bold, default font family.

It's a whole lot there is accessible to us.

We can grab these as the CSS variables that they are.

And we can apply it to our own styling.

So let's give it actually a try just to test that out.

If we take a look at some of the colors there.

Radix colors, tomato.

So you see, this is the color called tomato.

Let's put the end here.

Search for it.

Let's say, tomato.

That's CSS.

It has not come up with the one I was expecting.

I'm not saying that.

That's weird.

Get Radix UI themes, components, helpers, styles, tokens, color.

Here we go.

OK, so all these are embedded in here.

Let's give an example of a component.

Token reference, CSS custom properties.

We've got the box layout there.

That's so cool.

It's got these surface colors.

Grab this.

Go into our code.

Go into the header module that says this file.

What I'm going to do is I'm going to replace that token.

It's variable.

OK.

Let's go have a look at our storybook now.

Did that impact on it?

No, it did not.

OK.

Let's see what actually came out.

Yeah, it doesn't.

Didn't actually even get that color.

Maybe that's not being exposed at the top level.

Does the contrast background and text.

Focus selection, color scheme.

OK, so it was for the X into the loan.

Let's try that.

Maybe this one's exposed.

Good question.

Why would it be?

By default, we would have to actually do that.

OK.

What are we at?

We are at an hour and a half.

And I'm running out of time.

So what we can do next time we come back to the project, we can further explore how we can get, I guess, the Radix UI theming into our storybook.

Because at the moment, it doesn't actually seem like we're actually getting, we are getting our custom styles from the modules, but we're not getting our custom styles from the Radix UI because we're not embedding anything.

So a quick way we could quickly test that maybe is add a button.

But we have run out of time, unfortunately.

So next time what I'll do is configure using the Radix UI buttons.

We'll test the theming and structure out.

But have a play yourself.

Storybook's really good for doing this building of components in isolation.

It's got some great testing tools.

It's also got some accessibility tools built in as well.

Have a check of those.

Some of those are really great.

And of course you can have all your properties based on, if you want to have like we had before, we had the primary button and the non-primary button by setting that boolean value.

Then it was going to show that color, the accent color on our buttons.

Cool stuff.

So next time, like I said, we'll get that Radix UI set up and we'll go through and make sure that it's working and continue on with our header component.

Alright, thank you for watching.

Please remember to like and subscribe.

And if you want, you can ring the bell.

You'll get notified when I do come online again.

Have a great day and I will catch you all later.

Bye.

_Please note this transcript was edited for clarity._
