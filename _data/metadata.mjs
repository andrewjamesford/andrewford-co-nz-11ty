import dotenv from "dotenv";
dotenv.config();

export default {
  title: "Andrew Ford",
  fullUrl: process.env.SITE_URL,
  apiUrl: process.env.API_URL,
  url: process.env.URL,
  language: "en",
  description:
    "Andrew Ford is the host of Code with Andrew Ford, a YouTube channel dedicated to teaching you how to code, a full-stack web developer, mentor and an educator.",
  author: {
    name: "Andrew Ford",
    email: "me@andrewford.co.nz",
    url: `${process.env.SITE_URL}/about/`,
  },
  gTag: process.env.GTAG,
};
