---
title: Dev Containers In VS Code
date: "2023-09-14T20:41:32Z"
template: post
draft: false
slug: "dev-containers-in-vs-code"
category: article
tags:
  - vscode
  - containers
  - devcontainers
  - livestream
  - video
  - codespaces
description: Dev Containers in VS Code allow packaging a project's dependencies and tools into reusable container images. This provides a consistent development environment between machines by launching the project within its dedicated container in VS Code. The live demo showcased common workflows like debugging, installing extensions, and using codespaces for cloud-based container development.
ogimage: "dev-container.jpg"
---

{% figure "./dev-container.jpg", "&quot;A Dev Container&quot; / Bing Image Creator" %}

Dev Containers in VS Code allow packaging a project's dependencies and tools into reusable container images. This provides a consistent development environment between machines by launching the project within its dedicated container in VS Code. The live demo showcased common workflows like debugging, installing extensions, and using codespaces for cloud-based container development.

[VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

[Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)

The following is a transcript of my live stream on YouTube Sep 11, 2023 on Dev Containers in VS Code. This transcript has been lightly edited for length and clarity.

youtube.com/embed/yiJ2lWrVCgk?si=gRRnvuHwD-8cHg8D

---

Hey, it's Andrew here.

So today I'm going to go over developing with dev containers.

So for those that don't know me, I've been a teacher for about two years in software development and I just thought I'd like to share some more knowledge while I can.

Well I've got some free time anyway.

Okay what are dev containers?

So a dev container is a pre-configured development environment that is packaged up as a container image.

This image includes all of the tools and dependencies that are needed to develop a particular application.

These dev containers can be used to create a consistent development experience for developers, regardless of their operating system or machine configuration.

So Mac, Linux, Windows.

They can also be used to improve the productivity of developers by providing them with a ready-to-use environment that does not require any setup or configuration.

So these dev containers are typically created using a tool like Docker and VS Code.

And Docker provides a way to create and manage container images.

And to create the dev container, you first need to create a devcontainer JSON file.

This file specifies the contents of the container image.

The devcontainer json file can be used to install tools, dependencies, and configure the environment.

So a big part of software development is dependencies and managing your environment.

So this can take care of that for you.

Why would you want to use devcontainers?

Devkit containers can be a valuable tool for improving the development experience.

They can help to create a consistent development environment, improve productivity and reduce the risk of errors.

That's all stuff we want to do.

As we develop things, okay, so consistency.

That's a big one.

Consistent development experience.

Okay, so dev containers can help to create a consistent development experience for developers regardless of their operating system or machine configuration. So this can help to improve productivity and reduce the risk of errors. So stopping that tool works on my machine, but doesn't work on yours that kind of thing the improved productivity is is dev containers can help to improve the productivity by providing developers with a ready-to-use environment that does not require any setup or configuration.

We love that, don't we?

Being able to just get started without having to battle through a config.

So that can save a whole little time and frustration.

Reduce risk of errors.

So dev containers can help to reduce the risk of errors by isolating the development environment from the production environment.

This can help to prevent errors from being introduced in the production environment.

Hey people, integrated with VS Code, but development experience is much nicer than working with Docker containers alone.

So one cool thing is with VS Code and the containers is that the terminal can actually be looking at the container itself, which is pretty awesome.

So it's a UI one there.

Another real benefit of it is the ability to run in Codespaces.

What are Codespaces, you're probably asking?

So it's basically a thing that GitHub has, where you can run one of these dev containers on a machine in the cloud.

And you can do all your development.

You can even share it with other developers.

You can show off what you're working on.

And it's all pretty much just a quick way of sharing what you're currently working on.

Maybe you've got some really big requirements.

Maybe you're working on a low spec machine and you need something with a lot of RAM.

With the dev containers there, you could specify that machine to have a whole lot of RAM, and then you'd be able to use that in the cloud.

Now you can use that in VS Code, or you can even use it in a browser, which is pretty cool.

Okay, the other cool thing with Dev Containers is that it's easy swapping between projects with different dependencies.

Say you had a project that was using Node.js 16 and this new one needed 20.

By running the containers, neither version will be installed on your local file system.

Instead, it's going to be sitting in those containers and it's going to keep your computer craft free, which is really handy.

As you can imagine, every time that you'd want to have to switch between to node 16 and 20, you'd have to use some other tool to do that.

And the same thing could be had between, say, different versions of Python or .NET Core for starters.

And being able to easily switch between them just by running up a container means we don't have to worry about what's installed on your machine.

Okay so if you're looking away to improve the development experience, Dev Containers are a great option and they can help to create that consistent development environment that will improve productivity and reduce the risk of errors.

Cool.

A few friendly faces that I can see in the chat there, hi everyone.

Okay, so let's get into, let's look at the docs.

That's what I always like to do before I get started with anything.

Let's jump to code.visualstudio.com.

Okay, so this code website, it's got some really great content here what are dev containers and what they're all about etc.

Probably the big one to look at is this image here and this might help sort of cement this visual model of what is actually happening.

Okay so on the left you've got the local operating system and inside that you've got the VS code, you've got the theme, your UI, your extensions, blah blah blah.

But you've also got the source code.

Okay so that's all sitting on your local machine.

So you've pulled down, cloned down a repo down to your machine and you've now got that source code there.

You've got the vs code, pretty much the same as what you're used to.

It's pretty normal.

But when you have a devcontainer.json file, one of the things that the yes code will do is it will pop up a little pop up saying "Would you like to open this in a container?"

And when it does that, so what just like as you would if you typed docker from the client line or docker compose with a docker file, that would then pull down those image, set that up locally on your machine and then make it available to work on.

Okay so what does it do?

You can see there on the right in the container you've got this VS Code server.

So what it actually does is it actually runs VS Code the server which is another open source project, runs that locally in that container, it mounts the source code that's sitting on your machine and then with that container there you've got the file system, you've got the terminal process, you've got the running application debugger, all those are accessible from the VS Code server and VS Code opens that port and can read that VS Code server there and so it's just literally imaging what is in that same container.

Cool.

Okay so let's actually let's go through set up a small project and we'll add a dev container to it and so you can see how it actually works.

Okay let's get started with that.

So we're going to jump to Visual Studio Code here.

So I've got that open.

Pre-work visits you're going to need Docker.

See I've got Docker up in here, I've got the dashboard running.

At this point I've got no containers there.

The other thing that you are going to need is this extension here, which is dev containers.

I'm going to copy that, paste that into the chat for those that want to have a look.

Hang on, I'll get the right link here.

So this is the extension ID here.

If you do search for that in your own VS code, that should come up with the right one.

And you're going to need to install it of course.

It's got a few other prerequisites and it will sort itself out for you.

Okay so once that's installed you've got Docker installed up and running, you've got your VS Code, let's make a project.

So you'd either clone something or start fresh like I'm doing right now.

I'm just going to clear that.

Okay so I'm going to use Next we use the create next app to start building a little project that we're going to add, make it a dev container.

Okay so NPX, maybe something I've prepared earlier, there we go, create next app at latest.

So it's going to use the latest version there of next.

Hit enter, cool okay, my mixed dev container there we go, the name for the project.

We're not going to use TypeScript, I am going to use eslint, we'll use Tailwind, fix the source directory, add router and we're not going to customize the import there.

Okay probably seen this before if you've used next.

Great way to get started with a project.

It sets all your templates up for you.

You can see there it's installing all those.

Awesome.

Okay so now we've got a project sitting under there.

My next dev container.

So I'm going to start.

And there.

And I'll start going up from the command line there.

All right.

Zoom in a little bit.

Make it easier to read.

How are we looking?

Cool.

Okay.

Normal sort of node project, JavaScript project.

If we open it up, okay, so we've got some layout files, page etc.

Pretty much standard what we've been always used to.

Not really any different than say create, react, app etc.

All right.

Okay so I've got the my next dev container set up there and what I want to do is I want to make this project now startup under a dev container.

Now I've got that extension installed already.

So I do command + shift + P or control + shift + P if you're on a Windows machine.

If you go into the command prompt here and well, funnily enough, it's the top of my list here because it's recently been used.

Dev containers add dev container configuration files.

Okay, when I add that it gives me a whole lot of options.

There's pretty much every single sort of image you can think of.

You know, you can use standard Alpine, Debian, got some node ones and what we're gonna do is I'm gonna choose this one so this is a node.js and a PostgreSQL container.

Okay I'm gonna add that I'm just gonna use the default there of 20 and what I can also do is I can actually install a whole lot of other features.

So why would you want to do this?

You can see at the top there there's one password CLI.

So that's a if you use 1 password you can use that to you know do your logins etc.

You can do it all straight from the terminal inside the container.

And of course you've got plenty of other options here.

Anaconda and people doing some builds or something.

App packages, maybe you want to update the container.

Even Astro CLI.

Yeah there's quite a few options there.

Are those default options actually?

Let's do all.

I can find it.

The common.

I probably won't have to select it because it's already, yeah it's already part of it I believe.

But the common utilities case things like OhMyZSH and a few other nice little to haves.

I'm gonna add it, it's not gonna hurt.

Okay and I'm gonna click OK there.

The defaults will be pretty pretty much what you need.

We'll just go through them just to have a quick look but you can see there it's just this configuration of those common there.

So whatever you are adding in terms of software.

It's going to give you some options there.

And ZSH, we're just going to have a prettier looking shell with OhMyZSH there.

Okay, switch to automatic and use automatic and automatic again.

Okay, cool.

I see previously that VS Code would do a little pop up when it opens a project that's got a dev container and sure enough it's done that little pop up you can see there.

So what we have here we're looking at the dev container json file so this is what's just been added.

It's got a few things pre-configured there it's got the name of it, nodejs + postgressql so that was the container that we selected first up.

It's got for those sort of used docker before you probably would have seen a docker compose file and you can also see there on the right there is a docker file okay so what are we gonna do with the little pop-ups gone we're not gonna panic for starters but we can bring that back up again so if we do Command + Shift + P okay and go dev containers and we can do rebuild or open, okay open the folder in the container, we'll start with that one.

It's uh oh I'm sorry where am I?

Open, rebuild, don't worry, open in container.

Okay very quickly, didn't really see that, here we go.

If you click on that quickly while you still have time.

It might be slower for you or faster depending if you've got the images already on your local machine.

But once that's done is what we would normally have to do if we were using just Docker alone, we'd go into the directory, we'd start docker compose, of course it would look at the compose file, start the docker and we'd all be running in that container.

Okay, You'll notice one little sort of point of difference when you are running under a container there.

You can see down in the bottom left here, okay, so it's saying that we are editing on Dev Container, Nodejs and Postgres SQL.

And it's basically if you pop that open, you've got a few other options here for things like attaching to the running container, you can configure the container features, all that kind of thing.

And like I mentioned previously, you can even create a new code space with it.

Okay, I'm gonna start a new terminal.

Okay, you've noticed anything about my terminal that it looks slightly different.

So when we were in the VS Code previously, I definitely wasn't in a WorkSpaces folder, I was in my developer folder I believe, and I had a YouTube folder where I've created this project.

So what we're actually looking at when we're looking at the terminal right now is what's in the container there.

How do we prove this.

So we can do something like this.

We can see the version there.

Okay so it's saying that the node version there is version 20.

Okay like when I, if you can cast your mind back you may want to jump back in the video later after we finished.

But you would have seen when I was setting up the devcontainer.json file there was this section there of the version of node for that image and it was version 20.

And when I selected that, that of course has installed that version.

Okay so hopefully a lot of you, some of you may be more seasoned developers remember the pain of trying to support maybe a legacy application.

Maybe it's running on an old version of node and you really want to install that but you don't want to have to go through maybe breaking your dev environment for something else that you've got running.

So these dev containers are a way for you, maybe you're working on something in node 16, and maybe you're working on another project in node 20.

Because they're all self-contained in these containers, and the whole development experience feels just like you're developing locally, you get a premium experience with the ability to have any dependencies that you need they're sitting in those containers and available to you at minus notice, which is way better than having to change all your whole configuration again.

I've got one question in the chat.

So the dev container JSON is used to generate the Docker files or it has other uses as well.

So what does it have?

Let's get back to it.

Okay, I'll just close the terminal.

Okay, OK.

It's got basically, let's just go through each part first.

So first of all, you've got a name so you can rename this to whatever you would like.

You've got the docker compose file so it's actually created a docker compose file there in this directory.

We'll have a look at that in a sec.

And you've got a docker file.

For those that maybe you've looked at a Docker compose or Docker file before and then we have a service and a service has the name.

So this is actually linking to that app straight out of the box.

We've not had to set that all up for us and again the WorkSpaces folder again has been pre-configured for us again using that base folder name.

So when we were looking at that previously in the terminal we could see, was it my dev container.

Okay, also this dev container has things like the features there, so we've got all the features configuration there for zsh.

And not only that, you can also set up, which is probably what a lot of people would like, is things like port forwarding.

So you got the port 3000, which is the standard port for Next.js and we've also got the standard port there for Postgres.

Okay so that's going to make the container have those ports open to us so that we're going to be able to use other tools to be able to view things like things like browser and I'm going show you it's sort of using a RMS tool to be able to connect to a database.

So again we've got all that set up and we've got the ports.

One other thing that we can do which again making this whole developer experience much more smoother.

What's normally the first thing you do when you have a no project when you want to get started.

That is that you're going to have to install an A module, don't you?

And so one way to automate that whole process is we do actually have the ability to have this post create command.

So once the container has all been created, we can use this post create command to then fire off the, in our case I'm going to use npm, install here and then I don't have to go through the hassle there of going to actually happen to menu and do it.

I know, the stress, the pain.

It's all going to be taken care of for me.

You can see there because I changed it the rebuild came out.

I click on that again, that's going to again read that dev container file.

Again take that image, it's probably not going to have to do too much apart from install the npm modules here.

You can see that's installing all the node elements there.

Okay, so that's done.

Like I said before, we are running on the node 20 here.

Just to prove that, I'm going to show you my terminal.

Oh, it's saying there.

You can see here I'm running 18.

Okay, so the cool thing about this, this is all self-contained.

You know, you could take this whole setup now, I can event this to say the GitHub and give it to my fellow workmate.

They would be able to clone it down as long as they've got Docker and they've got the dev containers extension.

When they fire it up and they load up their VS Code, it'll ask them, do they want to open this in a container, which I hope they do, they'll open in a container and it will go through this whole process, everything will be set up for them, the version of node, all the npm modules, all ready to go.

And all that they're going to have to do is do something like this.

Come into npm scripts, or no different than actually running it from here, so I'll we'll do it from the terminal just to show.

So npm run dev.

So that's starting up.

So I now switch back to Chrome.

I open my localhost, all right so now I've got just the standard sort of loading page for nextjs there.

It's running from a container, the ports are being forwarded, so I know that the ports here being redirected you can see there I've got that Localize 3000.

Let's also have a look at what is happening on the Docker site.

Okay looks familiar we've got our project name and inside it we've got two containers.

So one container is a database and the other is the app.

Okay so one is running the next app and the other one is running Postgres in there.

So this database of course is empty but I would be able to connect to it say from something like I've got bee keeper studio open here.

If I connect to that, I believe it's Postgres of the password by default, I connect to that.

Empty database, awesome.

So of course, you know, whole empty environment's all ready to rock in just a few seconds.

If you're using the same sort of container images of course on lots of different projects, you know speed's going to vary, but generally it's not too slow.

And the cool thing is that even the database is contained.

So in this case, just trying to remember what's the Postgres version.

We can find out actually, we can go to the Docker files probably in here.

Docker compose.

So let's just get him the latest version of Postgres there.

So again, this shouldn't be anything different to anyone that's used Docker before.

You've probably seen images etc.

So if we went to Docker Hub and we looked for that.

Talk to you in the lab.

Wait, no hands?

Hmm, I didn't let that run.

I'm not sure what's going on, but whatever the latest version of PostScript there, it's setting up that one.

So again, like I was talking before about any project is going to have some dependencies of some sort.

There may be something that you can't upgrade straight away.

It's going to require a whole lot of refactoring.

So because the dev containers are all self-contained, we could use an older version and not have to worry about an effecting our local machine.

Let's go back to VS Code there.

Alright.

Okay, let's just have a quick walk through this compose file.

Again, like I said, very much the same.

It's got the services as you normally would have.

It's got the app and it's got the bb.

And it's got that all ready to rock because you've got the environment variables there and the volume mount all set up ready.

So this project now is actually running in a container.

I can refresh, I can do just like as I normally would if I was working on an Next.js project.

I can go into the app folder, I can go into the page here.

What do I do?

Hello world.

Okay save that.

And sure enough I can't spell, but it's saying hello world.

So you can see there that it's just like you would normally be developing locally.

There's no sort of real noticeable difference to what you were working on.

Of course you could set up, you'd have a whole lot of containers running, you could actually have and have multiple running as long as you're not using the same ports.

So it's no different than running locally on your machine.

Should I put a frog in there?

Good idea Chelsea.

Okay, alright.

There's a frog.

Oh frog time's sakes.

Okay so that's there.

Of course, got a little emoji there.

Okay, this project is of course is, like I said, running in a container.

And of course if I stop that container then it's going to stop working.

So let's just pause.

Let's stop everything actually.

Stop it.

Once that finishes.

Straight away PS code realizes, hey something's gone wrong.

like I was saying before, it's using that first code server so it's requiring that to be running to be able to connect to.

Okay so I shouldn't be able to access this anymore.

It's just going to spin the wheel and it's not going to load for a time out.

Same for the database.

We've got a question there in the chat.

Are containers used in a production environment?

Yes they can.

So you can get quite complicated setups.

Maybe you've already got a project that is already using Docker in your production environment.

Maybe you've got a mono repo, maybe with sort of three different, maybe a server, a client, a database.

Actually let's pull one up.

Let's make this actually a bit more interactive.

We'll pull one up rather than just talk about it.

So what have I got here?

This is the project I made a while ago.

So I'll clone this down for my local machine and I'll walk through how it's kind of different to say like a traditional sort of docker setup and something you might be have in production with docker containers.

So I'm going to clone that down.

Okay so let's set the term.

Let's set folder, type in code.

All right okay it's got a workspace file it doesn't really make too much difference there um but we can see there uh it's got just the three different folders so the client see the database um and the root there which is the top level so this is a workspace file I don't know if you've used that before but um it just makes it a little bit easier to separate out all the three different parts of a mono repo.

Okay, so this client, we have a docker file for your client, we have a docker file for the server, it's running a sort of pin sort of stack, so postgres, express, react, and node, and if we go down to here we can see we have a docker compose file.

Okay so I can start this up just as I would normally.

I can go docker-compose up and get that actual project up and running in a container which is perfectly fine.

That's a that's a great way to to work and I probably wouldn't use a dev container as such if I had a project like this but we can.

So we're going to show you how you can do that if you want to.

So the easiest way to probably do that is we'll just close this.

We're going to jump back into the terminal here and I'm going to use docker compose up and build.

Okay so it's got a database there.

Setting up a little configuration.

Just waiting on the client.

Okay, pretty typical.

So in a production environment, of course, you're going to want to have sort of like a container like this.

The good thing about it is you'd be able to, you know, set up a different container for each of the different parts of the the application.

It should be sitting on their own version and of course you know if you were setting up something really big and chunky you'd probably use some sort of container management and you may end up having maybe two versions of the API and two versions of the client or something like that just for in terms of ability to handle larger loads maybe.

But that's not really what we need on our local setup and so sometimes we may want to actually see what is actually happening on a container.

So we've got a long-running process that maybe is timing out and say node or something like that and we can actually attach to that container with a whole dev container configuration setup.

So let's do that.

I'm gonna create a new one, window, command + shift + P and I'm gonna attach to a running container.

So cool enough, it just shows straight away we've got those three running containers, we've got the client, we've got the server the database.

So I can just jump straight into say the server here.

Okay, so sets up the VS Code server.

Okay, give it a sec.

Okay, it's having a little bit of trouble there looking at the directory, that's okay.

What I can do is I can open the folder and actually attach to it.

And that should be, that looks like the right one.

So it's attached to that.

It's running under the dev container there.

I can do this and I have 10 I can see what I'm actually running under there.

You can see I've got a very basic looking terminal here.

There's obviously no my zsh or anything like that.

So it's not getting the pretty colors or anything but it's a very basic sort of. So this container is available there and a common thing that you're going to want to do is try and I guess do some debugging.

Ok so we've got the router here and in it we've got a get request.

I'm going to put a breakpoint in there and I'm now going to load up the project again.

How do I know where the project's running?

Well, I'm going to have to step back and have a look at the actual files.

Maybe open up a new window.

Open that recent one.

And in here we've got Dockerfile.

So okay our project here runs on port 3000.

So I'm going to Again, just take a look.

Hopefully that'll run.

Here we go, took a little while.

But you can see we've got a sort of website with some dogs wearing sunglasses, hats etc.

So it's just like a little shop that you'd be able to purchase clothes for your dog.

Okay so that's that project there.

What we can do is that we can actually try and get this to be able to debug.

So we have the docker and we can attach the node there.

OK, let's see if this works.

I didn't preset this up so it works, it works, it doesn't!

It's a fail.

It doesn't look like it's actually working.

Nope, no I was wrong.

It has, it's attached.

Took a while there.

But you can see there when we have done the get request and what it's done is it's read my breakpoint there.

is sitting in this container and I've been able to connect to it.

I can see if there's any parameters being passed in.

So request our query there.

We've got direction and sort order and we can step through which is pretty cool.

So that way we can actually debug our running a whole item just as if it was sitting on a local machine from the Docker containers themselves.

So you can also set up these dev containers here, so you can actually set up this project now to use the dev containers.json file as well.

Why you'd probably want to do that is if you had some extra requirements, those could be something like you want a command line tool to be available only in dev but not on production.

What you can do is you can set up the dev container file, attach it to the Docker file and because the dev container runs as before it when you're running in a development environment, you can make it install those feel-like tools but only in dev.

OK and then use the existing Dockerfile for when it's actually creating container for production.

Pretty nice.

OK we've sort of got the debugger working.

I'm just going to make that run.

Okay, so my zooming, zooming.

I do have a load of there, it's just a little bit hard to see.

I should probably remove my breakpoint.

Okay, cool.

Alright, so that's all working totally.

So like I said, let's close this and move the connection there and we'll go back to the file system.

Okay, so I'm attached to this container and say I want, like I said, I wanted to make the the container there.

Dev containers.

And you can see there's a lot of choices here.

Because I'm already running it as one.

I have to actually close, go back to the previous window.

There's this one.

And I can add a dev container.

So this is no different than pretty much what we were before in the first Next.js project.

And you can use one of the predefined configurations that we were happy for.

Or we can use the existing docker-compose file.

So this project is the designer of the doggies is one and that's got the docker-compose file there.

So if I select it, Okay, now there is one problem with dev containers is that they only can be one window per application.

So in this case I would need two configured, one maybe for the client and one for the server.

I'm just going to do the client for now.

And I wanted these common utilities because I I want a bit of a bit of flair on my terminal.

OK, so we've got the defaults there.

Let's keep those.

So again, I can reopen in the container.

Let's wait for that to load.

Doesn't matter if you're late.

course you can come back and watch it again.

What have I done?

One window.

Good question.

Why have I not tried Twitch?

I just haven't tried it yet.

This is my first go so I'm trying out YouTube for starters but I was aware I've got all my previous videos and I'll probably take this stream as well and also might package it up in a blog post too.

Alright, okay so what happened there?

I think I had a little bit of an issue.

That's okay.

Let's use our problem solving skills and try and figure out what has actually happened.

Wait a minute, Windows open.

Load the window.

That's the previous one.

Okay, what did I do wrong?

Okay, we wanted the client.

I don't see it there.

I find the.

.

.

Okay.

So we've got the demo designer doggies.

I'm going to open up this client folder.

Yep, that's all cool.

Okay, I might have to do that again.

I believe the problem I had was because I was in the top level and I actually need to be like I said can only be one window.

So I actually needed to have that configuration file.

I needed to have it in the actual client folder.

So I wanted to try that again.

So I can go from the Dockerfile.

Add these common utilities, defaults there and I should be able to reopen it in a container.

I just waiting for it to do the install.

Absolutely now, it does feel like the old days.

for the audience.

It was actually Macavari there.

What do people prefer?

Would you rather me just keep on YouTube or Twitch or both?

Because I guess that's an option too isn't Totally open the suggestions.

Cool.

Go.

Okay cool.

Like I said, you're a container now.

you've got the likes of it pointing to the existing Dockerfile.

And you can see there, it's got the Dockerfile, it's pointing to this one here, and we've now got the common utilities.

So if I create a new terminal here, I don't know if it's actually created the right console there, but you can see there I've got just the git just like I would normally sitting and running in this container and I can see the files are there and check them in.

cool.

Alright.

Yes I could have the best of both worlds Blender.

Yeah that might be I think the winner.

Be where everyone is.

Okay.

I have a cut with everything pretty much I think.

So the main key things that you are going to want to configure with your dev containers there again is the porting the ports.

So you can do it through the user interface.

So you are actually able to port a port, send the port number etc.

And that will work fine.

But I'd recommend you do it in the configuration file because of course you want it to be able to work for I guess your other teammates or other developers they want to be able to just get started and get the application running and that will be a bit of a roadblocker there if the ports aren't folded and they won't be able to sort of view the I guess the database or the API etc so you need those ports open best to keep that configuration in that dev container file and of course that's not going to impact your docker file, so if the project is already running in production etc it's just sort of sitting separate to it.

The other cool thing with dev containers is that you can actually install extensions for a container.

You know when I was going at the start where we were talking about the actual on the left was the browser page on the left you've got the VS code there you know with the extensions etc and a key thing there you've got a workspace extension so the cool thing is so if the project is you know where it's gonna need some of these extensions you can actually configure it to be set up so that when someone else comes along to start the project up they can have those extensions already ready to go installed on their machine as well.

So let's do that.

People can see that.

Okay so you got no no containers on there as such.

So say if I wanted to have I don't know what's something good.

A spellcheeker.

Okay.

No, no, wait, wait, wait, wait.

Look at the icons they tell you.

See?

Yeah.

What's something else?

Docker?

something that's actually probably, either the normal one would be maybe prettier.

That's a pretty common one.

So I can install in that dev container there.

And so then your project would then have that listed.

So if we see that, that's sort of locally installed.

And now I've got this dev container here.

Great for when you want to get some started with running up on a project and have all those extensions there they're going to help them with their development.

Cool cool lots of comments here.

Uh Yeah absolutely, just get more of a stream when you're working on a project you're just chilling.

That's a great idea.

Yeah I could do a bit of a mix of both.

Code was yeah, working on doing our projects to game dev.

Cool, I guess different flavors for different things that you're doing.

Cool, okay so like I said you can install these extensions and they're now going to be, once you check that devcontainer.

json file in, that of course is then going to be able to be pulled down by somebody else and you'd be able to have all those things like all your extensions there.

I'll show you there in the dev container file.

We should have the extensions.

Use it.

Maybe it's Docker.

Maybe it's because I already had it installed.

But generally you'd have it in that dev containers there and it would sit under there.

especially under the customizations.

Okay, another thing again going back over again was the post command, post create command.

It's like I said you could have that install all your npm modules.

Again, nice developer experience, you're not having to go to the project and of course, I'm happy to do the Impairments Store, you can have it already at rock.

What else can you have?

Let's do one other thing.

Close all these down so that you can see.

What's running?

stop button.

I'm sure it will stop.

Cool.

Of course, when you stop VS Code, that's also going to stop those containers as well, which is quite nice actually.

It means that you're not burning resources or killing your battery if you're on a laptop.

Okay, so I wanted to show you code spaces because that's also really cool in that you can actually go through and of course be developing on another machine.

Okay so code.

I'm going to open up that first project we had.

Okay, so I'll reopen this container.

Okay, that's better than me, it didn't work.

How's that?

That's good.

OK, so I'll reopen this container.

OK, that's better, the mute didn't work.

How's that?

That's better.

OK, cool.

OK.

OK, so I've got this project.

It's sitting in my local machine and like I said I can open this in a code space.

Okay.

Okay.

It must be somewhere, you're running it.

Ah here we go, I had to find an actual option.

Ok so we've got this, click on the button down the bottom left here, let's do it again.

Click on the button down the bottom left and you can create a new codespace.

So this is going to set that up on.

Now you do have to have a previously set up project.

I'll use the demo designer doggies.

That's already publicly available.

And you've got a choice there.

Ah, AdGigs.

We'll try that one.

this is very much that same sort of experience where we're still in VS Code.

But we are now actually again talking to a container that's sitting on some machine in the cloud which is pretty awesome.

Okay, it's got a funny name, improved in England.

Okay so that container is like running up in the cloud there.

If I go to that same might get up.

Okay.

Just trying to remember where the code space is, let it hit them.

There we go.

So over here.

So the cool thing about it, like I said before, is you can actually run this in a browser.

I'm trying to open it in the browser, it's not leading me.

There we go, open them.

So you get your open browser.

And they should look very familiar.

Cool.

So again, we've got a whole development environment.

I mean, you could potentially use this on an iPad or some other device, maybe a Chromebook something like that you'd be able to do your development there, check it in, commit it, make it available to others to see.

So let's see, you got the whole configuring up of that of course and port forwarding etc but yeah we can run this whole application sitting in the cloud here.

I've got a nice little client here, I've got some, you can see my username there, you can see that's running in that browser.

Again, lots of potential there to do all sorts of things.

Cool.

Questions?

Does anyone have any questions?

No, hopefully I've done a good job then.

Is there a cost to use this?

Definitely for the Codespaces there is a cost.

I think you do get a certain amount of free time.

But can't remember off the top of my head the cost?

No, I'm sorry.

180 included hours for Codespace with GitHub Pro.

Well, yeah, that's a really great tool.

Especially if you're working on a project, maybe you're working on a branch, you'd be able to spin this up in the code spaces here.

And then you would actually be able to share that with somebody else.

You know, actually specifically talk through the actual problem and have it running so it's on the cloud there.

Easy to view, easy to see.

I hope you all enjoyed that.

Awesome.

Alright, I'll try and do some more of these.

A few more topics, but if there's anything that you specifically want to me to go over, I'd be happy to do that as well.

Arduino?

I haven't got any Arduino, sorry.

If you think of anything that you would like me to go over, I would be happy to do another stream.

I have a little time on my hand, so let's make the most of it.

Catch you all later.

{% include "promos/youtubesubscribe.njk" %}
