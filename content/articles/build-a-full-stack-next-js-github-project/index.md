---
title: Build a Full-Stack web app with Next.js - Part 5 - GitHub Project
date: "2023-10-14T16:56:10Z"
template: post
draft: false
slug: "build-a-full-stack-next-js-github-project"
category: article
tags:
  - github
  - nextjs
  - react
  - project
  - kanban
  - component
description: "In this tutorial video we continue planning our full-stack web app with Next.js. We create a GitHub project and start adding tickets to the project. We also start building out the first components for the project."
ogimage: "full-stack5.jpg"
---

{% figure "./full-stack-5.jpeg", "&quot;A web full-stack app built with NextJS&quot; / Bing Image Creator" %}

The following is a transcript of my live stream on Oct 13, 2023 on Building a Full-Stack web app with Next.js. This is part 5 of the series. In it we start further planning and using a kanban board to track our progress. To do this we use GitHub projects and generate a board and create some issues/tickets to build. We also start building out the components for the project.

The project is available on [GitHub as LMS NextJS](https://github.com/andrewjamesford/lms-nextjs).

The GitHub project board is available on [GitHub as @andrewjamesford's LMS Project](https://github.com/users/andrewjamesford/projects/4).

youtube.com/embed/UUDUUrG-LDw?si=NC3-gYFDnArwXzC7

---

All right.

Okay.

So, Andrew here again.

I'm going to go over a little bit of what we did last night and continue on with the actual planning of what we're actually going to build.

Okay.

So, if you watched the stream last night, you would have seen I had an entity relationship diagram.

Okay.

So, just going to pause the monitoring for a sec.

Okay.

Cool.

All right.

Okay.

So, what do we got here?

We have our table structure.

So, we've got all the database here, our courses, our courses section, courses media, courses comments, students and students progress.

Okay.

We went into the SQL editor for Superbase and we ran the query that was generated from the ERD diagram tool, DB diagram.

io.

We ran that and now we have some tables.

Let's pull that up.

Okay.

So, you guys can see that.

Okay.

So, you got courses, courses comments, courses media, courses section, students, students progress.

Okay.

If we go into each of these, I'm probably going to have to do a little bit of editing.

So, we've got the courses.

We've got the values here.

Make sure we make it an identity on these.

So, we're going to go through, update these tables, make sure they've got the, I guess, the Superbase specific things.

Let's make that correct.

I'll show you that.

Cool.

The one downside, I guess, of writing the SQL separate.

And again, it's identity.

I think I felt these are all not available.

We can change this later, of course.

Okay.

All right.

So, that's there.

So, as you can probably see, we're starting to get into, I guess, the, not quite the coding stage yet, but we're pretty much at this point now.

We are ready to show things off.

So, we can do that by waiting for that to save.

Okay.

Let's make sure my work's in the right position now.

That's better.

Okay.

So, we've got the courses section.

I'm going to edit that.

Come in here.

How's identity?

We'll go through this.

For those that watched the video last night or want to catch up, there actually is an SQL that's been added to the project.

So, you'll be able to go into the description and you should be able to see the link to the GitHub repo.

In this SQL folder, there should be the latest update from dbdiagram.io, which has the actual SQL that we used to create these tables.

You can do the same or not.

You can jump in and you can also manually make these.

There's no right or wrong way.

It's just a good way of being able to visualize it before you get going.

And last, let's add that ID.

Okay.

So, this one.

This one, we don't need to actually have the ID yet because this is just a linking table.

I'm not going to leave that as is, which is cool.

All right.

Let's pull up GitHub.

So, with the project, we've done a lot of, I guess, putting stuff together just so that we can actually start getting started.

I know it's quite scary, isn't it, when the fact that we are on the fifth video in the series and we're really only just getting to the point where we can start sort of actually thinking about doing the code itself.

And that's the same with any project.

Anything that has a lot of complications to it or anything like that, it's actually really important that you do a little bit of planning.

Okay.

So, we've got that there.

Okay.

So, in GitHub, you actually have some project management tools and they're tucked away in the project section here.

And by default, there is nothing, no project created yet.

But we can create a new project for this.

Click on the button.

Okay.

And I'm going to call this LMS.

Project.

I'm going to use the table, probably board view.

That's what I prefer, a Kanban board.

Okay.

So, we create that.

Okay.

And we've got a basic sort of Kanban board structure there that we can now use for our project.

I'm going to do, I've got another one to do.

Okay.

And we've got the LMS there.

Okay.

So, now it's got this project actually attached against it, which is great.

So, we'd be able to easily see that that's attached.

And we've got three columns here.

We're going to do a hidden progress and a done.

Now, I don't know about you, but I like to actually start sort of thinking about what I'm going to build first, how I'm going to build it, what are the things that I need to do.

And then I just end up with a big to do list.

I'm going to make one more column here.

So, we've got a to do and progress.

That'll make it backlog.

Yeah, I'll make it backlog.

Why am I making a backlog?

This is like things that I may want to build, but I haven't actually decided yet if I'm really going to go through with it.

So, I'm going to make a backlog and I'm going to move that to be in the front here.

Ideas are things to build.

Okay.

So, backlog, whatever I want to think about, I could add to the project.

I can add that to the backlog.

But when I am actually pretty sure that that's actually what I would do, want to build, I'll add it to the to do list.

Sort of like a way to have a big long list of things that maybe we'll get around to do.

So, that's all good.

Okay.

So, we've got a backlog there.

So, I don't need to write anything about that.

We have created the tables that we require.

And let's step back to, I guess, thinking about the project as sort of an MVP.

So, what do we have?

We have at the moment, we don't have a lot actually.

Let's run that so that everyone can see that.

I'm going to run up the dev on the container and I'll load it in the browser.

Okay.

Not a lot there at the moment.

A homepage and very basic structure.

We've got, I guess, the basics of our project here using XJS.

And it's loading in some CSS at the moment.

We've got a few HTML tags.

Of course, the route where the actual React app is being implemented.

And that's looking cool.

Okay.

So, for the next part, in the project itself, we had a router.

Okay.

And in that router, we had a courses page.

Let's see if that's still working actually.

This courses.

What's the route?

Let's see if that works.

Okay.

So, I've got my data.

It doesn't look like it'll be breaking, which is probably a good thing.

But it's not loading anything because we've got no data there.

That's fine.

We'll get to that in a sec.

Thinking about the actual project in its entirety.

What are the key things, I guess, that anything, any sort of project needs?

In a lot of time, it'll be something, you know, the basics.

So we've created a database that we can use in our project.

We've got the foundations, I guess, for the actual React app itself.

So that's using Next.js.

We're going to be using the Radix UI elements in this project.

So we've got a, I guess, a bit of a shortcut there and how we can actually see those.

We're also going to have a, I guess, a way to actually manage the users.

So we're going to have students sign up, of course, and they're going to have to have some way to do that.

So coming in, back to the Kanban board, we can look at it.

And a pretty common thing that you probably need is a sign up page.

Okay, we need a login page.

Okay, what else are we going to need?

We're going to sign up, we're going to log in, essentially a forgot password.

Thinking about all the sort of permutations of what's actually going to be required there.

Sign up page, login page, forgot password, what else are we going to need?

Anything else we can think of?

Top of my head.

I think that should be fine.

We could make a new password.

I should actually be calling these routes rather than pages.

So that we can route the user where they are needed rather than.

Okay, so we can edit the title.

Yeah, forgot password route.

So these are not the components themselves.

This is what I'm thinking of in terms of the routing, in terms of the XJS.

Because we need a way to get to the components that we're going to be seeing.

And we need to be able to actually navigate that, of course, from a URL.

And why do we do this?

Well, there's a couple of good things.

Why we actually set up all these routes and the like.

So a good thing about any sort of website, it's a really good idea to think about all the routes in terms of your HTML is something that you can actually pass off to another application.

The great thing about links is you can embed them in, say, a message, or you can embed them in an email.

When a user clicks on those, the user would be redirected to that part on the website.

And it's better than, I guess, having stage controlling all the different routes.

Instead, we can use the URL, which is something that stays the same in this, in the actual sort of URL bar in a browser, and take advantage of that to hold our state of where the actual user has navigated to.

And that's probably a key thing about websites is that they have this inbuilt state there, this really clever process of the URL.

Very simplistic, but really powerful when you think about what you can do with a URL in terms of being able to direct someone to do something.

We can look at the URL that we've got here for the GitHub project.

And we can see it's got, of course, the domain to get to the site.

The users, so it's got the Andrew James 4 there, that's my GitHub username.

It's got projects, it's got a number 4, so that's obviously the project number 4 that's been created.

And you've even got like a view there, it's got like an identifier of one, and it's actually even got some parameters there.

So before we change some of these, we may actually, let's see what happens to our state.

We should get some changes.

Yeah, so now we don't see the actual issue itself.

Once we click on it, we can see the issue, we can see the item ID.

If I click on to some of these others, of course the ID changes.

So very powerful, I think, a URL.

It's probably something we don't think about a lot, but it's really important to think about it in terms of you'd be able to send someone an email to say, hey, you forgot your password.

So when you go for that whole process of a forgot password route, then we can actually get them to go to the direct form that they need to go to, maybe to reset that password.

And it's all at all at really important parts of building web applications.

Okay, so we've got a signup page, I've got a logon page route, I've got a forgot password route, I've got a new password route.

So these are the actual routes themselves.

So there's a little bit of boilerplates we need to do for that in terms of with the Next.js documentation.

So previously we had, of course, the page folder, so you have the folder name.

So you can have like a signup route folder name.

And in that route, you could have the page.

js file, which would actually be, I guess, the routing page to it.

And then you could, of course, load components after that with the likes of React.

Okay, so I've got these routes here, I've got the project.

So we should be able to, let's quickly switch to that.

Okay, you should be able to see the project itself.

Okay, so this is my last sort of changes I did from last night around the ERD diagram.

So I've got a link there to dbdiagram.io and the markdown file.

And I've got a link to the extensions and a little bit of help here, where this is all located, a link to the playlist, etc.

So that's still being updated.

The project's running at the moment, you can see I've got it running under a dev container for my project.

So I've got a docker running and the actual project is running like so.

Now let's go to the courses folder.

So with this, I've got a page.

js.

And in here, I've got a basically the courses heading, some way of getting the data and putting that onto the page.

So like again, talking about the routes there.

So in the case of a sign up or sign out, we were going to have to do all those kind of steps.

And we're likely enough to have a login page, I believe already.

Okay, so we've got this pre-configured.

I believe this is from the template.

Okay.

And we've also got, you can see there, you've got some form actions.

So we've got the, I guess the behind the scenes, the sign up, the sign out.

So you've got all this logic here in terms of the API and the actual project already as part of the boilerplate.

Okay, and we've got a sign in.

Cool.

Okay, so we've got a login already.

Let's check that.

Let's actually have a look at that in the actual browser itself.

It's always paged actually, get a sort of lay of land.

What actually is happening?

Okay.

Nice.

Okay, so they've got, they've actually got the same page for the login, sign in and sign up, which is actually not a bad place.

I'm probably going to want some extra details going by what we had for the students table.

So we will need the email.

We will need their password, but we will also need the likes of their first name and last name, just to personalize parts of the actual application itself.

So we can do that.

And so if I tried to sign in now, it's got some basic validation there on the actual code.

Sorry, you probably can't see that.

So I'll switch to that.

My problem is here.

Glad you're enjoying it.

Of course, you can always catch up on the streams anyway.

Okay.

So we've got the signup page.

You guys can see that.

Okay, that's a bit better.

Much easier to see now.

Okay.

Typical.

My chat started to not work.

That's okay.

I might just open that another window.

It might be easier.

Okay.

Really important.

Cool.

Okay, so we've got the login form.

So we should be able to see that, like I said before, sign in, sign up.

Basics of what we need.

Let's check what the back button does.

Cool.

That's just going to go back to the history, which is not bad at all.

Cool.

Okay.

So a lot of that is kind of done for us.

I'm going to probably change that.

That's okay.

We can change this later.

I'm still going to keep these login page out and I'm going to also keep the signup page out.

I'm a big fan of actually having separate routes for each of those.

And that's okay.

We'll leave it as like that for now.

So we will need that sort of signup route.

Okay.

And let's go to the.

I guess what are the next things we need?

Well, going by our project, you can see it's very, very basic.

We don't have to go, we've got any sort of elements as such here.

We've literally got a main here.

We've got a title and that's about it.

So there's nothing really that we can sort of see in our sort of design here.

Now did we, let's go back to the project itself.

In the case of earlier on, we did do some designing.

So where is that?

Let's find it.

Okay.

Open up this project.

Not easy to find.

I'm going to go and actually I'll just have a quick look through my channel.

I believe I actually added it onto one of the videos of course.

I've created transcripts for all my videos.

So let's go back and actually have a look at it.

So we had the LMS with this basic design here.

I don't believe that we do any.

There we go.

Wireframes are here.

Perfect.

Awesome.

Okay.

So going back to our design, it's very very simplistic.

We've got our sign up form and we've already started to actually change, I guess, some of these pages.

Sign up here with course overview.

It's looking cool.

This is a great thing of why you document things.

I could just quickly go back to my transcript there and grab that link.

That's there.

Able for you guys to be able to jump through and have a look at it as well.

Okay.

Cool.

So got the course detail.

So overview.

We've got the sign up and login.

Okay.

We have done it very much the same.

Okay.

It's a good thing to go back to our designs here.

This is the problem, I guess, of going over something that I haven't come back to in a couple of weeks, which is all good.

Okay.

So we've got the LinkedIn there, Microsoft, Google, etc.

Blah blah blah.

Okay.

So we've got that there.

Thinking about it in terms of like basic structure.

We're going to need a header and that header we're going to need a logo and that header we're going to need a menu.

So a nav bar of some sort.

And we're also going to need a footer.

Okay.

So let's actually start making those into some more tickets.

Again, so I'm going to make a header component like so.

And in that I'm going to have a logo title.

Got some quickly be back in a sec.

Okay.

Now, since you're getting into a very very specific category, you're going to want to start with the same category.

You're going to want to start with a different category.

Now, you're going to want to start with the same category.

So, you're going to want to start with the same category.

Okay, it's going to have a Nav component.

We're also going to need something that's probably pretty common to what most people want in any project is a footer and like so.

What else we need?

Foot and Nav.

Might just rename this one.

I'm calling it a header.

Awesome.

Okay, so we've got a header, footer, foot navigation.

Okay, so a lot of it I guess is the planning stages and a good place probably to start is this login page route.

What I can do, we're going to need a header anyway.

Going back to Excalidraw and our designs here.

So, we've got the header following the user all the way through from the links of the homepage, the signup page, login page, course overview, course detail.

So, again, this is a component that we're going to use throughout the actual application.

So, it's a good place probably to start with that login page because then we can actually then start showing the user to be signed in.

There'll probably be some sort of way to show the user that they are logged in or not.

Maybe to get to settings that they want to have for their specific user.

Do they want a light mode or dark mode or something like that?

We can do something like that.

That's all stuff to think about in the future and so we don't forget about it.

I'm just going to add a, just like you've got here, you can see in the avatar, we've got the avatar.

We can do an avatar component and that's just to show that when someone's logged in they know who they're logged in as and it's obvious to the user.

Okay, so sitting in my backlog, it's not sitting in the do, that means it's not, it doesn't mean that I'm not going to do it, it just means that I'm not going to do it right now.

Okay.

So, we can start off with two things.

We could start off with creating the route, which is fine for the login, that, but I think it'll probably even go, even back a step and just go maybe focus on that header component.

Okay, I think that's probably a really good place to start, you know, at the top of the page and with that header component, it's going to require to have that logo title component and the header nav component.

We'll leave the avatar for the time being, but that way at least we have something to do it.

Now I've done something that I probably shouldn't have done.

The idea of a backlog as well is to be able to fill in all the description that you're going to add to the tickets.

So, I might just move these back for the time being and we'll start off with just the header component there.

Okay, so what is it?

We want to give it a decent description here.

Okay, let's see if we can get a little edit.

Okay, we've got some markdown.

Okay, a React header component contains header components like logo and navigation.

We'll show on every page.

Okay, so this needs to be able to be seen everywhere.

We also need it to, going back looking at our Scala drawer here, we need it to be responsive.

So, the other things it's going to require is that responsive design, mobile, tablet and desktop.

Cool.

What else do we need?

We've got the responsive design, we'll show on every page and web app, responsive design, mobile, tablet, desktop, a React header component contains header components like logo and navigation can be themed.

So, we don't forget about that.

So we add some color to it or something like that, but we need to be able to make it so we can do that.

We'll look at that, I guess, with the Radix UI libraries for it.

And what else could we add here?

That's going to help us build this.

That's all we've got so far.

That's okay.

We can update that comment.

Let's just make this into a list.

Again, we've got the power of mark down here.

So, we can do that.

It can be themed.

Okay, so we've got the Radix UI there.

We'll add that to the logo, but I was going to add, say, the logo needs to be able to have a link, I guess, to the actual main URL of the page.

But we'll add that to the actual logo itself.

Likewise, for the navigation, there'll be a home link.

We'll show you our new page on the web app.

What else do we need to think about?

I think that's pretty much it.

I'm going to update that comment.

Okay, so it's in the tutorial here.

Like so.

By default, these items are just drafts.

So we can actually do the conversion there to an issue.

The great thing about that is it's now going to allow us to attach it to a project.

Okay, so we've got project name, LMS next.

js, and we've got a number one there.

So this is our first ticket.

Oftentimes, there might be a component.

It could be a configuration set up.

It could be something else like that.

It could be a range of things.

But at this point, I'm just going to leave it at that for a header component.

Okay, let's go and take a look at, instead, the structure of the project.

So I'll switch to that.

Okay, so now let's have a look.

Okay, so we've got a few pages.

I'm going to close all these just to keep it clear.

Now, I've got a components folder.

I've got a logout button.

But that's about it for the time being.

So we can actually add, I guess, our header components to here.

It's going to make a new file.

And I'm just going to call it header.

Okay.

Next.

js, React and React.

I hit HTML tag.

So I'll view the chat.

Okay.

So we've got our own folder.

And I'm going to do that.

It's just like my little junior developer.

Okay, so I've got a nice little function here.

I can copy that.

It's probably a little bit hard to see with my face in the way.

Let's make it a little bit bigger.

But basically, what it's doing, I just quickly chatted to to copilot there.

It's going to make sort of the basics there of what I need for the project.

And like so, I'm not sure I actually need to do that.

I don't like this function layout.

I can probably do it more like this one here.

We've got the export default.

It's probably a little bit tidier.

Okay.

And we can get rid of that now.

Awesome.

It didn't quite do what I wanted.

It's got just a div for that.

I want an actual semantic HTML tag for that.

So I'm going to use the actual header tag and replace that div.

And we've got the start of our here.

Okay.

Looks like I'm about to run out of time.

Let's sort of take stock of where we're at.

Okay.

So what have we done today?

We started planning.

So we've actually started to plan what we're actually going to build.

So going back to the project, we've now got a Kanban board underway.

We are now in progress.

So let's move that ticket to there.

And we've got that header component is underway.

I've started to create that Js file.

And it's got just basically the header in it.

And we need to basically continue from there.

But we will come back in another time.

So please like and subscribe to my channel.

It gives me an indication of the people liking this and people want to keep following along.

Please share with any friends that are wanting to code as well.

It's hopefully beneficial to everyone to watch these videos.

And it's going to be helpful in getting that sort of mindset of how to build an app.

Okay.

So thank you again for your time.

And I will see you next time.

Bye.

Thank you.

_Please note this transcript was edited for clarity._
