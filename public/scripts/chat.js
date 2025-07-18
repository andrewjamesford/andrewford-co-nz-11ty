function initializeChat() {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");

  const sendButton = document.getElementById("chat-send");

  const sendMessage = async () => {
    if (!input.value.trim()) return;

    const rawMessage = input.value.trim();

    // Sanitize and validate the message
    const userMessage = sanitizeMessage(rawMessage);

    // Check minimum length requirement
    if (userMessage.length < 10) {
      appendMessage(
        "Bot",
        "Please enter a message with at least 10 characters."
      );
      input.value = "";
      return;
    }

    appendMessage("You", userMessage);
    input.value = "";

    // Show loading indicator
    const loadingMessageElement = appendLoadingMessage();

    try {
      const response = await fetch(
        `${CONFIG.API_URL}/.netlify/functions/chatrag`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userMessage }),
        }
      );

      const data = await response.json();

      // Remove loading indicator and show actual response
      removeLoadingMessage(loadingMessageElement);
      appendMessage("Bot", data.answer || "No response.");
      appendSourceLinks(data.sources);
    } catch (error) {
      // Remove loading indicator and show error
      removeLoadingMessage(loadingMessageElement);
      console.error("Error fetching response:", error);
      appendMessage(
        "Bot",
        `Error: ${error.message || "Unable to fetch response."}`
      );
    }
  };

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendMessage();
    }
  });

  sendButton.addEventListener("click", async () => {
    await sendMessage();
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

  function appendSourceLinks(sources) {
    if (!Array.isArray(sources)) return;
    sources.forEach((url) => {
      const messageContainer = document.createElement("div");
      messageContainer.className = "chat-message bot";

      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";

      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "chat-source-link";
      link.textContent = "View Source";

      bubble.appendChild(link);
      messageContainer.appendChild(bubble);
      messages.appendChild(messageContainer);
      messages.scrollTop = messages.scrollHeight;
    });
  }
  function appendLoadingMessage() {
    const messageContainer = document.createElement("div");
    messageContainer.className = "chat-message bot loading-message";

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble loading-bubble";

    // Create loading dots animation
    const dots = document.createElement("span");
    dots.className = "loading-dots";
    dots.innerHTML =
      "<span>&bull;</span><span>&bull;</span><span>&bull;</span>";

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

  function sanitizeMessage(message) {
    // Use DOMPurify to sanitize the message if available
    let sanitized;

    if (typeof DOMPurify === "undefined") {
      throw new Error(
        "DOMPurify is not available. Please include DOMPurify for sanitization."
      );
    }

    // Use DOMPurify for robust sanitization
    sanitized = DOMPurify.sanitize(message, {
      ALLOWED_TAGS: [], // Strip all HTML tags
      ALLOWED_ATTR: [], // Strip all attributes
      KEEP_CONTENT: true, // Keep text content
    });

    // Limit length to prevent extremely long messages
    if (sanitized.length > 500) {
      sanitized = sanitized.substring(0, 500) + "...";
    }

    // Trim whitespace and normalize line breaks
    sanitized = sanitized.trim().replace(/\s+/g, " ");

    return sanitized;
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
    chatContainer.style.display = "flex";
    // Small delay to ensure display change takes effect before animation
    setTimeout(() => {
      chatContainer.classList.add("show");
    }, 10);
  }

  // Load chat script if not already loaded
  if (!window.chatInitialized) {
    initializeChat();

    // Add welcome message when chat is first opened
    const messages = document.getElementById("chat-messages");
    if (messages.children.length === 0) {
      const messageContainer = document.createElement("div");
      messageContainer.className = "chat-message bot";

      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      bubble.textContent = `Hi, I'm Andrew's Chatbot 👋🏻
        How can I help YOU learn about web and AI development?`;

      messageContainer.appendChild(bubble);
      messages.appendChild(messageContainer);
    }

    window.chatInitialized = true;
  }
});
