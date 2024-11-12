---
title: Build a Full-Stack web app with Next.js - Part 4 - DB Design
date: "2023-10-13T15:45:33Z"
template: post
draft: false
slug: "build-a-full-stack-next-js-db-design"
category: article
tags:
  - db
  - database
  - design
  - dbdiagram.io
  - next.js
  - ERD
description: "In this video, we will be designing the database for our app. We will be using dbdiagram.io to design our database. We use DBML to define our tables and denote the relationships between them. Using the export option, we quickly create the tables in our ERD (Entity Relationship Diagram) on Supabase."
ogimage: "next-js-image.jpeg"
---

{% figure "./next-js-image.jpeg", "&quot;A web full-stack app built with NextJS&quot; / Bing Image Creator" %}

The following is a transcript of my live stream on Oct 12, 2023 on Building a Full-Stack web app with Next.js. This is part 4 of the series. In this video, I started the design of the database for our app. I used dbdiagram.io to design our database, using DBML and denoted the relation ships between tables. Using the export option I quickly created the tables in our ERD (Entity Relationship Diagram) on Supabase.

The project is available on [GitHub as LMS NextJS](https://github.com/andrewjamesford/lms-nextjs).

DB diagram available [on dbdiagram.io](https://dbdiagram.io/d/LMS-Entity-Relationship-Diagram-636c1a0bc9abfc6111717fda).

youtube.com/embed/4uPQxMDKSUU

---

Okay, looks like we're live.

Okay, all right.

Okay, hi there.

I'm Andrew, by the way, for those who don't know me, and I've been running this series on building a full stack web app with with Next.js.

And so the whole idea is to make an app from scratch using Next.js.

We're going to use Superbase for the database, and we're going to go through the whole planning process and getting everything ready together, and go over some of the theory, of course, of why we should do things the way I am showing you.

Of course, open to suggestions, not the VLN handle.

This is just one way to do it.

So let's just jump into it, I think.

So today's stream is going to be working on the design of a database.

So not actually building it as such in any code or anything like that.

going to use a tool called DB diagram and we're going to use that to help us design the database that we're going to put together for our LMS and we have a super base.

Okay let's jump straight into that.

So they're going to be pretty much sitting in Chrome for this whole demo.

And I've gone here to DB diagram right here.

So you can use this so free tool.

I've used this many times in the past.

I'm sure many of my past students remember going through using this.

But it basically allows you to draw entity relationship diagrams in a nice little web tool and we'll just start getting into it I think.

So let's sort of think back and sort of cast our minds back to what we've done previously.

So we have created a table for Superbase and it's sitting here in the Table Editor and we've got a courses table.

OK, so this is basically a table that we started last stream, which was about two weeks ago now.

And in it we have a name and a description and an image for the course.

and we can ID.

So we can use that as one of the part of the design that we're going to be working on.

So let's jump straight to DPDiagram and sort of get our heads in the game about how we're going to design this database.

Okay so it's got a pretty simple format, you log in, you can use github login which is handy of course not having to create another account again and it's got like a basic demo here and it's talking about a product category and a product image and it's a nice sort of starting block there and it shows sort of the relationship here between these three tables So these are not the tables that we're going to use, but this is a good place to start so that we can sort of see how the tool works.

So the tool is very much a.

it's a representation of the database's tables and those relationships between them.

It has the keys, it has the IDs, it has the different types of the data restorative and it's all represented in a nice clean easy to sort of follow tool.

So let's clear this out so that we're starting from scratch.

Okay so once I do that it's now got no tables in there.

Okay and so we've got the courses table which is what I was showing before.

So we can have a table, you don't need to know so much the syntax for this, it does have a bit of help here in the documentation.

but you can get along pretty far just by sort of following the examples.

Okay so give it a table name.

So this isn't SQL as such, it's just a language that's used for the dp-diagram.

io.

I'm trying to remember what it is off the top of my head.

I think it's DBML.

Yes, DBML is a syntax for defining a database.

So, Open Source Markout Language User Defined Database Schema Structure.

DBML is also developed by the team behind DB diagram.

So, all the help's in here.

It's got the actual outline there of a basic table structure and how to do this relationship of some of the next page there.

So let's go back to our diagram.

So we've got a table, we've got courses.

Next one I was showing before in the UI for Superbase.

Again it's a very sort of simple sort of markup kind of language.

So you've got the table name using a plural there for courses.

And I need to have an ID.

So I'm going to have a course ID.

This is going to be a integer.

So let's make sure that we do that the correct way.

So it's an integer like that, int.

And we can have the primary key there.

That's what the PK stands for.

So if we go like that.

OK, it's got a little key icon there for the cross ID.

So that's very much like what we've got for our existing table here.

So the next field in there is a created at.

Again, created it and this is going to be a timestamp.

I believe that's the right type.

So timestamp, whenever a row is added to this table, it's going to get the timestamp placed on it and so that we know when that record was actually created.

Okay so we then got back to let's have a double check again we've got the name of archer and the description a text okay so again name so this is the name of the course.

Name is a reserved word you can use use that word in this context so I could actually just just change it to a course name.

That actually might be a better descriptive name of it and it's gonna stop any sort of confusion there.

We're gonna know when it's a name and it says course_name that it is of the course table.

And we can give it a varchar like so.

Okay so we've got the course ID created at course name and the Vacha.

I'm gonna have a description.

Okay so this is description for our course.

Okay I'm gonna use the text type here because I expect this to be more like a paragraph of content.

With Vacha it's I guess more for a limited name.

Ideally, it's sort of, our child will probably store less bytes in their records.

Not that that's such a big issue these days in the past.

That is something that people would stress about because, wow, RAM was expensive and so was this space.

So thankfully, that has changed from there.

And so we can have a image as well and this is going to be a VARCHA and it's going to point to some sort of hosting that we will talk about at a latest point.

But for the time being it's just going to be a VARCHA.

It could be an actual direct link to where the image is actually located.

Okay, all right so that's going to have our ID for the course, the created app, course name, description and the image there.

Okay, so we've got one table and that courses table, I mean it's a key part of our LMS.

You need to have a course to be able to learn from, So it's really important that we have this table as part of our MVP.

So let's continue on.

I know we need, with anything with a course, you could have maybe a course section.

So you've got the course itself but you need the actual content for each part of it.

So what we can do now is a table again for the courses section.

So courses section.

Like that.

Okay.

And so this courses section is going to need a ID.

So we can have a section ID, integer again, primary key, like so.

And we can do the most important part about it is that we can have a relationship there for the courses to the courses section.

So we can have the course ID as an int.

And we're also going to need, I guess, something to go into our courses section.

So we'll have-- what we could really have.

So a section could be maybe it's some text, it could be just a sort of a free-form text area.

So we could have section itself and the content.

OK, so say I see like a section would be like a page in the course.

So we can give it a title.

Title would probably be good.

Something like that.

Vacher will have the course itself and we'll have a section of where it is and we'll also need probably something they probably haven't thought about is something like an order.

So we're going to have the order for the section.

So what do I mean by that?

So imagine you've got a book and the book would be a course and in that course you'd have the book and it would have in it it would have pages and each page could have like a title, it could have the order so like which page it's on so this could be the order so one to you know 100, 150, 300 whatever how many pages your course is going to be.

So by having an order there we can shuffle stuff around if we want want to at a later date, which is going to be handy for people administrating the course.

So they're going to need to have some way of being able to order that section.

So imagine we've got the courses page.

They're going to have a landing page for that course.

They go into the course.

They go to the first page.

And it would be the one that would have the first item by order.

So it would be the first order there.

And then it would display the title, hopefully.

And we'll just leave, I think, that section at that.

Because we're going to do the next part in my table structure.

So I'm going to have-- I've got a courses.

I've got a courses section.

I'm going to have a courses media.

OK.

OK, so this is going to be, I guess, the actual content itself that sits inside a section.

OK, so it's going to have a media ID.

This is getting, I guess, relatively complex pretty quickly.

This is why we're doing it as a diagram so that we can get it clearly in our head about what we're actually trying to do.

So we're going to have the Media ID, the section ID, and we're going to have the Course ID.

No, we don't need the Course ID, do we?

Why do we not need the Course ID?

Because we've already got the Course ID in the section, so if the courses media is linked to the section there, then we should be fine.

Okay, so I've got the Media ID, Section ID, and then I'm going to have an image.

Okay.

And.

I'm actually not going to do that.

I'm going to do the actual section content.

So this will be the content.

I'm just going to have it as a text area.

Thinking I'm going to use sort of markdown for this, but I'm still in the early stages of planning out the app.

And that's OK.

We can change it later.

This is the first part of our planning.

We don't have to get too caught up on the details too far yet.

OK.

So you can auto-arrange that, so just that, oh, I've got them in the middle there.

That auto-arrange, all the tables there for us.

So it's starting to get that sort of visual look and feel so we can actually start getting an idea of how this is actually going to work for us.

OK, so we've got the courses, the courses section, the courses media.

also going to need some comments I believe.

So what we can do is we can have that again another table and we can have our courses.

This is going to be the comments table.

Okay, so we've got this courses comments.

We need to link, we're going to link the comments to the media, and the media is going to be linked to the section, and the section is going to be linked to the course row.

Okay, so we've got the courses comments.

So I'm going to have 'comment ID', again, another primary key, like so.

And we are going to have the student.

So I'm going to put the student ID in.

And I'm going to put the comment itself.

Okay, so we're going to do a basic structure here now for our courses.

We talked about that we want students to be able to enroll into these courses.

So we need to also probably have some way of recording how that's done.

There's a couple of different ways we can do that.

We'll come back to that because I think it's probably important now that we start showing some of these relationships between these four tables so that we get an understanding of how this data is all going to be tied together.

And this is the biggest reason why we use the entity relationship diagram.

It just makes it easier for us to understand what the relationships are between the different tables there.

It's got a really basic sort of structure here.

So you've actually got two ways to do this according to the docs here.

So you can do your relationship like so with the ref there pointing to the other table.

Or you can use for the likes of a many to one relationship.

you can do the same of having it in line instead and you can see here it's very similar syntax, it's just that it's got a square brackets around that.

Okay so let's grab this one, we don't really need the first part of it but basically we have, we're going to have a very much a one-to-many.

So let's think about this.

Let's look at this diagram and get a sort of head around this.

So it's saying we've got a many-to-one relationship.

Okay so in the code here it's got a reference here, many-to-one like so.

Okay so we could have the same.

So we could have our course ID like so.

And so there's a couple of two different ways that you can see that I've done this.

So now it's representing that sort of link between the two.

So I've just dragged between one to the other.

It's around the wrong way.

I'm going to do.

So I'm going to have many sections for many Ds.

So I'm going to go the other way there.

So it better, you can see there when I highlight it, you know, it shows one and the star, star being many, so one to many.

So I've got one course ID, it's going to have many sections.

So the course ID here, this is not going to be a primary key, there's going to be multiple versions that will be same course ID for all the different sort of pages that we're going to have on our course.

Okay so let's have a look at that.

So we've got courses, we've got the courses linking from to the section.

We now need the.

again same sort of thing.

So you can drag and drop that and we'll do those lines for you.

You could write this up, anyway there's nothing stopping you from doing that kind of beauty of this tool is that you know you've got a GUI for when you want to use it and you've also got a quite nice markup language that's easy to share.

Another good thing about this having it be all sort of a markup language that's not specific you can actually this is this is independent of database it is.

So in the case of our project we are using Superbase which is basically a hosted Postgres database.

So we can make it export this to some Postgres SQL or flavor of Postgres SQL but this dbml language is actually to the database agnostic so we could maybe even export the same thing for the links of MySQL or Microsoft SQL as well I believe.

Okay so we've got the courses, I've got the courses section, courses media and we're gonna have the comment ID.

What did I miss?

I know what I missed.

I didn't have anything in my courses comments.

Well we have an ID, we don't have any way to link that back to the media itself.

Okay so let's add that.

Idea ID.

Cool, okay and then we are going to then link that MediaID from here to there.

Like that, cool and so if we auto-arrange it, I'll tidy that out nicely for us.

Okay, so now we're starting to get that sort of structure there, so we can have you know one section can have many media items in it and of course a media item can have many comments against it.

So the students would be able to you know maybe ask questions or they could maybe tag their instructor or just try and get some clarification or maybe put something in a way that they understand it better.

So that way of course then the course in question is going to actually be make a lot more sense to a lot more people.

Okay so we have the courses, course section, course media and the courses comments.

You go a little bit of a little bit of play here, you can choose which colour your actual the theming I guess for the diagram is so we can do the same where we can Have a whole lot of the structure of tables here and that To me I guess the one of the key Tables that we're going to require There's one that's going to have the students information Okay, so students information again Something like that.

We are going to need a student ID.

Like so.

Again, primary key.

And we are going to have created it.

I missed that on some of our other tables.

Probably thinking why do you need to create it on all these tables?

The good thing about a database is by having this extra metadata around it, not only do we have the information about what record was being added, knowing when is actually going to be helpful as well.

So maybe we have an error log in our application and we could actually then draw back through the created at records there.

So we might be able to see if there was an issue there with that table that could give us some insight there.

To that, we've got auditing.

So a big thing about a lot of apps and the like is it's very helpful to know when something happened or something was recorded.

So having that created at timestamp with the buffer date and the time there plus the, normally it's stored in a format which is like UGC or something of a likes so that it's universal time and all the calculations can be converted to a local time zone if needed.

So we've got students, student ID created at, we will also need I guess a big first thing that someone needs, a person or a human or a student, in this case is going to be their first name.

And I'm going to give that a voucher.

I can give my last name.

Again voucher and I'm also going to give them a email because I need some sort of form of connecting their accounts and getting notifications etc.

Okay so we've got the ID created at the first name, last name, email etc.

Okay so we've now got our students table.

Going back to our comments, we actually had the student ID here so we would expect there to be a link there between the student ID and the comment.

Ok so they need to, we know then that this table now is linked via IDs here and why have we done it this way?

Well the big thing that remember is with databases and the like, we try to make our data so that it can easily be updated or changed.

It's common these days for people if they get married or in a civil union etc they may change their last name so it would be annoying if you had to repeat the first name and last name on all the comments so that when that user updates their details, then we'd have to go into multiple records there and I'll take those records if we were storing their first name and last name.

But instead of course we're storing the student ID.

So we're storing instead the link between this table and the other and that's it.

Which means that if we do change, If they need to change their last name or first name or email address, they can do so and they are only going to have to update it in one record and not across the entire database.

Alright, okay, so we've got the courses.

I'm going to actually get this different colour just to make it a little bit easier for us to easily visually see that.

Oh, looks like I don't get that feature.

a shame.

So that's one of the pro features there.

Not to worry, we can still see that.

Okay so we've got the courses, courses section, courses of media, courses comments, we've got students and we're going to need some way of tracking, I guess the progress of where our students granularity, we would I want to actually record where the student got up to.

I could have it right down to the media itself, but I think that that's probably too low into the details.

I'd probably be okay if we just did just track the progress of the student as maybe they got to page two or page three of the course.

So the section is where I probably want my granularity at.

So each student is going to need a progression.

So what we can do for that is we can create a Students progress table, I think I think that's what we'll call it Table students progress Okay, so this is going to record like I said The student the course that they're on and what section that they are up to okay, so Good thing for this is we probably can get away with the one record per student per course and that way we should be fine in that regards to just track that.

So we can do, so we've got the student ID, We're going to have the course section ID, so we're going to need what section ID that they're up to.

And then after that, we're going to need to have a Hi there in the chat, I just noticed, sorry.

And we're going to need to have, of course, the, we know what's last may be modified.

I think that would be a good one to have and of course the course ID.

I missed that out, that's pretty important.

So again, this whole record is going to be made up of these three things.

It's going to be the ID, the course ID, those are the two main records there that we're sort of interested in and section ID I guess will actually be their progress.

Created it, that would be handy to have some auditing there, somewhere they first started.

And again thinking about sort of auditing again, modified at again, this is going to be so when say like the section ID would change.

So I'd sort of see it that this table would be tracking the progress of a student.

Again it's linked up between the course ID And it's going to be linked to the student.

Okay, and so we're going to have this sort of relationship here between.

Move that out of the way, make it a little bit easier, see?

Between the student there and their progress.

Okay, so I'd see that their section ID would change as they traverse through the course.

they go to the next page, we could then record the following section ID and then we could also update the modified at time stamps so that we keep in that progression there.

So that when a student comes back in, maybe the first time that they come into the landing page, we have their listed courses and a sort of resume button to resume from where they were last on the course.

Cool, okay so it's starting to really all come together now.

Be careful, don't you want to go back and lose any of our progress?

But you know it looks like it's nicely arranged that for us again.

Okay so just double checking on that.

Cool.

I'm going to give it a name.

It's always good to name stuff.

this is our LMS entity relationship diagram.

I hope so I can spell.

there we go, relationship diagram.

So it's looking a bit better.

Cool, okay.

Okay, we're pretty happy with that.

This looking, you know, we can now visually see on our head how this all this data structure is now all laid out.

We've got a nice little diagram for it.

It's good to document these kind of things.

Sometimes, you know, you don't have to use of course this tool.

Maybe it's easier for you just to sketch this out on a piece of paper.

But this is something that will, you know, sort of helps cement in your head, how you're going to have that actually structure of the data there.

Okay so let's actually go to, well the thing I love most about this tool is it's got an ability there to export some PostgreSQL here.

So you can export it, you can export this as a PDF, PNG, CNG.

So you can put that into say your documentation.

Maybe you put it into a wiki, will you read me or something like that?

You can do that but you can also use the dvml to generate the Postgres SQL that you're going to need to be able to create your tables.

Okay, I just noticed a typo I've got there That might help, it's not an it, it's an int.

Okay so it's an integer.

Okay so let's do that and what we can do now, so let's just have a look here at the 'Ft-Q's'.

I think there was any more details about that.

No it doesn't like it.

So you can go into here, you can export your Postgres SQL.

Okay so that's gone and downloaded that for me.

I'm going to open that in another screen.

Okay so coming back to Superbasis itself, we've got the likes of a table already created for our courses.

Okay so what we can do now, it has a great little tool here, so you've got the actual, you've got the table editor itself but you've also got the SQL editor.

So if we open up that, now we've got a basically a free area where in a web app we can go and add our table.

First thing we're going to do because I've made probably a few little changes, I think to my courses.

I'm just going to actually just drop that table.

That's okay.

Dropping off the cascade there, so I can delete all that.

I shouldn't have been in any cascade anyway because there's nothing linked between them but why not.

Okay so like I said we exported the SQL there from our DBML So let's have take a look at it here.

So we've got the courses table if you can see it slightly changed the DBML to the Postgres SQL flavor of SQL So looking that Between the two so you got courses ID there primary key.

It's a slightly different But it actually you know, it's still very easy to read SQL as one of those languages But isn't too far from English there It's not a big stretch To be able to easily follow Okay, so we've got the courses.

We've got the courses section got the section ID the course ID the integer title Vacher order again media That's okay.

Of course it's comments.

Students and the students progress.

If we follow down here, you can see where it's got the alter table and it's altering the table name.

Adding a foreign key and so it's reference to that certain ID.

Let's actually just go ahead and run that.

That's all looking okay to me.

Okay, cool.

So now, we should have all our courses created.

Cool.

Okay, looks like there's warning there and we're going to enable some road level security.

But you can see it's created that course as we had it in the SQL here.

So we've got the id, we've created that, the course name, theta description, image again and we'll have the same again for all the different tables here.

So this is a great way of being able to quickly sort of sketch out in a tool like this dvdiagram.

io get the I guess the entities of the database how you would like to have them and yeah just be able to export them to some SQL that you can then run in a Postgres database or in our case run it on Superbase which is basically a hosted version of Postgres for us.

Once that's done we should then have all the tables should have the foreign keys and the linking between them so that if say I had a course and I created a record here, it would expect in the courses section that that's going to be linked to that course ID.

Okay, it has to be linked to our record there because we had it as part of our SQL here.

Another great thing about this, now we've got some SQL that is available for us.

I mean we can keep a copy of that.

likely we can check that into our source control.

So it could be used as sort of a manual migration which would mean that whenever we wanted to set up an environment like this, with the like surf base we can literally start a new account, start a new project and again be be able to replicate that whole structure again of our database structure.

And what I could also do, probably next step would be to go and create some SQL to add some content there.

The beauty of that, having it done by an SQL statement again is, you know, we can come back if we destroy the database, we break something on it, we can roll it back to a previous state, which is something we always want to be able to do with both our source code and our data.

So that's again allow us to do that.

But again like the DB diagram tool is you know such a great easy to use tool for something that's again I'm quite a visual person and I find it very much easier to sort of start getting that sort of laid out and a sort of visual representation that helps me think about the way that the data is going to be structured and how I can actually build out my database.

Is this the VL and end all?

Is it finished?

No, it's not.

I will probably change my ideas at later stages but it's you know at this point we're just trying to get sort of the MVP the most most valuable product I was like the one I like to call it again make that most valuable product and this is a great way to get started putting at your table structure having an individual way you know you've got a record of it both as some SQL and you could also export it as a PDF or SVG etc.

So you can embed it in your documentation and you've got that sort of structure there that's saved.

I'll be able to come back to this.

It makes these nice links here that so you can actually even share these in this tool.

So you can see here I've got the share and I can share composite protector, can get invite people etc.

which is pretty cool.

And another thing that it also allows is we do have the history here so we can roll back in time to see and change that.

We've actually got November 2022.

That's the last time I used that previously, but that's cool.

Interesting to know.

And of course for you lovers of Dark Mode, there is a Dark Mode.

Cool.

Again, I'm going to link this into the chat here.

Feel free to have a play, make your own database diagram.

I'm going to link this into the documentation so you'll be able to come back to this and I add it to the project.

I'm going to grab that SQL as well and add that to the project so that we can roll it back and what I'll do is I'll give it the date and time of when that was created and add that to the SQL file so that we can come back to it at a later point.

But that's yeah that's how to design a database in a web tool called dbdiagram.io.

Hopefully you enjoyed that and you learned something, please like and subscribe.

I've been blown away by the number of people that have been subscribing to the channel.

It definitely makes me want to keep doing this.

I'm going to try and keep at it.

We've still got a long way to go for our LMS project and I might look at updating the frequency of these because of course the faster the more I do in a week, the faster we get along in progress, and we've still got ages to go.

All right, thanks for your time, I hope you enjoyed it and I will see you next time.

Bye.
