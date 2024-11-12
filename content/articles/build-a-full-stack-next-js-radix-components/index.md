---
title: Build a Full-Stack web app with Next.js - Part 7 - Radix Components
date: "2023-12-24T01:25:43Z"
template: post
draft: false
slug: "build-a-full-stack-next-js-radix-components"
category: article
tags:
  - reactjs
  - nextjs
  - component
  - javascript
  - radix
  - radix-ui
description: "In this article, we will continue building a full-stack web app with Next.js. We will be using Radix UI components to build our components in isolation using Storybook."
ogimage: "lego-r.jpg"
---

{% figure "./lego-r.jpg", "&quot;Working with Radix components&quot; / Bing Image Creator" %}

The following is a transcript of my live stream on Dec 3rd 2023 on Building a Full-Stack web app with Next.js. This is part 7 of the series. I am continuing a project with an LMS (Learning Management System) using the Storybook.js, Superbase, and Radix UI. So far, I have set up a header component and am working on building other components in isolation using the storybook. The LMS project is in its early stages with a homepage set up and another page for listing data. The Superbase database is connected, with a few tables for courses and students. The next step is to work with Radix components.

The project is available on [GitHub as LMS NextJS](https://github.com/andrewjamesford/lms-nextjs).

Check out the [documentation on Radix UI](https://www.Radix-ui.com) components for more information.

youtube.com/embed/EXvU7F1D59o?si=8kM1Zl-k5_MIjtDG

---

All right, hi there.

I'm back.

It's been a while, I know.

So I'm going to be back continuing this project with our LMS using the storybook.js, Superbase, and Radix UI.

So just to recap of where we got to, we have a component here.

Okay, so we got our header component.

Basically, that's all we've got set up at the moment in our project.

We're trying to build our components in isolation using the storybook.

And in storybook, we will flesh out all our components that we can use, but in that sort of the layout, the stuff that's going to be reused as much as possible.

So that includes things like the buttons, the header, photo, et cetera, that kind of stuff.

Nothing that's real, I guess, layout specific.

Okay, so what have we done so far with the LMS?

Not a lot.

We've got a homepage.

I think we've got one other page where we're listing out some data.

We've got Superbase connected up to it.

We've got a couple of tables.

We've got courses.

We've got students and some supplementary tables around those too.

Okay, so if you haven't been keeping up, might pay to have a look at the project.

I'm just going to paste that into the chat.

Okay, so that should come up shortly.

And if not, it should be part of the description as well.

What I'm going to do next is try and get some of these Radix components, wrap them in our own layers so that we can manipulate them how we would like to use them, and try and get those set up and ready.

So let's jump into Chrome and I can show you that.

Okay, so that's the project there.

We've got the LMS, just the actual dev environment there, localhost 3000.

So not much to see there.

We've got some next one component that I'm going to make.

I'm going to make a button and I'm going to give it the options to have a icon as well.

So I'll set that up shortly.

We've got our wireframes.

So we've got our homepage there, sign up, course overview, course detail.

Okay, so that's all we've got so far.

We've got a storybook and we've got Superbase.

Cool, okay.

Let's get started.

We'll start off with this button.

Easy way to get started is I'm literally going to copy this example code and I'm going to place that into our project.

Let's switch to code.

Okay, so I'm going to create a new component and this is going to be button.

I'm going to keep it generic like so.

And we need to actually import that from the Redex UI.

Now I don't know what that is off the top of my head.

I'm just going to grab that from the website, view the source.

I want to import from Redex here.

I believe it's button.

Redex UI themes there.

Cool, let's come up.

Awesome, and we'll import the icons as well.

Actually we won't.

We want to make that a property that we can add to the component so that the person using that component can easily style as necessary.

Okay, we're going to make this a button.

I'm just going to prefix all my components so it's obvious which ones are pre-built and which ones are my own.

And I'm going to move this up until I return there.

Okay.

Return like that.

What help if I may have used the right brackets there?

Okay, so I'm going to drop out this component here.

Now we'll make that an input.

So this could be the icon.

So we're going to need a title and an icon like so.

Okay, so it's super basic.

We're taking a title and we're taking the icon.

Icon can be provided, which is awesome.

We need to actually have a story for that so that we can actually display that.

So I'm going to grab the header one to get started.

There's a boilerplate.

Just remember I've got my alien mess button in front of it.

I don't know what I've done wrong already.

I did not name this correctly.

Okay.

Keep forgetting it's the other way around.

So that's the component itself.

There is this is the name that's going to be there and the both the URL and in our storybook.

Let's check.

Looks like storybooks has built.

Let's switch back to Chrome.

Okay, let's go to our storybook.

Refresh this.

Okay, now we can see we've got an LMS button there.

We've got a problem.

That's okay.

We'll figure that in a sec.

So it's missing a default export there.

So probably on my component itself, I'm missing that default export.

Let's go back to Chrome.

Sorry, to VS Code.

Okay, so I've got my default there.

Like so.

Okay, switch back to Chrome.

Refresh that.

Objects not valid as a React child object with keys.

Objects are not valid for child key if you're meant to render collection of children using array instead.

I'm not getting any errors here.

So what do we got?

We've got our title.

We've got our icon.

We've got our button.

That should be fine.

Do we need to have this wrapped in some braces?

That's where I went wrong.

Okay, so back on Chrome.

We can see I've got a button there.

It's got my title at the moment.

So I can actually add some parameters to this in a sec.

You can see that there is a button.

It's not very looking very nice.

We need to install the providers here for the UI.

Okay, so we've got the button there.

We've got the title.

And our default arguments here.

We can give the title.

I can give a default one now.

Let's just keep that for now.

So back to.

There we go.

That's the button.

Is the code.

We've got that default value on there.

Okay, so if you're showing the code, what do we see there?

We've got the elements button and we've got a title.

So we can update this on the fly.

This is the real reason we want to use something like Storybook.

Because we can do this as we change it.

Then we get that sort of real time view there.

So we get that actually looking like it's supposed to.

Okay.

Next steps.

Okay, so we've got that working.

It seems I've got some problems with my audio here.

No, it's not tweaking.

Sorry.

I had the mic.

I had an off screen so I couldn't see that.

Bump that up so I can see really important.

Be able to hear me.

Okay, so we've got the elements button there.

We've got the here.

Okay, let's keep going.

So this button is going to need more than that.

And it's at the moment, it's not actually getting these Radix themes coming back through.

We look at what is in the actual documentation here.

We can see we've actually got quite a few more properties and stuff that we can add to it, which will do in a sec.

But the problem is we're not able to see the fact that it's getting the styling there from the theme.

Okay, so what are we missing here?

Let's find out.

Let's go back into the code.

Sorry.

So if we're looking at this, this is the button.

See here as child size variant will pull this very sick, shortly, and we've got the code here.

So let's jump to that.

Now, why is it not getting our theming?

What's wrong?

Okay, so we look at the app itself.

We've got a page layout.

Okay, so we're not even getting that.

So we we lay out here now it could be because we're missing this theme part of Radix UI themes in our components here.

So let's actually test that we can test that by grabbing the Radix UI themes here.

I'm just going to grab this initially and see if it's just a CSS.

It's not that we'll also add the theme as well.

Okay, switch back to Chrome.

Sorry.

It's not just that we're going to have to also have the theme in there, I guess, as well.

So let's go into code again.

And we also that was on the page was not always a layout layout.

I need the theme need to put this in our story rather than.

And here.

Okay, so the theme.

And we can just wrap this component like so.

See if this works.

We're going to have to make a wrapper of some sort.

Okay, so expected a string.

Okay, so we can't get away with that.

We're going to have to look at how we can do that to our store a box so that we can actually get those values in there.

Let's undo that.

It's a little bit trickier.

We can test our theme styling potentially by placing it into the layout here.

Actually, I'll do it into the page because we've got the home there.

Let's put our button in the title.

Cool.

So it's fine once it's in the actual application when it's wrapped in that theme.

Let's try and do the same with our storybook.

A couple of ways we might maybe we can do that we can actually have a look to see if they're using storybook and the project or Radix.

That might be able to help us.

So you've got a playground here.

So that just wraps that there.

Okay, so the provider.

Okay, so we can't use that.

Like we're not the only ones that have had the same issue.

What a day time.

No, styling at all.

Okay, that's looking like what we need.

We can add a theme provider.

Okay.

Awesome.

Okay, let's go back to the top here.

First of all, we are on Starbucks seven I believe.

Let's double check that.

Yes, 7.

Okay, so let's go back to code.

Stop the storybook.

Continue with the idea here.

Go to the alternative.

This is not yarn.

Okay, so let's edit that to our storybook.

Now we need to go and update.

So we've added that we've got once installed, open your storybook main.js file and add the storybook.

Add the storybook add on styling and the add owns array.

Got stories.

Let's open up our code again.

Now we're set the configuration file.

Some dots to report mean.

Okay, so add owns there.

Back in our code here, we've got our add on styling now.

And save that.

Okay.

Come back to Chrome.

Okay, so we've added our add on there.

We need to provide global styles next.

If your global styles are defined in CSS files, you can import your style sheets in the storybook preview.js file.

Storybook load any files imported here on every story render.

That sounds like us.

So let's look for this dot storybook preview dot JS.

And we'll just sneak ahead.

Here we go.

So we could wrap this potentially in our theme provider.

Okay, so what I'm going to do.

Grab that line.

And I'll grab the next one.

Hey, let's go back to code.

Preview.

Okay.

So we want to import the theme for red X.

Oh, that's going to put the theme there.

We probably will have to import the CSS.

But let's stop that.

And now let's let's look at what's next in our preview.

So there was a need for decorators.

So do we have any decorators?

No, we don't have any decorators.

And to put this theme here.

Hey.

Okay, so we we've actually got quite some culture controls here.

We've actually got the ability here to see the background color, which is fine for now.

We just leave it like that.

We've set up this theme provider.

So hopefully that will work.

Let's run our storybook again.

So far so good.

Let's switch back to Chrome.

We've got a storybook here.

Refresh.

With theme from J6 provider.

So probably have to pull that in from storybook itself.

Would it be under blocks?

Let's see if that.

Got our theme from J6 provider.

That's still not working.

Okay.

Okay.

Okay, so what do we need?

What are we missing?

Got the Radix theme there.

Got this decorators.

Do we actually have to supply that?

Actions, controls.

Decorators.

We did it wrong.

It's still potentially just edit under here.

Okay.

Okay.

Hmm.

Okay.

Got a react tab.

Got some HTML.

Got the storybook being pulled in.

We've got a source here.

So we've got the app.

We're using, this is using style components.

This is not.

Does not seem to be using.

What I expected it to be.

That's no good.

Okay, so let's look into.

Let's get back to this.

Ah, here we go.

This is probably where I've gone wrong.

Okay.

It's tricky when you're trying to learn something new.

Okay, let's get back up to the top here.

What do we got?

We're getting the theme.

Okay, from the red X UI.

We're not getting the theme provided from the right component.

What that should be is with theme provider should be embraces starters.

And this comes from instead add on.

That's that styling there.

There we go.

Okay, nice.

Okay, so done that.

We've got our decorators down here.

We've got our global styles.

So this is what we should be pulling in for our CSS.

Now we've got that happening in our layout, I believe.

Yes.

So let's pull that in and turn to our story.

Sorry, wrong one again.

It's our config for storybook, which is our main.

js.

Right.

So, sorry, getting it all wrong.

Okay.

Maybe I have to make it a constant.

Okay, let's make that work.

So take that base style.

Pipe that into the global styles.

Okay, and then we can add our themes.

That same component.

Okay, so we've got that theme.

We're pulling that into our story here.

And we've also got the themes there.

We've also got.

We don't actually need this.

We can just use the actual provider.

And that is our theme.

We're just going to use the default one.

And let's get rid of that.

Okay, so decorators with theme provider from JSX provider global styles face.

Let's go back to our storybook.

Okay, so what are we doing wrong now?

With theme provider is not a function.

We need these decorators like so.

It's not part of the parameter object ahead.

So we're not going to do the themes.

We are going to do the provider, which is our theme up there.

And we get to our base style.

Still having problems with us.

Search for this theme provider.

Okay, so we're going to be using it with Radix UI.

We can find an example.

So that one says it's missing.

It's talking about start compliance.

It doesn't just work.

Okay.

Provider theme.

Add-on styling.

Global styles is the base.

We're just dropping the theme there.

Let's see if that actually helps.

Okay, so it's not liking this one, but.

Let's see if it's affected.

Oh wow.

Okay, so it's really broken stuff.

Sometimes it pays just to comment stuff out to get it going.

Make sure that it is working properly.

Okay, this is looking a bit better.

Okay, so we still got a problem there.

Let's have a quick look at what that actually is looking like.

So it has got some classes on it, but none of them are being pulled in from the Radix UI.

Okay.

Let's try and add that in.

Okay, so as soon as we do that, it's not working without the theme provider.

Okay, still not working.

We added the theme provider in and still not working.

Storybook add-on styling is not a function.

Let's look for that.

Okay, so we're going to add a new feature.

We're going to add a new feature.

We're going to add a new feature.

We're going to add a new feature.

Okay, so we're going to add a new feature.

We're going to add a new feature.

We're going to add a new feature.

We're going to add a new feature.

Okay, let's see if this example.

Okay, we can't see that.

Okay.

The older styling here.

There's no storybook.

js.

It's old.

Let's go and look at our issues here.

Hmm.

With theme by class name from storybook add-on themes, but I believe this issue might be with all theme functions.

I'm using with themes by class name.

That's something similar.

It's quite common when you're searching for sort of open source projects.

Sometimes it's easier just to go to the issue.

Looks like this is another issue that someone else has about three days ago.

Let's see if ours is any different to then.

This is from add-on themes.

Let's just make sure that we've got it correctly.

Maybe it's looking like it's different.

Oh, this looks better.

Module not found.

Okay, so not that one place possibly.

We have to go into the documentation here.

Again, this is with style components, which are not really.

Yeah, this one's got with add-on styling.

So this is what we had previously.

Okay, sort of a style and deprecated in favor of the functionality that you're looking for.

However, was neither intended for a native storybook.

Okay, so still meant to be that.

Okay.

Let's go find the documentation.

Okay, search.

Okay, global theming.

That's not what I want.

That's a dark and light theme.

What about.

That's completely not what I want.

Okay, let's get on here.

Testing snapshot, testing interaction, testing, T-Sarana sharing design integrations.

Okay, so we're looking at.

Okay.

Okay, so we're going to go ahead.

We can have a preview body.

Maybe this is what we actually need.

Let's try that.

I'm going to review all these previews.

So I've got a couple of.

Changes that I've made.

We'll leave those there for now and we'll add on.

Once we get the theme working with the preview body.

That way, when we do this, we can do a.

Let's just put a div.

The class name.

I work.

Worked just like that.

Okay.

Stop that.

Previews being reverted.

Now there.

All right, that's that and code.

So you guys can see.

So I've added this preview body.

And a class name.

Back to Chrome.

That's cool.

That doesn't seem to be showing.

It's not in the HTML.

Let's find out more about this preview body.

The story rendering.

The storybook will inject these tags into the preview iframe where your components rendered not the storybook application you are.

Thank you.

Thank you.

Thank you.

[ Pause ] Storybook preview body.

Let's copy the example.

I wonder if we can find an example project as well.

[ Pause ] Hi!

This is a video that I will be taking a look at.

So, I'm going to go ahead and look at the storybooks that are available to have a look at.

Fortunately, no red X.

Right, and see if that comes up.

No.

Okay.

So, I'm going to go ahead and do a little bit of a look at the storybook.

So, I'm going to go ahead and look at the storybook.

Take a look, hold on.

And I'm going to go ahead and do a little bit of a look at the storybook.

Now, I'm not sure if Chakra's got a theme provider.

It's kind of cool though.

We can have our storybook theme too.

Alright, let's go back to another project.

Sometimes the best way to understand how something should work is literally to take a look at what is currently being done with other projects.

Okay, let's go ahead and look at the storybook.

Okay.

That's a little rapid.

Yeah.

This looks pretty complex.

Okay.

This is looking like it could be a winner.

Okay.

We didn't actually check to see if the customer route was actually taking effect.

Let's see, it still doesn't look like it's working.

We've got a default view there.

Look at the storybook class.

We've got a storybook route.

That is our button.

Okay, so it is updating.

Okay.

Let's try this as well.

Okay.

Is there a body?

Review.

What is that?

ReviewBody.js.

Review.

And it's just kind of pull off.

It's like.

We've got the radio there, we've got the matches, we've got the controls.

Let me try something like Add a preview here.

And let's just go something pretty crazy out there.

Completely.

Let me stop that.

Something like that more.

Is where I'm going wrong.

It should be.

That's frustrating.

When you read the docs, read the docs.

Back to Chrome here.

We've got HTML.

Still no joy.

I'm just going to start and stop it.

Refresh.

Hey, we've got a customer out.

We haven't got our stuff appearing there inside it.

We've got some way that we can wrap it around.

It's not going to be much fun though because it's.

It's just going to embed it as HTML.

Back to.

Okay, so it's got JavaScript, TypeScript.

So they're all done.

The rendering is there.

We've got our style.

We also need a way to get that layout working.

That's just the layout in terms of how we can see it.

We want to be able to wrap just like we've got our.

Sort of code here in the.

Down here in the page.

And the page has.

Page that's inside layout.

And layout has the.

Root layout and it also has the theme component.

Okay, so that theme component is what is provided from Radix UI.

And that's going to give all our coloring based on that.

We can add an option to this theme provider and of course change our colors across the board.

We need to get that into our storybook so that we can actually get that same theme in coming across.

Always it's going to be a bit useless.

So let's try and.

Go back to my Chrome here.

And in it I've got.

So story layout is how it's actually positioned on the page.

Which we will use.

I think we should put the buttons on the center there.

That would be great.

It would make sense to do that.

I'm actually going to do it just now.

Let's do it anyway.

It's going to be better.

So in our preview.js we'll copy that.

Back up here.

In our preview.js.

In our preview parameters.

And we've got layout.

One we want to update.

Okay, I think I'm centered.

Like that.

Okay, so we go back to our storybook.

I'm not having much joy with this.

I check my spelling because that could be what's wrong.

Okay, I might have to stop and start storybook potentially.

Okay, so storybooks.

Starting there.

Wow, nothing's working today.

Might be time to just pack it in and start again next time.

Oh, this is going terribly.

Nothing is seeming to work.

Let's go look at a basic version of that preview.js.

Okay, so we're going to do a quick preview.

We're going to do a quick preview.

Maybe preview body I wonder if this is because it's requiring it to sit over there and preview head.

Let's go back to our component here I'm going to go to our customer.

I added that 1, 2, 3 to it.

Let's stop it and start it again that's stored what that is okay so it's getting that let's go back to the storybook itself.

Does it actually render that?

It does okay so you could add some HTML around it but that's actually not really going to help us.

We want to be able to add the JavaScript theme component just like we do for the standard page and I'd like to do it at the top level rather than have to do it further down the chain in each storybook but it's looking like that's not going to be an easy thing to do.

So what can we do instead?

Now we can't have with this default here any parameters around it but let's have a look.

So this is the default in the story that's just the arguments. Ah!

Args can modify any aspect of your component.

You can use Args in your stories to configure the component's appearance similar to what you do in an application.

For example here's how you could use a photo argument to populate a child component.

This is going to import the page, have it as a child.

Okay this could actually be what we want.

The only downside is this is at that story level.

So we do have that render function.

Some components require a harnessed render and a use away.

For instance if a component runs right up to its edges you might want to space it inside Storybook.

Use a decorator to add spacing for all stories of the component.

Okay so with that example.

Apply story.

Story to enable it.

I'll take some locking.

Okay so this is on preview.js.

Back to where we started.

Theme provided there, theme default.

This is actually looking more like what we want.

Let's try this again.

Being a developer is probably 90% reading the documents.

Especially if you're using open source projects.

Just to be able to implement it in your own project.

Okay so this is my preview.

I'm just going to wipe this out.

Ah they don't have style components.

But what I do have is down in my layout.

I have Radix themes.

Okay so I want to wrap my theme.

Like so.

Let's see.

Let's see if it's getting that.

Interesting enough it's getting some styling.

It does look to be getting red xui themes.

Okay I think we get in there.

Go back to code.

Okay so we've got the preview.

Normally you'd load in the CSS.

We could just try that initially just like we've got in the layout here.

We're just sort of having a global sort of import here of our styles.

Okay let's save that.

Back to Chrome.

Okay so it's still not loading our style sheet.

We're getting on the red xui themes.

We're just not getting, you can see here we've got no styling coming into play here.

Whereas if we go back to our actual rendering of our LMS app.

We go on the button.

Open up the inspect tools.

Now we should have a whole lot of styles on the, when it loads.

I'm not sure why it's taking so long.

I have to stop the dev environment.

That should, click it off again.

There we go.

Cool so we can see that there with that button.

We've got all the layout CSS coming in.

Which is what we want to actually have happen.

That looks different to the docs.

Okay there's some weird there it's pulling in some css.

We don't want that, those are our parameters which we will do later.

We tried to do this before with your component files and put ccs, this will work too.

Notice all the exceptions for using a css processor like sass/scss or post css.

Let's try that again, it should be pulling in styles.

We're in preview, we have the theme, the story, the style sheet, and no issues.

Let's see if we're getting that style sheet coming.

It's not looking good, let's have a look under ccs.

We're not getting a style sheet, though it looks like we are.

We might have to look into what red x is doing.

It looks like we have a style sheet coming in there.

I'm just going to comment out the css that is being passed in.

We should probably be able to refresh that now and take a look at that component.

We're still getting the style sheet so there must be four coming from what's called a storybook.

If it's coming from storybook, why are we not getting our style sheet?

Maybe it's because of the iframe that it's using.

We can have a link in our main to the javascript, like an example of the oven analytics.

Let's keep looking, we can add a preview html.

Let's switch back to code here.

It's not working, it's not as simple as that is it?

Stop and start storybook.

Let's see if we can open this up a bit wider to see our components.

We can always try and see if we can access it from the red x folder.

This is that style sheet here.

We're in storybook.

Module not found, what's interesting is that as soon as I do that, it's found.

That's something to do with the actual style sheet itself and that shouldn't matter.

It doesn't like that because it's in javascript.

Maybe if I do it in the preview head.

Preview compiled one error, what is that one here?

Let's get back to chrome.

This might be all the storybook stuff that hasn't loaded.

I'm going to stop and start storybook.

No matter what, we're not getting that style sheet in there.

Don't think preview head is javascript, let's get back to the docs preview.

That's our layout.

We've got a component.

Adding to the heat.

HTML, that's probably why.

Nice start-ups morning.

Let's go back in our browser.

Gone.

It's gone.

Okay, so we're gonna start with root.

We've got all the styling going on.

We have our, yes, we've got our Radix theme styling.

That's a good phone.

But we got now a button that's gone somewhere else completely.

Now it's weird that it's there.

We need to give it some space or something.

Property failure.

It's coming from iFrame.

It's there, but we can't see it.

Is it CSS?

No.

There's a reset going on, which is cool.

We might have that issue with storybook versus our styling.

It's there and we know it's got all the button.

Crazy.

Let's say look, is it visible none?

Just transparent?

Could actually just change the background color here.

Okay, but is transparent.

It is trying to load it there.

It is doing that.

Must be something else that's added when it's imported.

Hmm.

It's a lot of read and now it's CSS anyway.

Still complaining there.

Data is the right thing.

What's interesting is that these variables are on the right level.

A lot of issues here though.

Can't do that.

We always do have one option.

Let's try making our own component that's going to wrap.

We have the verpa there.

Like this.

So this way we could make a wrapper that we know is going to render.

That we know is going to have the style sheet loaded.

Okay, and we're just going to have to go into our story.

Look back at the storybook.

We've got the main up here.

We've got the preview.

Let's put wrapper here.

Now import.

Opponents.

Rapper.

Okay, so that's loading there.

We've got our wrapper component.

We want to move our story up to here.

And then we can hopefully do set out.

That's not a bad result, which is fine.

We'll have to go back a level.

What is it done?

That's weird.

Save that.

I'm not playing.

So we might have to actually stop and start this.

Well, that's no good.

Yes, that's working.

Okay, that's working.

Now we're getting out.

This is painful.

Preview here.

It's probably coming from that.

Let's remove that.

I'm not sure if it gets refreshed.

Yeah, I have to stop and start storybook.

Show cool.

Remove that.

Our wrapper is doing that.

The jazz style.

Let's just do it directly on the div.

Well, we are JSX land.

It's really brutal.

And I actually even have a style tag, a bit of into JSX.

I don't know if I can, but let's give it a try.

Not going to like that.

So we're battling with J6.

What about.

the end.

Okay.

Ah, so I'm just going to take the colors, but I don't just want the colors.

Okay.

Oh, my storybook.

Okay.

Okay so this did nothing in the end.

We can probably get rid of that.

Let's go back to our story.

I mean this does make it easier.

Um without the router there.

Let's try removing that.

We did need the theme.

Okay.

you OK, let's tidy this up now.

We've got the button showing.

Let's grab the same link.

Let's see it back in our VS Code so we can actually see it.

OK, that's looking better.

Remove that.

We now have a head.

Like so.

And we've got a preview body.

So we can ditch the preview body.

Get rid of that.

We can get rid of the wrapper.

Because we're not using that anymore.

OK, so now we should be able to go.

Look at that.

Look at that.

Got preview modules.

OK, let's stop and start Storybook because we just want to check it one more time.

It's not looking quite the same.

I think there's still some issue there for Starsheet.

It's not looking quite the same.

I think there's still some issue there for Starsheet.

What are these?

Ah, Storybook static.

Looks like I've got something to fix up.

I'm going to add this to my GetIgnore.

It's a common thing with the likes of any project.

OK, so now that's much better.

Ah, Storybook static's there.

The build was kicked off and that's hence why it did that.

I should probably do that every once in a while.

If you wanted to actually run that as a build process, maybe some artifacts or something like that, you want to part of your GitHub actions or something like that.

Ah, it's part of your CI.

You could do so.

OK, let's go back to here and let's make all these changes.

Play button component.

Styling.

All right, I'm going to sync those changes.

And I think I'm going to call it quits now.

We're at two hours and ten.

Hopefully that was helpful.

I know sometimes the battle is sometimes the thing that you want to watch.

Things don't always go right.

What you can expect will work doesn't.

So yeah, being able to do this kind of thing and just be determined.

Show your grit.

Work through your problems, try and get back to basics.

Try and prove that something is or not working.

That's how you can debug stuff.

And it's not always the help you get is perfect.

Sometimes you have to actually think about what is actually happening or what isn't happening and go through those sort of steps to actually try and figure out what is going wrong.

Now, it isn't something that you learn in like two seconds, but it is something that you learn over a career.

So what do you do if you have those issues?

Sometimes you just keep at it.

Sometimes you actually walk away from the keyboard because it's easier.

I come back to it and I'm sure you'll solve the problem in your head.

But otherwise, hopefully that was good.

Have a great weekend.

If you are watching this on the weekend, of course, this was livestream.

Have a look at the other videos in the series so you can see the last one or storybook where I set that up.

I'm going to continue.

Try and be a more regular cadence so that people can watch these sort of weekly or fortnightly.

And don't forget to please like and subscribe.

That helps me get to more people out there.

And hopefully you enjoyed it.

Catch you all later.

_Please note this transcript was edited for clarity._
