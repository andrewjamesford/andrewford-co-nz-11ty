---
title: "Bitbucket Pipeline"
date: "2018-07-01T07:33:55+12:00"
template: post
draft: false
slug: "2018/07/01/bitbucket-pipeline"
category: "article"
tags:
  - bitbucket
  - build
  - docker
description: "Bitbucket Pipeline - Your own personal docker builds in the cloud"
---

Over the weekend I used [Docker Pipelines](https://bitbucket.org/product/features/pipelines) to build and deploy a personal project to my Raspberry Pi (which I use as an [Apache](https://httpd.apache.org/) server and a [Pi-hole](https://pi-hole.net/) -network wide ad-blocker/site blocker).

A pipeline build for Bitbucket is configured using a single file in your Git repository `bitbucket-pipelines.yml`. If your familiar with Docker it looks like a [Dockerfile](https://docs.docker.com/engine/reference/builder/). It defines how Docker can build in my case a simple ReactJS app using NodeJS and deploy the production files to my Raspberry Pi server.

Now once configured whenever I push new changes to the Git Repository on [Bitbucket](https://bitbucket.org/) a new build is kicked off and deployed. This way I have no need for a build to happen on my local machine or the server. Very handy if you need to make a critical fix, it can be made on Bitbucket in the browser and automatically deployed.

Bitbucket Pipelines saves you having to setup the likes of [Jenkins](https://jenkins.io/) and configuring Docker with it's Pipelines. With 50 minutes free per month, it is well suited to small projects with quick build times.
