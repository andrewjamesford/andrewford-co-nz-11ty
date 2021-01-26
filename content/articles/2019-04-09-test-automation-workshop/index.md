---
title: "Test Automation Workshop"
date: '2019-04-09T16:35:37Z'
template: post
draft: false
slug: '2019/04/09/test-automation-workshop'
category: article
tags:
- testing
- automation
- workshop
description: "Some key take aways from the Test Automation Workshop I attended"
--- 

Today I attended a Test Automation workshop (@ Wintec House) run in conjunction with [Callaghan Innovation](https://www.callaghaninnovation.govt.nz/) & [Hypr](https://www.hypr.nz/). It was a hands-on workshop where we covered some theory, did some activities that reinforced the theory and finished off with some sample code exercises.

Some key learnings from the workshop where:

- The shape of your testing should look more like a [pyramid rather than an ice cream cone](https://watirmelon.blog/testing-pyramids/)
- Small batches of work are far more efficient to get through the development cycle then large batches
- Test automation is best done incrementally with a refactor, you need only start with the code you are changing
- [Specification by Example](https://gojko.net/books/specification-by-example/) is a collaborative approach to defining requirements and business-oriented functional tests for software products based on capturing and illustrating requirements using realistic examples instead of abstract statements
- It's a long road to adding testing to your existing code base, it can take upwards of a year or more to get full coverage
- Where possible use your IDE to automatically refactor, it's much safer than "find and replace"
- The difference between Fakes & Mocks in testing - A fake has the same behavior as the thing that it replaces, a mock has a set of expectations about calls that are made. If these expectations are not met, the test fails