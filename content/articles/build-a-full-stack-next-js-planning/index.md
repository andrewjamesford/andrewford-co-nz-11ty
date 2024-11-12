---
title: Build a Full-Stack web app with Next.js - Part 1 - Planning
date: "2023-09-17T03:11:44Z"
template: post
draft: false
slug: "build-a-full-stack-next-js-planning"
category: article
tags:
  - nextjs
  - fullstack
  - react
  - planning
  - youtube
  - lms
description: This is a transcript of my stream that went through the initial planning stages of a Next.js project, starting with brainstorming ideas on a virtual whiteboard. Wireframes were then created in Excalidraw to visualize pages like home, sign up, course listings, and course details. Key requirements around authentication, data storage, roles and permissions were mapped out. Superbase was selected to provide authentication via LinkedIn/Google login as well as for it being a Postgres database. Next.js was chosen for its React framework and Radix UI was selected for accessible, customizable UI components to speed up development.
ogimage: "full-stack1.jpg"
---

{% figure "./full-stack1.jpg", "&quot;A web full-stack app built with NextJS&quot; / Bing Image Creator" %}

The following is a transcript of my live stream on YouTube Sep 14, 2023 on Dev Containers in VS Code. This transcript has been lightly edited for length and clarity. In this stream I went over the planning stages of a project. First on a virtual whiteboard. I started with a brainstorm of ideas, then moved onto wireframes. Then circled back to start thinking about what features and functionality I would need to build the app. I also talked about the pros and cons of building a UI library from scratch or using something that is already pre-tested and available. Finally I went over the data structure and how I would store the data.

