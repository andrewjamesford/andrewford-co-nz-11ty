import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config();

const stylesheetVersion = fs.statSync(
  path.join(process.cwd(), "public/css/style.css")
).mtimeMs;

export default {
  title: "Andrew Ford",
  fullUrl: process.env.SITE_URL || "https://andrewford.co.nz",
  apiUrl: process.env.API_URL,
  url: process.env.URL,
  language: "en",
  description:
    "Andrew Ford is a software engineer, mentor and educator from Tauranga, New Zealand.",
  author: {
    name: "Andrew Ford",
    email: "me@andrewford.co.nz",
    url: `${process.env.SITE_URL || "https://andrewford.co.nz"}/about/`,
  },
  stylesheetVersion,
  gTag: process.env.GTAG,
};
