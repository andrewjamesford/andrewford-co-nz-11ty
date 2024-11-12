---
title: Build a Full-Stack web app with Next.js - Part 3 - Supabase
date: "2023-09-28T00:00:01Z"
template: post
draft: false
slug: "build-a-full-stack-next-js-supabase"
category: article
tags:
  - nextjs
  - fullstack
  - react
  - supabase
  - javascript
  - youtube
  - lms
description: This is the third video tutorial on building a full-stack Next.js with Supabase. Andrew discusses how to display a list of courses on a webpage using data from a Supabase database. He explains how to use SQL queries to retrieve data from the database and display it on the webpage and also mentions using Superbase's table editor to edit the database and provides a brief overview of plans for future development.
ogimage: "full-stack3.jpg"
---

{% figure "./full-stack3.jpg", "&quot;A web full-stack app built with NextJS&quot; / Bing Image Creator" %}

The following is a transcript of my live stream on [YouTube](https://www.youtube.com/live/LCnHOpg7U7s) Sep 28, 2023 on Building a Full-Stack web app with Next.js. This is the third video in the series where I use [Supabase](https://supabase.com) as the database for the app. In the video I create a table to hold our courses. I then load it with some data of some course names and then finally display the results of the data in a list.

The project is available on [GitHub as LMS NextJS](https://github.com/andrewjamesford/lms-nextjs).

youtube.com/embed/LCnHOpg7U7s?si=4nK2Xr8rFvh9TuWr

---

Alright, hey there.

Okay, so this stream is going to be on using Superbase.

We're going to continue on with the rest of the stream, I guess, with trying to build an XJS app from scratch.

And we've gone through the planning stages already.

set up the React app using XJS and we're now at the point where we are going to set up the database.

So how are we going to do this?

Well first things, let's jump to the Superbase website because it's got a really good walkthrough there of a quick start.

Okay, so you can see here it's got the likes of Superbase with XJS.

That's what we're using It's asking for creating a new project on the Superbase dashboard Okay, and goes through the process of setting up a table in the database Okay, so if we go to the Superbase dashboard Okay, so I've got this this is my project the LMS one And I've got no tables in it at present.

So I'm gonna create a new table just like the guide showed us and I'm gonna insert some data into it as well Of course on this one, I'm not gonna be adding countries.

I am going to be adding some courses for the LMS So let's go and do so So create a new table.

No, you want to pluralize the name of course, so courses.

I'll disable RLS for now.

You probably wouldn't want to do this.

Actually, no, I'll keep it on.

Let's keep it on.

I'll do something else instead.

thinking through.

So we're gonna have the likes of a new public table, we're gonna have an ID and it's created at.

This is a nice little simple user interface.

You can do the same using some SQL but the interface is pretty good in terms of that.

So let's do that.

Okay so we're gonna need a few things I guess for a course name, a course name, so I'm going to have a name here and it's going to be some text.

Or Basha, Basha probably would be better.

And I'm going to add a description.

Again, this one I will actually make a text.

And I'm going to add another column here for some.

We need to have an image, I think.

Let's do that.

Now, I think it could have us as some data, but probably the easiest thing to do in this scenario.

Of course, we don't want to to load out a database or anything like that.

Superbase doesn't really give you the option there to add the data directly to it, but we can instead add a virtual character string length there and then we can have the image URL.

We would use some sort of some storage system to save that into a database.

Okay, so we got an image, we got a name, we got a description, we got the created at let's save that.

Okay, so we should shortly see it loading up the table.

Here we go.

Okay, so we've got no data in here at the moment.

We've got a name, a description, an image, an ID, and this table here.

So going back to the guide, we can actually start adding some values to our table.

So there's a SQL Editor to do that.

Let's start off with that.

Okay, so on the left hand side here, you've got sort of the table editor and then you've got the SQL editor If we open that up And this is the new AI stuff We'll do just a new query Okay Is that That's just confusing I'm having some trouble with the entering there.

I don't know where that is.

Anyway, let's insert some data.

So this was the last time I've done this before.

So we're going to insert into the courses table.

and set into name, that's what we're going to add.

And grab that, and just change it.

Okay, so we've got a name there and the value is going to be ReactForBeginner.

Okay.

Okay.

This is setting the change.

This is quite cool.

I haven't seen this before.

So this is, yeah that's pretty cool.

AI way to add data to your database.

Getting the, well, instead of having to do it as a insert there, I could have probably say add name value called to the table there.

Let's try that.

Set that change.

Is that going to let me?

Hm, it's not getting so.

I don't know why that's not letting me.

Weird.

This is not making this easy.

Oh, okay.

So it's like it's not letting me actually edit this.

This is great.

Hmm.

Maybe I found a bug?

Maybe I have.

Not to worry.

Let's see what it says.

So include an almost stardomirter and aqueurries.

Let's see if it will let us execute it then.

No!

I wonder why this is breaking.

It's not to worry, let's refresh this.

and new course named 'grat.

js4beginners' It's kind of weird it popped up with the accept there and.

I am not having luck today am I?

Ah here we go.

So accept that.

Okay now I can do this.

Let's hopefully I can run this and it should add this to my database.

Cool.

Success, that's good.

Let's go back to our table view.

Close that one.

And we'll open that.

Okay, so straight away we've got some new data now in our table.

We've got the record there for reHJS.

We've got no description or image yet, but we can start adding some more records in here.

Just to get something this way on the page once we list out these from the database.

I'm going to go back to the edit there.

I'm going to add another one we have.

CSS Okay, so that's going to add that record on as well and we'll do it one more What's number one HTML 5 HTML was new.

Okay, cool, so that's added.

And if we go back to our table view, sure enough, we've got those three records now.

We've got a name there for each of them.

It's almost a dimension description, but we can add that in later.

Okay, let's go back to the guide here.

Okay.

And we can see here that we've got.

I haven't seen that before on the hopper now.

It shows you how much memory each tab is using.

Pretty cool.

I haven't seen that before.

That's all good.

Okay, so we've got these three records now and our table.

Just a similar example here with the countries.

We're not going to do the create next tab because we've already got it up and running.

We've already got that set up.

What we will need to do, if you haven't already, is to create an EMV file.

So in the project on the GitHub, I actually already have this.

Let's pop this up so you guys can see as well.

Let me see.

So we've got this yellow mess here.

Okay, so in here I have a local env example.

So what you're going to need to do is go into your settings for Superbase here, just like the link here, follow this link here, it'll take you to the API page, you'll have a URL you'll have an anonymous key.

You'll need to put those into an .

env file and something like that.

nv.

local, that's a good place to start.

Add those keys in there and that's what I've already done.

So if we look at my code.

Okay, so just like I said, I've got an example file here, you'd add those keys in there.

Make sure you stop and start so that you get your environment keys to load because without it your app won't reload the environment variables unless you do that.

Okay so once you've done that you've added those keys in there.

We can go back to the tutorial.

Okay and it's got an example here.

They've got a page that they've created, so countries page.

Okay so that's for a type script file and what they've done is they've created a component, used the cookies there to import the header there and then it does a call off to the Superbase library and gets the countries for that.

So for those that maybe have done some SQL in the past it pretty much is very much a similar sort of look to SQL for Superbase.

So their whole, I guess their model for being able to retrieve from your tables, again using a from there, there's your word in the select statement, and you've got a this select statement at the end there, hand by default I believe, having no value in the actual brackets there means that you're going to get all the columns on the table.

So let's start something like this up, let's actually go and add something like this to our page.

Now we can add a new page so it might be a good idea to have a courses page.

So I'm going to jump into this code.

Okay so we've got our structure here on the right hand side.

Okay so we've got an app And there is a page.

So what I can have is the same again.

If you haven't looked at the document page and system of Next.

js, it has a quite basic setup in terms of the app router, layout being the actual what's going to be displayed in terms of layout, and page is the actual sort of content for it.

So if we look at layout there, we've got a layout we're loading in some styles etc.

which is all cool.

Now let's go and go and add a new folder.

Okay, so the App Router works basically by having a new folder name and in it you can have a page file.

So I'm going to have a folder called countries.

Like that.

Okay, so we've got the countries and we're going to need a page file.

All right.

And we're going to need to have a component on there.

So what would that look like?

That could be something along the lines of this maybe.

So we're just typing that out.

We're going to export a export default and we're going to need to have this be async because we're going to be pulling in data for this home component.

Maybe I should just call it, call it horses.

Okay and in that we will need to have, we're going to actually import the Superbase library.

So if you haven't, we probably should actually check to see if we've got this installed.

Always we won't be able to.

Yes I have installed it in the past.

Okay So what you could do in terms of that is go to the command line, run npm install and superbase js and superbase auth help as an xjs as dependencies that look something like this.

And we can take those same two libraries.

So the great thing about npm on the install command there is you can actually have multiple items in there.

Okay, this shouldn't make much difference.

At least there's some version changes or something but yeah, looks like it's the same.

So those are now installed all of the project.

I'm going to stop it and I'm now going to add my courses here.

So I need to import the server component client and the cookies header that was on that same tutorial on the Superbase website.

Let's do that.

Okay, directly copy from the tutorial there.

I'll paste that into the notes as well so that we can see that if you guys are following along in the chat.

Okay, awesome.

Alright, so now we've got that set up.

The next thing we're gonna do is actually go and start setting this up.

Okay, so we've got a courses component.

We need to render something, of course, from it.

But so we need to get the the server-based client first of all.

What's looking here at what the co-pilot's trying to do, but no, we don't want to quite do that.

That's slightly different to what we want.

And yeah, create the server-compliant client.

I think it's got to be like this.

Okay, so the cookie's there.

and we then need to have a way to retrieve data.

Look at that, it's actually even, it's copied the same bit of text there that is sitting on the, probably enough, the tutorial.

We're not going to grab from the countries, we're going to grab from the courses And like I mentioned before, it's very much like an SQL statement.

So you've got the from there, so the from from the table, and the select there.

We're just doing a wildcard, so that's going to return all those values.

Okay, cool.

Okay, we've got that running.

We can now do a return, because we want to actually display what we've got coming out of this.

We'll start off with some, maybe some nice semantic HTML here, maybe a main.

Okay, I have a heading for it.

So thankfully, we have something like that.

So that's perfect.

That's pretty much done what we've got.

Okay, so we've got the data We're mapping out the course We've got a key so that should be our database key items.

So that should be all nice and We've got the name itself Very cool.

Okay, so let's save that I'm gonna run the deep super again and we can jump back to the browser Okay, so localhost 3000, that's not only a homepage, it's going to be in the courses page.

So if we loaded it, it would help probably if I had it under it.

Okay, so what have I done wrong?

I've got my countries.

So much following this tutorial that I actually named the folder of.

That will probably help.

There we go.

We've got our courses.

But what is not working?

Okay, so looks like we're not getting anything displayed on the page and that's okay.

I kind of expected that.

And there's a reason for that.

And it's basically to do with the security here for the app.

So what we need to do to make that accessible, we can do a couple of things, but probably the easiest one to do so is go into our table and what we can do for it is set the policies on it.

Okay, let's view policies.

And what we want to actually do is we want to make a new policy for this.

They've got some, this is basically Superbase's way of making sure that only information that's supposed to be accessible is accessible to the right users.

And they've got these nice little policies here.

So in this one, it's basically just a template wizard.

You can select from one of these.

So in our case we actually want to say that the courses are easy to be seen from the, I guess from a non-logged in user.

So I do want to enable red axis to everyone here.

So if I use this template that's going to let me apply that.

You've got really granular control here with Superbase in it.

you can actually set what operations you can do and can't do.

And in this case, it's pretty much all ready to go.

So I only want to be able to use a select there, and I want to just have that showing basically.

That's pretty much all I need.

A good thing to do is read this when you get a chance, is the documentation.

But let's run this.

Okay, so it's it's creating this policy Sent to public Okay So now that policy is saved.

We should be able to have read access now To our table what you do?

Well, I'll have a list So we're getting them all the list of courses now Being displayed onto the page, which is pretty cool Not bad, not bad, okay So Pretty quickly we can pull sort of our database Tables directly from the likes of Superbase, it's made it very simple to do the likes of our select requests and unlike As you can imagine having a kind of syntax like this is also going to help stop being able to do sort of SQL injection and the likes So having the client Tool like this is pretty handy So what we've got we've got a list at the moment and unordered list and each list item we display the course name and We could have the description and the image so we could actually do something with that just sort of get some placeholders laid out.

So I'm going to give it at the moment, it's not really that semantic.

We need to give it some more meaning there.

Probably use an h3 because I would probably suspect I'd use maybe another secondary heading maybe or subtitle all the likes.

So I'll use an h3 here.

So we've got our course name and I'm going to have a description.

Thank you.

And we're also going to need an image there of course as well.

Okay, here we go.

And just like that, we've got our course name and an image.

Awesome.

Okay, let's go back.

Sorry, wasn't sharing that properly was I?

It doesn't seem to be showing the best code.

Double check that.

[typing] Hmm, let's keep going on.

Still not working.

Okay, so let's.

I'm going to play around with OBS.

What is going on?

[NOISE] Finally enough, let's pull in my notification center.

And let's pull the code down instead.

Get in there.

Well this is a pain.

Nothing like having to do some changes on the block.

[typing] Go.

Fixed it.

[laughs] Water pang.

Okay cool.

Oh good.

Okay so hopefully you guys can see that again.

Let's just walk right through what actually happened there.

So I've got a list item.

Listing through I've got a image.

Like I said previously I need to get that image to display and I need to do the name.

Okay so what have we got next?

We've got our course, we've got our image, we've got our h3 there, we've got our p-tab with the description, which is all cool.

Okay and we move back in our app.

Again, I'm still having a lovely time of OBS tonight.

Okay so it is not loading.

Let's fix this up too.

Bear with me.

[typing] Okay.

[typing sounds] almost there.

As you can see there I've got the image now showing, I've got the description if there was one and the name of course being shown as a title.

Okay let's swap that round, awesome.

Sorry about that.

So now you should be able to see that.

Let's go back to code now.

Come on.

Okay so we've got a, like I said, the images that are hitting and the like.

Now we need to start sort of thinking about how we're actually going to build this up as a component.

So we've got our image there, we've got our headings, we've got our description.

Let's put some images in, maybe a description so that we can see that on our actual project.

So the cool thing is with Superbase is that it has like this whole view of the table there.

You know, it's literally like an editor in the cloud.

You can literally go straight to to the table editor there, click on the table, it's not that much different than say like Google Sheets or a spreadsheet of some sort and you can literally go and you can start editing there, which is quite cool.

on this one I'm going to say.

Okay, so that should sit there.

there, that should be saved.

Okay, if we go back to the app itself, sure enough, it calls the swine on the page.

And we can do the same for the likes of the descriptions here.

okay awesome uh.

what i can also do as the images shortly.

We'll leave that for now.

We'll go back to the page here.

We've not got any hot refresh, of course, for data, but as we reload it we can see there that it's got the likes of all those three descriptions that I've just placed on.

Okay, so we've got to check on how that's looking under the skin and the HTML that's rendered out.

Okay, so So yeah, sure, I've got image, H3 and PTAC.

Cool.

So you can see it's quite easy to start creating all your tables that you require.

We can start building out the rest of our structure.

And I'll probably call pause on this today.

We're probably at the sort of starting point of now actually getting to the nitty gritty of actually building elements into our app.

So we'll start creating some of these tables here.

What I will do is I will also publish or any changes I've made and commit them and push to GitHub.

For those that are following along, you'd be able to pull down the latest version of the app and you'll be able to see where it is.

And then what I might also do is I might actually grab the SQL for the tables and the data itself as well.

So if you want to pull them into your own version of it, you can do that as well.

Next time I'm going to go over fleshing out more that data structure.

So what I'll do is we'll go into some database diagramming just so that we've got a clear picture and a head of what we are trying to build and then we'll implement that in Superbase.

Okay, awesome.

Thanks for watching and we'll see you next time.

Please like and subscribe and thanks to all those that managed to get me to 100 subscribers greatly appreciate it.

But yeah, tell your friends and I will see you next time.

Bye.

_Please note this transcript was edited for clarity._
