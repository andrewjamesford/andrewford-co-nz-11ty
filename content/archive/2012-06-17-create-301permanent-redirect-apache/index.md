---
title: "Create a 301/permanent redirect on Apache"
date: "2012-06-17T10:44:49+00:00"
template: post
draft: false
slug: "/2012/06/17/create-301permanent-redirect-apache/"
category: "article"
tags:
  - blog
  - development
description: "After running my blog for Vote Daily Deals on a sub-domain for some time, some SEO suggestions I've been given is it's better to have your blog as part of the main URL. With the separate sub domain they are treated as two separate URLs in Google's indexing."
---

After running my blog for Vote Daily Deals on a sub-domain for some time, some SEO suggestions I've been given is it's better to have your blog as part of the main URL. With the separate sub domain they are treated as two separate URLs in Google's indexing.</p>

So after moving the blog into a sub-directory of votedailydeals.co.nz I need to ensure Google can redirect the existing indexed URL's you need to create an ".htaccess" file to 301 (permanently redirect) to the new address.

For example:

```html
http://blog.votedailydeals.co.nz/welcome-to-vote-daily-deals/
```

redirect to

```html
http://votedailydeals.co.nz/blog/welcome-to-vote-daily-deals/
```

Here is a screencast of the ".htaccess" file I created and how to get the existing links indexed by Google.

https://www.youtube.com/watch?v=KfSpBe-qUoA

The syntax to retrieve all the indexed links on Google is:

```config
site:example.com
```
