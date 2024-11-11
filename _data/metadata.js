require("dotenv").config();

module.exports = {
  title: "Andrew Ford",
  fullUrl: process.env.SITE_URL,
  language: "en",
  description:
    "Andrew Ford is the host of Code with Andrew Ford, a YouTube channel dedicated to teaching you how to code. He is also a full-stack web developer, technical analyst and an educator.",
  author: {
    name: "Andrew Ford",
    email: "me@andrewford.co.nz",
    url: process.env.SITE_URL + "/about/",
  },
};
