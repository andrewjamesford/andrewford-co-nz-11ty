import dotenv from "dotenv";
dotenv.config();

export default {
  title: "Andrew Ford",
  fullUrl: process.env.URL || "https://andrewford.co.nz",
  apiUrl: process.env.URL || "https://api.andrewford.co.nz",
  language: "en",
  description:
    "Andrew Ford is the host of Code with Andrew Ford, a YouTube channel dedicated to teaching you how to code, a full-stack web developer, mentor and an educator.",
  author: {
    name: "Andrew Ford",
    email: "me@andrewford.co.nz",
    url: `${process.env.SITE_URL || "https://andrewford.co.nz"}/about/`,
  },
  gTag: process.env.GTAG,
  // Environment-specific URLs for frontend
  environment: process.env.NODE_ENV || "development",
  serverlessUrl:
    process.env.SERVERLESS_URL ||
    process.env.NETLIFY_URL ||
    process.env.SITE_URL ||
    "http://localhost:8888",
  // Add any other environment variables you need on the frontend
  features: {
    analytics: process.env.NODE_ENV === "production",
    debug: process.env.NODE_ENV === "development",
  },
};