To view the Wireframes I created in the stream, please see the following link:
[Wireframes on Excalidraw](https://excalidraw.com/#json=almP8vw8UnTN7cR6Zk6Xf,aIx7EgfHxXwpKKnv6k3IbQ)

youtube.com/embed/4xhebsXoSn4?si=YdTF06KTLVE8xH24

{% figure "./whiteboard.png", "The Whiteboard from the Stream" %}

---

All right.

Alright, we are live, sorry for the delay.

Can you even hear me?

There's a few people watching on the stream.

Okay.

Alright, so what am I doing today?

I am going to build a full stack app with Next.js.

So I had a few ideas for projects, but something I guess that is kind of floating my boat is trying to build an LMS.

And an LMS, a learning management system, can have things like videos, code tutorials, documents.

There's a whole range of things.

And what the cool thing about it is there are parts of the app that will need to be public, and there will be parts that will need to be private.

You will also need some sort of login, and there will be some need for an admin of some sort as well.

So it's quite a big wide ranging project, and I know I'm not going to be able to do it all in one hour.

So it's going to be a constant stream of every couple of days I will try and chip away a little bit more in it.

So it should be quite fun.

And yeah, it should be exciting as well in terms of hopefully some of you may have used Next.js before, but this is version 13, I believe.

A few things have changed since I've last used it.

So I'll be learning a little bit as well as you guys.

So that's all good.

Cool.

Okay.

So before we even get started, I guess what am I going to do in terms of the actual planning stage I guess?

That's probably one of the first steps.

I'm going to jump to my screen.

There you go.

So sometimes best to when you're starting to think of ideas and how you're going to do something, it's best to sort of whiteboard it.

This is about as close as I can get to a whiteboard on a stream.

This is freeform.

So let's chuck in, I guess, the title.

What are we going to call it?

Going to be a LMS on Next.JS.

Let me know in the chat if anything is hard to read as well.

Because I want everyone to be able to see it.

Cool.

Okay, so a couple of things that we're going to need for an LMS.

We're of course going to need the project so that's a given.

But we're actually going to need like a couple of things in terms of planning and that sort of things.

So let's put some of those together.

We could have, I notice a circle here.

Okay.

Bring it to the front.

Okay and we're going to need probably some wireframes.

That's probably a good place to start.

We're going to need some way of storing the actual data that's going to be part of the LMS.

So let's do that.

So we want to determine how we store data.

Okay, um big thing, colour theme, really important.

We'll need that, colour theme.

Okay.

I guess Sort of be like I talked about before there will need to be some parts of it that are sort of sitting in the public and that can be indexed by Google and so we'll need public pages. This is just my big sort of my map of kind of how I'm gonna build it all. What else do we need we're gonna have logged in pages. Okay As soon as we say that we need to be logged in in some way We then we need to actually you know think about it in terms of what are we gonna use for authentication?

What's it gonna be?

What's the scope that can be made up of?

Do we build?

Do we use something that's off the shelf?

It's tricky.

Okay.

What else do we need?

Anyone else?

So many ideas.

The chat.

Do you think the communication we've got that some sort of data store?

We might need some sort of how the videos are managed.

So media.

How will that be handled?

I guess what else do I want to have in it?

What would be another good thing?

I guess with a lot of LMSs you're going to need some authentication.

You might need different types of permissions.

So we're going to need some way to manage roles.

So I could see there could be different types of users.

So you could be someone-- maybe a student could be one type of role, and another role could be an admin or a course content editor that could be in different roles we'd need.

Let's do that.

So what am I going to do for student?

I might just call it content editor.

Make it very generic.

What else could we have?

We've got public pages.

We've got logged in pages.

We've got authentication.

We've got our roles.

Students, content editor, it's a way to have some data stored, how we're gonna handle media.

A tutor for marking, yeah there could be another role with that a great one.

What would that be?

What would be a good name?

So it could be just Marker, I guess.

We'll keep it generic.

We can always change these later, of course.

Okay.

What How sort of people like to see in LMS?

How would the students maybe question something or how could they raise any issues?

Any ideas?

No.

I'm thinking maybe they could have comments, so they could actually like comment on the video to make it, I guess, a bit more interactive there with people that are administrating the course.

Plenty of LMSs of use in the past that they have some sort of comment system they could have a forum page.

Oh, we're starting to get feature group ready aren't we?

That's all good.

Well I think that the tricky part is in anything when you're doing this is the scoping is you know basically fine tuning it down to what are things that you need to get started and we'll go after that.

But I think pretty much a comments thing would be easy to, well a basic comment because this I've got to be careful with it.

Non-threaded comments would probably be fine, maybe on each sort of page that could work.

What else?

I've got Marker, I've got a Content Interact of Student, Communication.

Cool thing about authentication is it could be done in a couple of ways.

So in my head I'm thinking you could have just a traditional sort of email password, which is fine, absolutely, some people love it.

But we could also use a single sign-on, say like, authenticating with Google or LinkedIn, any of those sort of single sign-ons apps, that would be pretty good to be able to do that.

So I'll just leave it pretty blank at the moment, single sign on sounds like a good one.

Probably leaning towards I guess a bit more professional LinkedIn maybe, which means that we could maybe do some cool sort of badges or something like that when they've finished a course or something like that.

But yeah that's something to think about in the future.

Yeah so we can have these.

I think this is like probably the minimum I think that I'd like to launch with.

Yeah, it's looking pretty cool.

Okay.

I guess the tricky one I've kind of left off.

Come to it later I think after the wireframes.

This choosing maybe you know build a UI library from scratch or use something that's already pre-tested and available already.

It's those cons and pros of trying to do all this stuff.

Cool okay I'm just start now so now I've got sort of some brainstorming I guess of what I plan to do save it for starters I'll rename it, there we go RMS brainstorm cool Sorry there.

Wireframes.

I think that's where I'm gonna start.

going to help get that visual sort of idea of what I want to do for my design there.

I'm going to keep it pretty simple.

I'm going to use something else.

I could use this but I think I'll jump to Excalidraw just because it's nice and simple.

I always forget how you create a new one.

Reset the canvas, that's one.

Cool.

Alright, okay cool.

So well, for starters this is going to be a responsive web app.

So I'm going to build it with a mind that I'm going to have sort of mobile sized screens and tablets and of course desktops.

Make that look a bit narrower.

Let's do that for a tablet.

And of course the desktop.

Cool.

Any design I'm going to need to have, I guess, some sort of header or some sort of notification that the users can be able to navigate around.

So I'm just going to put something like this here.

Again these can be as rough as you want.

Sometimes having it low fidelity is great because it means that you're just going to not be limited kind of what going to be doing.

So that could be my nav up there.

Let's do, that's my logo for now.

And some sort of navigation.

I just put a text label for now.

I don't know if I put it as an icon or what.

Comic Sans.

Okay, that's the one thing I don't like about.

There we go, about a Excalidraw.

Okay, here.

Of course this is gonna have a bit more room for menu items.

Okay awesome.

Okay so I've got you know basic navigation logos sort of here area it's gonna be consistent across the different sized screens there but I'm gonna have to actually make up a whole of different pages.

So I'm just gonna put a label beside this this is gonna be it's gonna be the home.

That's the kind of landing page that's gonna be a page that I want people to come to and be able to know sort of what they're coming to a site about, what's it going to try and get them to sign up, get them to see what's on offer and be able to do a course.

So what I could do is I'd have some sort of maybe hero image here which would then entice people to want to be able to take a look.

So I'm just going to do like a common thing is images is of course to have a cross-line for it to denote an image and have some sort of call to action, maybe call to action button or something like that that's going to get people to sign up Just keep it really rough.

Ok, so that's on a mobile screen, front and centre, right in that first section as they come to the app they're going to see what's on offer, hopefully a nice visual image explaining what's on offer, getting them to sign up.

I'm going to want to do something similar for the tablet but I've got a little bit more room.

So what I could do rather than just have the one kind of image here.

Is it option or is it control?

I've got one there.

I could do maybe two side by side that would make use of the extra room there.

Let's see, let's set 50/50.

OK.

All right, OK, so we've got sort of two by side by side now.

We've got a button here.

Again, of course, call to action.

Trying to get people to sign up.

Maybe start a course.

some of the courses may be initially free.

I'm not quite sure yet.

I haven't quite figured that plan out but that's definitely could be on the roadmap.

And where's my selection tool?

There we go.

I copied that.

And for the next one I'm going to make it so that it is..

I'm going to get three across at the moment.

I might change my mind later.

But that's probably a good place to start.

There we go.

Cool.

Awesome.

Awesome okay so home page, um, thinking, thinking MVP here, so MVP is either minimum viable product which I don't quite like that much.

I prefer the minimum valuable product because the reality is people aren't going to use your stuff unless it's valuable to them.

So you want to make it not just viable, you want to make it so that people will actually want to sign up and pay money for it, so that's making it invaluable to them.

Okay, so we've got those through there, sign up.

I think the other thing I'll probably just put on for now is a footer, and I'll keep it pretty low key again, probably just some links I think in the bottom here.

Again, sort of placeholders, not really doing any fought to the content yet although I should at some point.

Cool.

I'm getting it in right click and.

Is it just vertically?

Right.

Right.

Two symbols.

I'll leave the line there.

Cool, cool.

Okay.

Imagine these would maybe be two columns on the tablet.

maybe two columns on the tablet maybe a third one down here.

And sort of getting that flow of content.

And of course with the mobile that's just going to stack.

like so.

Cool.

Okay, you know, starting to get things together, like what our home page would be.

I guess the next step, you know, we've got that call to action there.

What I could do instead, from the next step, I guess, would be to have maybe a sign-up page.

So let's do that.

One more.

While I've got these I'm just gonna grab the header and I'm gonna try and get this all rapidly put together I'm not missing my Okay and of course I'm going to use these multiple times so I should probably um duplicate this.

I'll not do what I've just done now which took forever.

Okay.

I don't care if this is a wonderful thing, when it copies properly.

Let's try that again.

I'll get everyone more.

Okay so I've got my home, I'm going to sign up process.

Generally I'm gonna have a multitude of things I guess for a sign up process and especially one with a single sign up.

So what I'll do is a form, something like this and I'm gonna have my label, I'm gonna use email and I use password, the first option.

And I'm gonna have options for.

That's the wrong way.

Something like that.

Hey Belinda, cool to have you on the stream.

Hopefully we'll get to next.

We might still be on the planning stages but that's okay.

It's a long process.

Okay.

Okay so I got my email address.

I got my password.

And I'm going to need a couple of buttons.

Feeling like LinkedIn.

LinkedIn, maybe.

Because this could be for a enterprise or work user as well, so.

They could have Microsoft and maybe.

Okay, well, that might be a good subset.

I'll single sign on.

Cool.

Okay, so thinking about it in terms of the users coming in, if they're looking on a mobile, well it probably would be nice to guess to have some more introduction sort of things.

Let's kind of just skip straight to the point on my mobile screen and try to get them to fill in their details there or hit one of these buttons and go through that process of using the single sign-on.

So what are we going to have different on a tablet?

So I should probably have my label here.

And I'll try and copy, I want to reuse it because I don't want to have to start completely from scratch.

I'm going to put that to the right and I think the ratio is quite right but the why to sign up.

So why would someone want to actually to do that have that there on the page so they come in on a bigger screen they'd see that but they'd also have course this on the mobile it's just that it's not going to be easily visible I guess above the fold there.

So we still have it, we just have it a bit lower down.

Make it a bit more square.

So desktop is next and again I can probably use a lot of what I've already got for the some tablet sort of size.

I can play around with my ratios a bit more.

I've got a bit more room to breathe.

Potential here to have a nice hero image.

What are the benefits, features or something like that.

Could be as an image or it could be as text.

Not quite sure yet.

Cool.

Okay.

Sign up.

That's done.

Of course when you have a sign up you're also going to need some sort of login.

I want to have this, the reason I've just not haven't done a lot on the sign up process is I don't want actually too much of a barrier there to get them first in the door.

Ideally as being a, I guess, a potential student user, try to collect the minimum amount of information as possible.

So maybe email, password, I can take them to a profile page later and they can fill in those kind of details.

So I'll just try and keep it super simple and the other cool thing about this is if I have it very simple like this I can actually reuse it.

I can use this for my login as well.

Sometimes we want to take some shortcuts.

Again this is a MVP but I'm trying to build.

It's not gonna be all singing and dancing yet but it's really good to try So try and be mindful of how you can sort of do things and not take too much time.

Okay so let's do that.

Sign up.

I guess probably the two most important pages of an LMS is going to be the actual, I guess like an overview page of what the course is.

And then secondly, the actual each detail.

So design a detail page for the course content there.

And that course content could be text, could be video, it could be PDFs to download, it could be potentially a survey or a questionnaire.

maybe some things to think about in the future.

But if we want to think about this in terms of, I guess, any VP side of things, probably the most common thing with an LMS would be my text, and maybe a video.

Having those two, I think, would be a good starting point.

So let's have one of these labels.

Sorry, what I'm gonna do, I'm gonna do what I call it.

Namely things is hard, really hard.

So we've got a course overview.

There we go.

Okay.

Start with that.

Course overview and if they're going to be able to see basically a list.

Key things that they're going to be wanting to be able to see of course is their progress so that they can come back to it later.

So this could be cross section and we're going to have to indicate in some way what they have and haven't done.

Thank you.

[ Pause ] I'm going to make it a little bit easier to see.

Alright.

Um, am I going to change it for the desktop and my bar, and the tablet, sorry?

Probably?

Yeah.

I guess we could just have more content to be honest.

We could have a bigger description.

So what I'm going to do is just stretch these out a little bit.

And I can do the same on the disk top and have some description of course or something.

I just realised I lost more than this.

Not again.

Might actually make this stick.

I might actually make this stacked.

I'll do the same.

Cool.

So, description.

like that, like that.

Like so, cool.

Probably what other two minimum screens I can need?

I need a the actual details itself of the actual course, so I'll need to represent that in some way so we've got some idea of what we're actually going to need.

So literally I could see it being, it will have the section title and then we'll have either text blocks or video.

Does this have scallops on?

No it doesn't.

Not particularly great but it'll help I guess get our understanding of what we're actually trying to do.

We're on top of the block I think it has to be a let's make it look like a block.

Yeah something like that.

Left align.

Cool.

Alright, so we've got our section, we'll probably have a video of some sort.

I'm just going to sort of represent it somewhere like this.

It doesn't have to be too great, it just has to look like something.

I'll recognise when I come back to it and go, what was that that I was trying to draw?

There you go.

And maybe another black text box underneath that.

And of course we talked about it before going back to my map.

I talked about comments.

So I will add comment block on the bottom.

I know someone like that maybe.

Very rough.

Okay.

I don't know if I'll actually do it anything different for the tablet.

Um.

And then again, for the desktop, I don't know if I'll do it that much different too.

Instead I'd probably just make use of the area to actually have a bigger area for viewing the video.

So let's do that.

This one needs to be in print.

I'll just use my crew drawing.

The number one thing with a wireframe is that you want it to be relatively quick to put together, and the second thing is that you want it to at least be recognisable so that when you show it to someone else they would actually hopefully understand what you're trying to do.

Okay, cool.

Cool.

Okay, so I've got a course overview.

This will be my course detail.

That weird some weird artifact there.

I was sure that was.

And I'm going to put this here.

Course detail.

Cool.

Okay.

Alright, okay, cool.

And so I've got those, I've got my layout, I've got my course detail, I've got my course overview.

Sign up page and slash login page and a home page.

I guess the next kind of, what is probably the minimum.

Again because I'm doing this as an MVP, it won't have all the nice admin that it plays yet.

This will be, initially we'll just have it so that it's in a format which I can edit it.

So it can be a bit more technical.

And if it's making some entries in a database tool, that's fine.

OK, alright.

OK, I'm happy with that.

I'm going to save that.

I always forget what to do.

Here we go, save.

I'm going to save it as a, I'm going to save it to disk.

I'll put it into my downloads.

These aren't of course finished, this is just getting to a point where I think we've got something to start with.

I bet you're all itching to sort of kick off the project and see how that goes.

Okay, a few more steps I've got to do along the way.

Coming back to our brainstorming.

So what could we have initially?

What I'm going to do is I'm just going to circle what I think I can actually, I guess, can get away with as doing for my MVP.

I'll just use that tool.

It's a bit big.

So I could get away with having just the role for a student potentially.

What else could I get away with?

I could potentially just have email password as your authentication and then add the single sign on later.

What else do?

What can I get away with?

Well, I've done the wireframes, I've done that.

We're not going to be escape this one to determine how we store data because that's pretty important.

View authentication, again that's going to be important.

Logged in pages, definitely.

And public pages.

Okay so what would I store?

Probably the key thing out there as well that I also need.

I've got nothing there really talking about the course structure so what do I need?

I'm just gonna call it data and from this point I'm gonna need the, I need to see the course, so there will be a course, so it will be the parent, it will have a child of course details, I have a course section, have a child of course section and it will also need the course media which I could probably break up into two things which would be some text, markdown maybe, so the actual content for a section and the other could be media.

I didn't make it videos because I want to make this kind of generic, some media could have a type of video, maybe a type of image, probably is one MVP sort of sort of things.

So I'll put those labels there to that so that we don't forget that.

Um so image and video.

I think that's kind of the minimums that I can get away with here.

and start drawing some lines to stuff so it makes it a bit easier to come back to when we're talking about.

OK, a couple more.

You can't move it easily.

Alright cool.

Course media, course text.

Markdown.

There we go.

Cool, so that's like the actual core things of what people are actually going to view or read or watch.

They're going to need to of course then have a comments attached to it.

So, I'll do another one.

I'll probably attach the.

Do I attach the comments to the media?

Or should I attach the contents.

The comments, sorry.

To the section?

I'm gonna keep it quite high level, so I think I'll keep it to the section.

And that will be a mini to iron.

Okay, how are we looking?

Okay, comments, data.

This is kind of one of my key areas, is the data course, course section, course media, comments, text mark down, media, image and video.

It's a little confusing.

I'm just going to drop these.

And wrap it.

Is that a type for media?

Okay.

Comments.

Got that covered.

Got some form of student.

students can need some sort of profile.

Thinking of it as the MVP, I might try and get away without having any details yet.

But what I probably can't get away with is the student's progress.

That's really important, they need to be able to see what they've actually looked at and when they come back to the LMS they're going to be able to see you know what the actual what section they got up to and yeah we want to be able to just take them straight back into it and not have to navigate around obviously as well.

This would be sweet for it.

I'm just making school course progress.

So that's progress.

That's going to be attached to the student.

It's pretty cool student progress and I'm going to make a table for student I think as well.

Cool.

All right, so we've got student, got the progress, that's going to be attached to the course.

Student progress course, course section, course media.

This is definitely not a database diagram.

enrollment then of course.

Ooh I like that Belinda, that's a good one.

So I don't need a student progress.

Maybe I can have a course enrollment table.

[silence] multiple enrollment records with the student's name in it.

Or ID.

Okay.

This very much looks like I'm already going down the path of a sort of relationship style database.

So I think that's kind of a given so far.

It's not probably a little bit more.

I mean you could do this with something like MongoDB, but I'm thinking I will probably use Postgres for this.

So that would be cool.

So we've made a decision I think.

That's good.

Again with this brainstorming.

So I've talked about that.

That's kind of to determine what I'm going to store.

Comments, kind of got that in the data now so I might just leave that for now.

Okay.

Let's do that.

Okay.

So we're starting to get like a key list of actual requirements now for the project.

Key ones being I need to be able to have some authentication system.

It's going to need some roles in the future.

It's going to need a somewhere to map that to maybe a relational database where I can have the parent and children relationships not only for the course but those that are enrolled into it, their progress, comments, the course media, so there's going to be a parent and child relationship around that as well and I think that's the core parts I think that I can get away with.

Yep.

Okay, cool.

So I need something that's going to be able to do authentication and database.

There could be two different things.

I could use two different services.

I could have a Docker image running Postgres and I could use potentially something like Octa for sort of authentication there.

Octa or Off Zero, having its little baby brother.

Alternatively, there's one thing that's coming to my mind that could do both.

And actually also hopefully save us some time.

How do you know these things?

This is the hard part, is basically you don't unless you've been searching out there for this kind of stuff.

It's like how would you know what to even search for?

But you could just like 4-0 of course.

4-0 is basically your identification platform.

So it's got the ability there to do all the, just like we want there, email password and continue with either sort of like Google or Office or like I've talked about LinkedIn as well.

There's definitely something I could do.

And on the database side, I could just use Postgres database.

I could use maybe You can see here there's Amazon advertising there on that sponsored link for having a SQL Postgres database that's hosted on Amazon and it's a database as a service.

Again, got the actual Postgres site.

I know of another thing that would be quite beneficial.

And that would be Superbase.

So what I try to think about is, Firebase would probably be more similar to something like Mongo and it allows you to have a communication system, data structure and even things like being able to have storage on that side of things.

So, media.

We can do the same with Superbase and Superbase is very similar to Firebase.

As you know, that's something here.

database is an open source Firebase alternative and the cool thing about it, it's got a nice integration of Next.js.

Check, that's what we're going to be using.

It's got authentication.

It's got a database that's relational.

Cool, so everyone is probably familiar with a relational database, a SQL database.

Postgres one is a great open source solution.

Again, it's got storage so we could store things like videos and images.

That probably suits us nicely.

Okay, cool.

So I think we've made some decisions around that that we could, you know, we've got the ability there to do our authentication.

So let's double check to make sure that we're going to be able to do some sort of single sign-on to have LinkedIn.

How can I find that out?

Good question.

Let's go into the documentation.

Enterprise, single sign on, social login.

Yes, okay so we've got LinkedIn, we've got Google, we've got Microsoft, whereas you're using Slack, which actually, that could be quite a good one too.

Awesome.

Awesome okay so those that's all great that's social login that's going to be perfect we've got the ability to do logon with email again that's looking perfect for what we need maybe we've got a quick start there for next so we'll probably jump into this soon probably not today And what else do we need?

We needed to look at it in terms of database.

So I know that for a fact that Superbase actually also has a quite nice editing tool that's all web-based as well.

So you can administer your site I guess while you're in that sort of early stages before you have I guess a full-blown actual interface there that people would be able to manage content in.

Like I said in the whiteboarding here, let's try and keep it down to the minimum here.

We want to try and get this out on launch so try to minimize your scope is a good way of doing that.

Okay, alright so I'm feeling pretty happy about that.

I think Superbase seems to be covering quite a few of my options.

Communication, so it's got an SQL editor here, it's got a table view editor.

So I've technically got a very basic admin that I can use at least to get started to be able to add content, to add videos and sort of get started there, which is pretty cool.

And another normal thing that anyone will question of course is price.

always a good question to sort of ask.

Let's look at pricing here.

We've got a zero dollar.

Looks like it's social auth providers.

So we've got, it's quite generous I think that 500 megs, that should be fine.

Probably not so much on the file storage at 1 gig, the video's big, but you can start off there at least and get going.

And you can have 50,000 monthly active users.

I wish I could have 50,000 monthly active users.

It's more than could expect.

So that's probably good in terms of getting up and running fast.

Next on the list.

How's it gonna look?

This is a tricky one.

I could of course go and make a full custom CSS theme layout that's probably going to be quite slow to get started.

It'll take me quite a long time to build our component library and it's actually really hard to beat something that's already pre-configured.

So even if you think about Tailwind even, you know, in terms of development speed, it's still going to make you a little bit faster there because you're not sort of starting from scratch completely.

But I'll probably take it one step further again while I'll be able to have a lot of freedom in terms of customisation with something like Tailwind.

I'll show you what I mean by that.

There's actually another article, there's a couple articles about Tailwind on my own website as well.

If you want to have a look Tail and what is Tail in CSS?

So I've got a brief introduction about what it's all about.

Well worth checking out if you would like to see that.

Let's check it into the chat.

Okay, it's great.

I mean like I have used T quite a few times in the past, but it ends up meaning instead of having to write all our CSS out like this, we end up with it.

All the CSS classes are already pre-configured and we just apply them to our components and react.

Not bad, it's gonna be quite quick but it's still gonna require us to make all the sort of controls, form elements, things like because we're gonna need a login form so we're gonna need some sort of password field, input field.

We'll probably need some nice text area of some sort to be able to do a comments for the users to be able to add comments.

We're gonna need buttons of some sort, whether that be to enroll in a course or sign up on a form or that kind of thing.

Navigation, that's another thing we probably want to have.

We build that from scratch.

It's not far wrong with doing that.

Just time, time is our enemy I guess.

When you're building anything from this for yourself, there's only sort of one person, so you can only, you know, you want to sort of maximize your time being able to build things a bit faster.

And I could use a whole range of sort of UI libraries.

There's MUI which is the material UI which uses React components.

There's Chakra, Ant Design.

There's just a couple off top my head.

There's a version of Bootstrap that's built with React components.

But a new one that I've really liked the look of and again the other great thing about it is that it prioritizes accessibility.

It's the Radix UI.

So why would I want to use something like this?

Well you can see just from the sort of layout here if you look at the like playgrounds you know you've got a whole lot of input controls, you've got switches, you've got cards, you've got you know drop down components that kind of thing, nice little icons, what else, okay even like slider controls, not sure how to use that one but yeah there's even like a little play button there, might be something like that of course for our videos.

So it's quite a well-designed sort of theme I guess.

It's got the ability there to sort of have some customization where you can switch it already from light to dark.

It's got the ability for aspect ratios, avatars.

Block codes, a whole lot of colour theming, buttons of course, what else, all outs there, Like I said, being able to have all this stuff all ready to go is nice.

Umm, cheap boxes.

Code even.

That's good.

A menu.

That's pretty slick.

So you've got some awesome sort of ability to do a lot of this stuff out of the box without having to build it from scratch.

Another cool thing about this Radix library, I believe it's got really good accessibility.

So that's another, again, another thing that's going to also speed up time and sort of development.

You know, trying to make your website accessible is a really important part of building anything these days.

They say that somewhere between 5 and 20% of people have some sort of disability of some sort.

And that's pretty big numbers and that can be ranging from everything from cognitive So maybe ADHD could be low sight, so there's a lot of macular deterioration of where people cannot see things that's easily in the centre of their vision.

Colour blindness, there's all sorts.

And it's really nice to be able to have something that's already got a lot of that done for you.

So again, this theme's got icons, it's got quite a large big icon set, it's got colours, you know, you can use these colour schemes, and it's also got, these are primitives as well, so you've also got the ability there to I guess make some custom elements if need which is quite nice.

Which is cool.

Documentation wise, accessibility there, it's very much on the top level there.

Again, I've got accessible labels, keyboard navigation, focus management, it's all built on there, keyboard navigation is there.

So that's a great in terms of being able to build this web app.

So going back to our whiteboard, we've got I guess a stack.

Let's put like a list together of what our stack's going to be.

Now I've already chosen the Xjs.

Why?

I'm familiar with it.

It's React and it's very popular.

It's got the ability to also do server-side rendering and client-side rendering, which is going to be of course important for things like public pages where they need to be indexed by something like Google.

So next JS, we're going to have a Radix for our UI.

We're gonna use Superbase and that's gonna be OOF and that's gonna be DV.

Okay, hosting we'll worry about later.

I guess the one other cool thing is the videos.

It's storage media.

We'll put Superbase down for the time being.

I'm not sure if it's going to be cost effective in that area but we can sort that out.

But there you've got a full stack app that will be built with Thanks.

js, so we'll be able to build APIs or interfacing with Superbase anyway.

We'll be able to render things server-side and client-side.

The key thing about the client-side side of things is that we want to be able to track things like people's progress and eventually have some sort of interaction or some core sort whether that be you know questionnaires surveys that kind of thing so again it's leaning towards a a view library like React or Angular or View so that's kind of where we're looking at in terms of stack and again next why I'm using that is because it is it's react based and I'm comfortable with react sometimes it's good to work with something you know see what's up rendering Okay, awesome.

Okay, so I think that's, we're at 230 now.

I'm gonna stop I think for now.

But from, I guess from the next, our next session, we will jump into more of us planning, getting this tech stack set up.

set up and of course starting to do something like a cam bam board or some sort where we can actually break up sort of all the work that needs to be done.

So thank you everyone that's been watching my stream.

Please like and subscribe to my channel.

You'll get notifications of course when the next live streams are coming up.

I'm going to try and do about four streams a week, that's the goal, as time permits.

So I will post those as soon as I know.

I've got Robbie asking, "Have you ever added 'Would it be difficult to add next-gen to an existing project?

It depends.

I would probably instead do it the other way around, start the Next.

js project and if you already had some React components, I would pull them in.

You'd be able to do that quite easily.

That's probably a bit easier than starting the other way.

No problem now.

Hope you enjoyed it.

I will try and do the same time on Monday at 1pm.

Any other questions?

Nope.

Awesome.

Alright.

Nope, awesome.

Alright, have an awesome day and I'll see you next time.

Bye.

{% include "promos/youtubesubscribe.njk" %}
