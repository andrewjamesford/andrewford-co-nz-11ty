---
title: Build a Full-Stack web app with Next.js - Part 2 - Set Up
date: "2023-09-18T00:00:01Z"
template: post
draft: false
slug: "build-a-full-stack-next-js-set-up"
category: article
tags:
  - nextjs
  - fullstack
  - react
  - setup
  - javascript
  - youtube
  - lms
description: This is the second video in the series on building a full-stack web app with Next.js. In this live stream, Andrew Ford set up Next.js, configured it for the project, installed Radix UI, created a Superbase database, and started adding routes. The project code is available on GitHub as LMS NextJS.
ogimage: "full-stack2.jpg"
---

{% figure "./full-stack2.jpg", "&quot;A web full-stack app built with NextJS&quot; / Bing Image Creator" %}

The following is a transcript of my live stream on YouTube Sep 18, 2023 on Building a Full-Stack web app with Next.js. This is the second video in the series where I set up Next.js and configure it for these streams. This transcript has been lightly edited for length and clarity.

The project is available on [GitHub as LMS NextJS](https://github.com/andrewjamesford/lms-nextjs).

youtube.com/embed/2BQcCGCsql0?si=-ucJrgg1Wn3ZpHvc

---

How's the stream now?

[ Pause ] All right, cool.

Okay, it looks like we're all live.

Hello everyone.

So again, this is the second part in the Builder Fill Stack Next.

js app.

Last week on Thursday, we did a planning session.

And so I went through how I was going to plan the app, go through things like a wire framing.

So we have a link for that here.

And we've also got the mind map, which was here.

Okay, so we've got the brainstorm here.

It was what we went over on Thursday.

And we also have the actual, not the code yet.

That's what we haven't got.

So I've got all this information, what we did on Thursday, that is now available on my website, so on andrewford.co.nz, it's the first article on the list at the moment.

It's built with fullstack and NextJS, part one planning.

So if you look at that, there is the link to the video, link to the wireframes, screenshot of the whiteboarding and there's a whole transcript there of the entire video.

So if you want to quickly find something you can do so.

Awesome!

Okay, all right what are we going to do today?

Today we are going to start setting up the initial parts of the app.

Okay so I'm going to go through that whole process of installing the actual code on a local machine, setting it up in a GitHub repo, pushing that to public so that you guys can see it.

And then I'm also going to try and start the part of actually building the app, start looking at the wireframe there and start getting that working.

Okay cool okay so if we go to the docs for Next.js

so on the Next.js org website forward slash docs there is a usually what's for pretty much every single website you can imagine these are getting started page and getting started page is generally what we want to look at in in terms of actually installing all the prerequisites there and actually get it up and running.

So first of all, number one, you're going to need Node.js 16.

14 or later and pretty wide range here.

You've got macOS, Windows or Linux.

Okay, I'm going to open up a terminal window.

Let me see.

OK.

So in my developer directory I'm going to go into YouTube.

Cool.

OK, so I'm going to create a new project here.

Again, we need to look at that MPX command.

So let's grab that.

Come back to terminal here and this is going to install the latest version of create next.

So what is your project named?

We're going to call it LMS next.js.

OK, we're not going to use TypeScript.

I'll do that another time.

We are going to use lint, use lint, node of tailwind, estimate source directory, yesterday app router, node to the import alias.

So this is going to set up the over code needed there for React, React-DOM, Next, DSLint, and Excellent Config Next.

Funnily enough it says those things in the Installing Dependencies part there.

So, okay, cool.

Let's have a look at this directory now.

If we go into the LMS folder, okay, cool.

Think about it, it's already set up a Git repo folder there.

I'm going to open up this folder now.

So open full stop or period depending on where you live.

So open there is going to open up the finder.

Cool so we can see the actual files themselves.

Cool and we can do code.

fullstop and that is going to open up a nice vision of VS Code already pointing at that directory.

Cool.

Okay so I've got that up and running.

You should be able to see that on the screen.

What I'm going to do next is start talking about what other dependencies we needed.

So going back to the whiteboard here.

So I talked about the need to have Radix UI.

So I was going to use that for my UI components.

way I'm not building them from scratch sort of thing.

Instead I can actually just worry about the other parts of the app rather than the actual UI components because I know that these components have been tested, they've got really good accessibility.

Instead I can just focus on I guess the back end parts of the app and not have to worry too much about the front end.

The other part that I'm going to need is of course Superbase and so we'll set that up as well.

Okay so let's go to the Radix UI website.

Okay again it's a nice big getting started button let's use that.

Again, I'm going to copy that and I am going to open up the terminal window here.

Okay.

So while that's installing, let's go back and have a look at the getting started guide here.

After that, I need to import the global CSS file at the root of your application.

Then I need to add the theme component and add theme to your application, wrapping the root component inside of body.

OK, cool, grab that.

OK, so that's installed.

And it'll go into the source directory.

And in here, we actually have the actual layer of the app.

Okay, let's have a quick look at this, get our head around what's actually happening.

So first up we have a page.

It's a home component and we also have an image being pulled into it.

So this is the actual content of that page and the layout would be the core part of the app is being built.

You can see there that we have the HTML tags and of course the body there.

So what I'm going to do is I'm going to import the style sheet.

And then after that I am going to then go back to the docs help file and I'm going to do the import process here.

So I'm going to import the theme.

Okay, and then I'm going to wrap my app just like it has shown here in a theme component.

And I can move it like so.

Okay, cool.

Body theme.

Okay, I might actually do the same as what they have done.

Probably pays to pay attention to what the instructions are doing.

Okay and I've got an extra tag there.

Cool.

All right.

Okay so we have the theme going now.

If we actually run the application, let's see what happens.

That's localhost 3000.

Okay, so we're not seeing any sort of UI changes or anything like that.

We've probably still got the initial stylings there from Next.js.

Let's go with the Alumnares.

Okay.

Cool, so the title's changed so we know that something's happening and that's tab and we can start pulling apart I guess what's already in there.

I'm just going to rip it all out to this global style sheet and probably not going to use that.

Again it's starting to look very sparse and And if I do the same here, I'm going to have to be mindful of the fact that there's expecting those styles that are coming from that CSS module.

So I'm just going to pull that all out.

Why not?

Let's make it home.

Cool.

stripped out, all completely pulled apart but we know that let's just double check that our CSS files that are coming in.

We can see here we've got a whole lot of CSS variables.

So these are the ones that are coming in from the likes of RadixUI.

We've got whole different color suites here, all available to us.

Awesome.

All right, can we see that they have like a.

It's just telling us where the CSS is coming from.

Got some default values here.

All right, and then we've got radix themes.

Okay, we are on the way to getting there.

Okay, all right.

Next steps, you're now ready to use Radix themes components.

Cool.

I will probably stop there and a good place to stop probably is now into a commit of my source code.

and it should commit added vertex UI.

So if you've got the GitHub extension here, you can actually also do the same as this and publish it live.

Awesome, so if I open this now, I should be able to see that in Chrome.

There we go and it's public so you guys should be able to see that as well.

Awesome.

Okay next steps.

Like I said we talked about we needed Next.

js setup, we needed Radix UI setup.

The next probably part what we need is start talking thinking about our database.

Okay it's pretty early on I know but it's good to get this up and running so we can actually start sort of planning out more of our app.

Okay so let's find the Superbase website.

Cool, so I've already previously signed on with GitHub before, and I need to now create a new project.

OK, I'll call it LMS.

and copy that password and place that somewhere where I'm not gonna lose it okay All right, OK, my password is saved now.

Region.

Not the closest to me.

I might do Oceania Sydney there because that is closest to me.

OK, I'm going to create that new project.

All right.

OK, so I've got public key there.

Okay, so it's safe to use in a browser.

I'm not going to show you the secret one there.

And we've got the URL there for the restful endpoint for creating and managing your database.

Awesome.

Same as usual.

This thing to do, open the docs again.

And we'll click on the getting started here.

Now it's got a quite big overview of some use cases and how you could use it.

We're actually going to be using it with Next.

js and they do actually have a Next.

js section which is a framework quick start.

Very handy.

So we've created that new project.

After it's done we should be able to see a table.

Okay now we're not going to make a country's table.

We're going to go and start off maybe with our.

probably course, I think it might be a good one to start with.

And then we will then have to add this super base off there.

Okay so we can use either like this command line here where we can add the template and have a look at that to grab each piece we need.

Or we can just actually manually add it into our project.

So if we take a look at this, I can actually copy this, I'm going to create this on the terminal.

This doesn't seem to be a link directly to the actual project there, unfortunately.

Not a problem.

We'll sort that out, that's it.

Okay and hopefully, yes our database is all set up and running now.

Okay so we've got the database there so if we click on the table editor, you can see we've got learning new tables and we need to actually go and set it up with the likes of Superbase.

Now does this actually have a nice walkthrough for.

Just adding it to an existing project, that's what I want to do.

Okay so here's an example here, so we need to install the Superbase.

js file here.

I'm going to double check this so that it matches what's the expected VF for next.

js.

I'm going to copy that and I'm going to jump back to the terminal.

Create a new tab.

Move back a level.

Again, this is pretty much what we've already done previously.

Probably in hindsight would have been better to have done this using this template, but that's not a problem.

I'll show you how you can actually still understand what is actually happening.

Let's make that text a little bit bigger.

I'll put hard sound stream there.

Okay, cool.

So that's completed.

Now in that directory, I'm going to open a never version of code.

we're going to have to take a look at it.

The key part here is we can see that what's has been added to it.

You can see those dependencies.

So the great thing about any sort of node's JSP package, so whether it be using YARN or PNPM or NPM like we're using here, you can see what actual packages have been installed.

So dependencies of course are the the ones that we use in our actual app and dev dependencies are the ones we use when we are working on our project in a dev environment.

Okay so I need both superbase of the auth and I'm going to need the superbase of the JS there.

Okay so all of us is breaking, let's go and do that again.

Okay so, control A, npm install.

There we go.

Okay so that's a bit of update from our package.

Nice enough.

We've got the auth helpers there and we can do the npm install.

Let's grab the other one.

from here.

Alright so now that's running, we've got the superbase js file there, we've got the auth helper for nextjs.

What we've got is basically a roadmap of what we require.

If we take a look at the actual project for the one that was generated from the template there, nicely enough it's got an environment file.

I'm going to copy that and place that into our project as well.

Because we're going to need something like this but we are going to drop the example part from there.

Now big thing to look out for, it's a little bit harder to see, I don't know if the colour contrast is quite good but you can probably see that there's a whole lot of folders there on the left.

We've got the public, the source, the app etc.

You can see at the top we have a .

next folder and a node_modules folder.

Now that no modules file was slightly off grey, off white sort of colour.

That means that it's being ignored.

So if we look at our git tab here, you can see that only the two pages there, it's showing.

I'm going to refresh that.

OK.

And luckily enough, it looks like our environment local file is also on this list for git ignore.

Now if it wasn't, you'd have to go into edit and to here, and you would have to hide that environment file.

But we don't have to.

Thankfully, we have the KIT-Ignore has already got that local nv file that's not been committed to our source code.

And why do we not want to commit to our source code?

Well, because we basically would be given the keys away to the house.

If we push that up there, especially this repo is public, you can be sure that there'll be a whole lot of people who are running scripts hitting GitHub and basically looking for projects that have API keys that are available to steal.

So don't let that happen to you.

There are some nice features now in GitHub which can actually look out for you and make sure that those keys don't go into your repo.

But yeah, there's just a Top tip there, making sure that you're not giving away the keys to the house.

Okay cool, so that's working.

We've got that environment, local file.

I'll update this later and we'll never look at it again.

So what I'll do is I'll grab my keys that I need for that and then I'll be able to see what's happening there.

Okay, right.

[pause] [laughs] Okay.

So we've got the Superbase parts pasted into our app.

We've got them sitting in the package there.

So we'll have those node modules now installed.

Okay.

So what's next?

Let's look at what has actually been done.

Okay, so great thing it's already been set up for us.

We actually have some components there so we can take these and the same with that super base directory.

We can grab those and put them into our own app.

That way, I'm having the same sort of setup as what's already there.

We're going to have a little bit of issues, and the key thing there that will be a bit of a pain will be the fact that this is in TypeScript, and we're not using TypeScript, so we will have some renaming today.

Okay, I'm going to go and set up the same folder structure basically.

I've got source app and I'm going to have a source components.

Like that.

Okay, and we are going to need We already have an app folder, a super based folder.

Okay, I actually don't want any of this to do some stuff, so this is actually not a bad thing anyway to not have this already pre-configured.

I'm just gonna leave that out, not have any migrations there.

We'll do that later and what I do want to do, let's look at these components here.

We'll start off with the logout button.

I'm not too worried about the other two.

Okay so this one is a JavaScript file.

And looking at this we can see, you know, it's relatively basic here, I can see it's using Tailwind but we're not using that.

Very export, default, I call it Lockout button, good to have the same name there and we're going to return just keep it as simple as that if we want to.

I probably might be using one of these buttons but that's okay we will grab that form and we'll put that button inside it.

Now one thing that's going to be slightly different of course is that we are using the Radix UI so there'll be a button component already available for that, but I will change that shortly.

Okay so I've got my logo button, what next do we need to add to our app?

So again they've got the layouts, they've got very simple page.

Okay so they are setting up a server base and they're getting a user.

Okay so basically doing a check there to see if they are logged in.

Okay, not a problem.

Okay, so that's all good.

We'll do that shortly.

They also have a logon, and so they've got a page here, so this is a logon page, and they also have the off components here.

So we've got sign up, sign out, sign in.

So there's these routes.

Okay so these will act as the next response there.

So if we make a request to any of these URLs then we get the different redirects someplace.

Okay cool, I should be able to just actually.

Okay it's gonna do there, that's it.

Okay so I'm gonna need that um 'Off' folder.

That's sitting under the app.

Okay and we'll start setting up these folders.

"Sign Up", "sign out", "sign in".

And the iPhone 1 was callback.

Okay, so that's all going to be part of our app.

As well as Okay, and the Alpha 1 was callback.

I'm going to have focus.

Okay, so that's all going to be part of our app as part of the authentication side of things.

Okay let's start off with the sign up.

What can we copy?

Mostly the same.

Okay I'm just going to copy this and I know that's going to complain but it's fine.

Copy that.

New file, make it our route file, then we can paste it in.

So the only thing we're having a issue here with here is this.

We don't have this request object.

Request type, sorry.

Okay, but we can have it like that and pretty much shouldn't complain.

Yep, that's the only difference there by having it in TypeScript or not.

Okay, so that's all cool.

Same again.

Okay.

So what are we doing?

What are we actually doing here?

We're actually making all the different app calls here So great thing about Next.

js is that it's both a front-end and back-end in WAM So we don't have to create a separate Express app or something of a like to act as our API And again Same as before.

It's generally good to at least get to a known point.

So slowly, I've just read it here.

So what we're trying to do is we're trying to get to a point where just like the super based data that people be able to just start the communication side of things.

Like I said before, in the previous session we need this app to both be available, parts of it to be available on the public and parts of it available on private only.

So I logged in users.

Okay so we'll then sign in, again grab this.

Remove that request.

Okay and the callback.

Okay, call back, set.

Again, another route.

Okay, anything else that I am going to need I've got my routes, I've got my page.

So they have a logon page which I don't have.

So it's got some messages here.

Again, pretty simple, could probably just copy that and rename it.

Again, just change the file extension and I can do the same with the logon except I I am going to strip that out for a sec.

So we'll copy that again, paste it, rename it.

Okay.

Alright, link on the logo there, don't worry about that, probably not.

Just keep the back there.

Of course I don't have any of these classes, I'm not using Tailwind.

And we'll just leave the form in there for the time being, take out some of these classes.

I'll sort these out with the red X1s in a sec.

Okay, looking a lot better.

Okay so that's not going to be so bloated I guess before Taiwan classes.

Okay so that's the login and sign up and sign out.

Probably a good point now to check in what we've added.

So I'm going to add the Superbase Event.

That's enough probably.

Okay, I'll commit that, push it.

OK.

I'm not going too bad for time.

OK, so we've got that there.

We've got the actual page there.

We've got what else we need.

They've got a middle here.

So we can do the same because we'll probably need to have some sort of middle here for authentication.

So I'm going to add that little sitting in, let's see, then sitting outside the app itself.

And sitting in that top level.

Okay.

We don't need a type.

Okay, okay and what other parts have we not configured?

Let's compare these.

So they've got the experimental zero actions on there.

Add those back in.

Middleware.

That's the Superbase folder.

We should be able to generate that from the CLI I believe.

And we've got the LogoutButton.

xjs logo, it's a base logo.

Nice.

Cool.

I've added those files back in.

Now I'm going to actually make this project a dev container.

So we'll come at the changes here.

Like so.

Okay so let's push.

Okay now I've got that set up.

If you watch my stream a couple of days ago I went over how we could set up a dev container.

So I'm going to add that now.

I'm going to need Docker running.

So if I didn't have that running before I should have it shortly.

Okay so that's running.

Now I need to actually run this in a dev container.

Add that configuration file.

And we'll just use the default for now.

Let's just add it and we should be able to now reopen this in a container.

So the reason I'm adding it to Container is the version of Node.

I've got it on.

I'm trying to use 20.

Slightly experimental, all the latest.

So the idea being that if I need to change, I can set my different version of node based on this dev container here.

I can swap it out for something else.

It just means that in sort of future proofing.

Okay, so that's running, and we'll run that to super.

Localhost 3000.

Okay cool, it's running again.

That's what we wanted to see.

Okay so that's running, you can see there it's made their requests.

That's all good.

So I've still got the app, I've got the page, so this is the home and its layout is sitting under here.

Just wrapping that theme.

OK so we can have a login component.

So if we try to go through that, let's give it a shot.

We should be able to go to login.

OK so we've got a, not particularly pretty looking form, but that's there.

OK, so we've got that working.

And we've got our login.

Let's keep going.

OK.

So the key thing that we would need with anything that we're working on, of course, is our URL and the key there, so this has two keys.

I'm just going to go back to the home, go into the project settings, and go to project, come to previous so we need the project URL.

and paste that in in the non-public.

Okay, so I'm probably to stop and start this for it's tick effect.

So I've got some friendly faces in the chat there.

Okay, got those keys added, added them to that local config.

These are not my secret keys.

This is purely for safety use in browser if you have enabled early level security for your tables and configured policies.

So this is the one we would set up all our configuration there.

So that we would then have it secure.

We haven't set up any VC yet.

It's all early days.

Of course I'll be changing these out at some point.

OK, so we've got a table editor.

What else do we need?

We're going to need to set that up and create a new table.

Let's go back to our whiteboard session.

What have we got here?

So I said we've got a student.

We've also got a course.

Course is probably the core table there.

So I'm going to create that table first.

of course.

If I spelt it correctly.

Okay, so I'm going to enable row level security.

We're not worried about it being real time.

I need a column of a name.

So this is a some text here.

And I'm also going to edit description.

Okay, what have we done here?

This is the Superface Editor, so it's a great way to run a Postgres database in the cloud.

And it allows me to just add a record there like so.

I've got no active RSL policies at the present that will add those as needed.

Insert a row to begin with.

That's automatic.

That we'll just use now.

OK.

First course is going to be on CSS.

So why not?

CSS description.

And now I've got my first table, awesome.

Okay, so I've got our homepage.

Got a table set up, we've got all the authentication done there.

We're on our way to actually building our app out.

Okay, so what are we gonna do next?

We've got our attics installed, we've got super base now installed, we've got a table set up in the cloud, We've got a get repo now of our project.

So that's now publicly available.

So you guys can see that as well.

And I'm just gonna add this div container now, and push that live.

[silence] Okay, that's pushed to local file, it's sync up.

Alright, so now we have this project.

We've got I guess the core parts of it that we initially needed set up.

We've got a dev container that can go with it.

We've got our Radix UI installed.

We've got the Superbase Auth helper here, the Superbase JS file, which is what we will used to retrieve the data from Superbase.

We've got ESLint, we've got ESLint config next, so it's a lint configuration for Next.js.

We've got Next itself, so next version 13.

React DOM, React, the other thing that I would like to add to this is prettier.

So I'm going to stop this and add that to the project.

Okay I gently use prettier and ESLint together.

One for formatting and one for finding errors.

Okay so let's install there.

Okay that's done like that.

That's installed and do I have the extension?

Okay so I'm going to install those in the dev container.

So I've got 'pretty' here, I can add 's-lint', I can sort of get it added.

Cool.

Awesome.

Okay so those are both added there.

Again more changes, pretty as installed.

Add to my config, package config, package.

json added prettier.

And the other thing that I don't properly want to do, make sure I've got those extensions installed, now they're going to be part of this container, they're part of this user interface.

So we've got those there.

The other last thing I can do when we're starting up the project.

It's always nice to have a MPM install.

So this is going to start the project up when it first makes those dev containers and it is going to install all the node modules.

So I have that rebuild.

Just saving the next person that has to probably open the project or ourselves.

Another thing to do basically of installing npm packages.

Okay cool, I think I'm going to stop here today.

So we've got sort of like the basics there of the project.

It's all been configured, It's been set up.

We've grabbed a lot of parts from the existing template there for the likes of Next.js with Superbase And we've also set up our Superbase table Until next time we will do actually get the authentication running and We will try and get some data showing on the page coming from our database Hope you all enjoyed that Please like and subscribe if you haven't already That makes it easier to you know Not to keep doing more of these videos if I get the feedback there from you guys Please comment as well if you've got any questions And I'll try to answer those two All right.

Have a great day and I will see you next time.

Catch you later.

_Please note this transcript was edited for clarity._
