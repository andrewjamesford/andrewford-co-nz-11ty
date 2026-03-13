const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export function getOpenRouterHeaders(appName) {
  return {
    "HTTP-Referer": process.env.SITE_URL || "https://andrewford.co.nz",
    "X-Title": appName || process.env.OPENROUTER_APP_NAME || "Andrew Ford Blog",
  };
}

export function getOpenRouterConfiguration(appName) {
  return {
    baseURL: OPENROUTER_BASE_URL,
    defaultHeaders: getOpenRouterHeaders(appName),
  };
}
