---
title: Make a LastFM widget for your website using Serverless functions
date: "2023-02-16T04:01:37Z"
template: post
draft: false
slug: "lastfm-widget-netlify-functions"
category: article
tags:
  - netlify
  - lastfm
  - widget
  - serverless
  - serverless functions
description: "Here is the latest transcript of my guide on how to make a LastFM widget using Serverless (Netlify) functions to show the latest track played on your website."
---

Would it not be great to share what I'm listening to on my website? I've been using [LastFM](https://www.last.fm) for years to track my listening habits and I thought it would be great to use their API to do so. The hard part though was my site is "static" built with [eleventy (11ty)](https://www.11ty.dev), it's a static site generator which means a build process puts all the files together and turns it into HTML every time I push commits to GitHub. The files are static and can't dynamically change like a Node.js or Wordpress website. So I needed a way to get the data from LastFM and display it on my site. I could have used a JavaScript fetch request to get the data, but that would mean exposing my API key to the world. I needed a way to get the data securely and Netlify (serverless) functions was the answer.

Here is the transcript from my [latest how-to guide](https://www.youtube.com/embed/okbDFf-eIqk) on how to make a [LastFM widget](https://www.last.fm) for your own website showing your last played song that uses [Netlify functions](https://www.netlify.com/products/functions/) (serverless functions).

youtube.com/embed/okbDFf-eIqk

---

Hi everyone, it's Andrew here and I'm here to show you a new tutorial on how to build a last FM widget on your website. Okay, here's the last FM widget I built. It displays the last track I played that has been ["scrobbled"](https://www.businessinsider.com/guides/tech/what-is-last-fm-scrobbling).

Currently, it's showing a track by [Foals](https://www.last.fm/music/Foals) and if I play another song from another album like this one from [The Beths](https://www.last.fm/music/The+Beths), next time I refresh the page on my website it will show the latest one, played or playing.

### Create a LastFM API key

We're now gonna generate the last FM API key. So here to the [last FM API website](https://www.last.fm/api/account/create). I'm gonna add that to the comments.

To generate a new API key, once that's done, give your application a name, maybe like a website widget demo. Fill in all the details. We won't be needing the call-back URL. And after hitting submit, it will create your account and display an API key.

### Create an ENV file

We're going to start by creating an ENV file. I see why I've already created one already, `.env`. You can see that. And I have added the Last FM API key. And I'm going to copy that key into that position there.

```env
LASTFM_API_KEY=ReplaceWithYourAPIKey
```

### Create a Serverless function

With Netlify, it's very easy to add serverless functions to your project. Serverless functions, also known as Functions As A Service, are a way of building and running computer programs without needing to worry about the underlying servers or infrastructure. Instead, a cloud provider takes care of managing the servers and resources, and developers can just write and deploy their code. Serverless functions are triggered by specific events or requests and can quickly execute and shut down when they're finished. This makes them efficient, cost-effective and flexible, and they're often used for tasks that don't require continuous running or need to handle a lot of traffic.

To be able to make a fetch request, I'm going to add the [Node fetch package](https://www.npmjs.com/package/node-fetch) to my project, so we can make a get request from the Last FM API to get the last played track for my account.

```sh
npm install -D node-fetch@3
```

Once we have that setup, we can create a JavaScript function to make the get request return the result. I've made my function an imported node fetch, and then made a handler function for my get request. I then pulled in my API key from the environment file that we created, and then you can see here we have a request with the API key added as a string literal. I then created a last track object and retrieved the appropriate details from the JSON data requested and finally returned the result. You can see I have my Last FM username in the string for the URL that we're calling. You will need to replace that with your own username.

```javascript
import fetch from "node-fetch";

exports.handler = async function (event, context) {
  try {
    const apiKey = process.env.LASTFM_API_KEY;
    const username = "YOUR_USERNAME";
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    const lastTrackData = data.recenttracks.track[0];

    const lastTrack = {
      artist: lastTrackData.artist["#text"],
      trackName: lastTrackData.name,
      album: lastTrackData.album["#text"],
      url: lastTrackData.url,
      albumArt: lastTrackData.image[1]["#text"],
    };

    return {
      statusCode: 200,
      body: JSON.stringify(lastTrack),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: error.message }),
    };
  }
};
```

### Fetch Data

We now have a way to retrieve our data from Last FM in a secure way, protecting our API key. I've created a JavaScript file to run after the page has loaded. This is going to grab the data from our serverless function and append it to the page.

```javascript
const loadData = async () => {
  const lastFMWidget = document.getElementById("lastFM");
  const lastFMLink = document.getElementById("lastFMLink");
  const lastFMImg = document.getElementById("lastFMImg");
  const lastFMAlbum = document.getElementById("lastFMAlbum");
  const response = await fetch(`/.netlify/functions/lastplayed`, {
    method: "GET",
  });
  const data = await response.json();

  lastFMLink.innerText = `${data.trackName} - ${data.artist}`;
  lastFMLink.href = data.url;
  lastFMImg.src = data.albumArt;
  lastFMImg.width = 64;
  lastFMImg.height = 64;
  lastFMImg.alt = `Album art for ${data.artist} - ${data.album}`;
  lastFMAlbum.innerText = data.album;
  lastFMWidget.style = "display:grid";
};

loadData();
```

You can see in my layout here I have the basic structure of the widget with display none to hide it until the content has been loaded. Each of the IDs is targeted in the JavaScript with `document.getElementByID`, or for style being set to display grid once loaded.

```html
<div id="lastFM" class="lastfm-widget" style="display:none">
  <img
    id="lastFMImg"
    src=""
    class="lastfm-img"
    alt="Album cover art for last listened on Last.fm"
  />

  <div>
    <div class="lastfm-title">Listening to:</div>
    <div class="lastfm-link">
      <a id="lastFMLink" href="https://www.last.fm"></a>
    </div>
    <div id="lastFMAlbum" class="lastfm-album"></div>
  </div>
</div>
```

The CSS for the widget is loaded here in the CSS file for the website.

```css
.lastfm-widget {
  padding-top: 1.5rem;
  border-top: 1px solid var(--body-color-secondary);
  font-size: 0.9rem;
  line-height: 1.2;
  display: grid;
  grid-template-columns: 64px auto;
  gap: 0.5rem;
  margin: 0.75rem auto 0 auto;
}
.lastfm-img {
  border-radius: 0.25rem;
}
.lastfm-title {
  font-size: 0.7rem;
  margin-bottom: 0.2rem;
}
```

### Install Netlify CLI

To make it easier to debug any issues before you release your function, I recommend you set up the [Netify CLI](https://docs.netlify.com/cli/get-started/). Check the instructions from the [Netlify documentation](https://docs.netlify.com/cli/get-started/#installation). Let's see the notes.

```sh
npm install netlify-cli -g

```

Install the CLI tool globally by copying this command into your terminal from the notes for the command. Once installed, add the Netlify dev command to your `package.json` file like so.

```json
"scripts": {
    "dev": "netlify dev",
}
```

### Run Local

Run Netlify Dev from the command line and this will start a local server where you can run your serverless function locally. It starts up the local serverless function dev server and then it calls the NPM `start` command to start the 11ty Dev server. Check out the link in the notes below and you can see how to deploy your function.

[Netlify CLI functions](https://cli.netlify.com/commands/functions) documentation.
