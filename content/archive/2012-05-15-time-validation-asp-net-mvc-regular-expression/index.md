---
title: "Time validation in ASP.Net MVC using a regular expression."
date: "2012-05-15T12:52:32+00:00"
template: post
draft: false
slug: "/2012/05/15/time-validation-asp-net-mvc-regular-expression/"
category: "article"
tags:
  - .Net
description: ""
---

Just a quick tip for Time validation in ASP.Net MVC for your data model using a regular expression.

Place the following in your model:

```
[DisplayFormat(ApplyFormatInEditMode = true,
DataFormatString = &quot;{0:HH:mm}&quot;)]
[RegularExpression(@&quot;^(?:0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$&quot;, ErrorMessage = &quot;Invalid time.&quot;)]
public DateTime? YourDateTime { get; set; }
```

This will perform the validation for 24 hour time in the format HH:mm

A big thanks to Markus Wulftange (Gumbo on Stack Overflow) for the tip. Here is his original answer he [posted](http://stackoverflow.com/a/884854).
