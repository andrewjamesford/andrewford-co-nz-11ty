---
title: "Custom Social Share Buttons Guide"
date: "2011-10-05T21:23:47+00:00"
template: post
draft: false
slug: "/2011/10/05/custom-share-tweet-buttons-for-facebook-and-twitter/
wordpress_connect_custom_fields_like_button_enable"
category: "article"
tags:
  - custom
  - Facebook
  - guide
  - share
  - tweet
description: "I came across an issue with a design, where the client didn't want the standard Facebook Like and Twitter tweet buttons on their site. Here's how I created my own custom share buttons."
---

I came across an issue with a design, where the client didn't want the standard Facebook Like and Twitter tweet buttons on their site. Here's how I created my own custom share buttons.

Lets start with Facebook. There are a couple of items that will need to be added into the header.

**Step 1:** Add the following meta tags (if they don't already exist).

```html
&lt;meta name="title" content="This is the Title"&gt; &lt;meta
name="description" content="This is a description"&gt; &lt;meta name="keywords"
content="keywords here"&gt;
```

**Step 2:** Add the Facebook share script

```html
&lt;script
src="//static.ak.fbcdn.net/connect.php/js/FB.Share"&gt;&lt;/script&gt;
```

**Step 3:** Add the following to your custom Facebook share link

```html
<a
  name="fb_share"
  type="button"
  href="http://www.facebook.com/sharer.php"
  target="_blank"
  class="socialLinkFacebook"
  title="Facebook"
  >Facebook</a
>
```

For Twitter follow these steps.

**Step 1:** Create a custom Twitter tweet link

```html
<a
  href="https://twitter.com/share?url=mydomain.com"
  class="socialLinkTwitter"
  title="Twitter"
  target="_blank"
  >Twitter</a
>
```

**Step 2:** Add Javascript window popup click handler function (you'll need jQuery linked already for this javascript)

```html
$('.socialLinkTwitter').click(function (e) { e.preventDefault(); var
sTwitterShare = $(this).attr('href');
window.open(sTwitterShare,'Share','width=550,height=450'); });
```
