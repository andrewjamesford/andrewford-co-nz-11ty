// Example usage of environment variables in frontend JavaScript

// Using the CONFIG object from config.njk
async function fetchFromAPI(endpoint) {
  const baseUrl =
    window.CONFIG?.ENDPOINTS?.[endpoint] || window.CONFIG?.SERVERLESS_URL;

  if (!baseUrl) {
    console.error("API URL not configured");
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/.netlify/functions/${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    return null;
  }
}

// Example: Fetch latest music
async function getLatestMusic() {
  return await fetchFromAPI("lastplayed");
}

// Example: Fetch latest videos
async function getLatestVideos() {
  return await fetchFromAPI("latestUploads");
}

// Example: Send chat message
async function sendChatMessage(message) {
  const chatUrl = window.CONFIG?.ENDPOINTS?.chat;

  if (!chatUrl) {
    console.error("Chat endpoint not configured");
    return null;
  }

  try {
    const response = await fetch(chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending chat message:", error);
    return null;
  }
}

// Environment-specific logic
if (window.CONFIG?.FEATURES?.debug) {
  console.log("Debug mode enabled");
  console.log("Available endpoints:", window.CONFIG.ENDPOINTS);
}

// Analytics only in production
if (window.CONFIG?.FEATURES?.analytics && typeof gtag !== "undefined") {
  // Track custom events
  function trackEvent(action, category = "engagement") {
    gtag("event", action, {
      event_category: category,
      event_label: window.location.pathname,
    });
  }
}

// Export functions for use in other scripts
window.API = {
  getLatestMusic,
  getLatestVideos,
  sendChatMessage,
};
