function initializeChat() {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");

  input.addEventListener("keypress", async (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      const userMessage = input.value.trim();
      appendMessage("You", userMessage);
      input.value = "";

      // Show loading indicator
      const loadingMessageElement = appendLoadingMessage();

      try {
        checkClientRateLimit();
        const response = await fetch(`${SITE_URL}/.netlify/functions/chatrag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userMessage }),
        });

        const data = await response.json();

        // Remove loading indicator and show actual response
        removeLoadingMessage(loadingMessageElement);
        appendMessage("Bot", data.answer || "No response.");
      } catch (error) {
        // Remove loading indicator and show error
        removeLoadingMessage(loadingMessageElement);
        appendMessage("Bot", "Error: Unable to fetch response.");
      }
    }
  });

  function appendMessage(sender, text) {
    const messageContainer = document.createElement("div");
    messageContainer.className = `chat-message ${
      sender.toLowerCase() === "you" ? "user" : "bot"
    }`;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = text;

    messageContainer.appendChild(bubble);
    messages.appendChild(messageContainer);
    messages.scrollTop = messages.scrollHeight;
  }
  function appendLoadingMessage() {
    const messageContainer = document.createElement("div");
    messageContainer.className = "chat-message bot loading-message";

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble loading-bubble";

    // Create loading dots animation
    const dots = document.createElement("span");
    dots.className = "loading-dots";
    dots.innerHTML = "<span>●</span><span>●</span><span>●</span>";

    bubble.appendChild(dots);
    messageContainer.appendChild(bubble);
    messages.appendChild(messageContainer);
    messages.scrollTop = messages.scrollHeight;

    return messageContainer;
  }

  function removeLoadingMessage(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.parentNode.removeChild(loadingElement);
    }
  }
}

document.getElementById("chat-toggle").addEventListener("click", () => {
  const chatContainer = document.getElementById("chat-container");

  // Check if chat is currently shown
  const isShown = chatContainer.classList.contains("show");

  if (isShown) {
    // Hide the chat with animation
    chatContainer.classList.remove("show");
    chatContainer.classList.add("hide");

    // After animation completes, actually hide the element
    setTimeout(() => {
      chatContainer.style.display = "none";
      chatContainer.classList.remove("hide");
    }, 300); // Match the animation duration
  } else {
    // Show the chat with animation
    chatContainer.style.display = "block";
    // Small delay to ensure display change takes effect before animation
    setTimeout(() => {
      chatContainer.classList.add("show");
    }, 10);
  }

  // Load chat script if not already loaded
  if (!window.chatInitialized) {
    initializeChat();
    window.chatInitialized = true;
  }
});

function checkClientRateLimit() {
  const now = Date.now();
  const key = "chat_requests";
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10;

  let requests = JSON.parse(localStorage.getItem(key) || "[]");
  requests = requests.filter((timestamp) => now - timestamp < windowMs);

  if (requests.length >= maxRequests) {
    throw new Error("Rate limit exceeded");
  }

  requests.push(now);
  localStorage.setItem(key, JSON.stringify(requests));
}
