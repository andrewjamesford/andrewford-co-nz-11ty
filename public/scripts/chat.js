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

    // Create bot message container for streaming
    const botMessageElement = appendStreamingMessage();

    try {
      // Try streaming first
      const streamSuccess = await handleStreamingRequest(
        userMessage,
        botMessageElement
      );

      if (!streamSuccess) {
        // Fallback to non-streaming request
        await handleNonStreamingRequest(userMessage, botMessageElement);
      }
    } catch (error) {
      // Remove streaming message and show error
      removeStreamingMessage(botMessageElement);
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

  function formatUrlForDisplay(url) {
    try {
      const urlObj = new URL(url);
      let path = urlObj.pathname;

      // Remove trailing slash and leading slash
      path = path.replace(/^\/|\/$/g, "");

      // If path is empty, show domain
      if (!path) {
        return urlObj.hostname.replace(/^www\./, "");
      }

      // For long paths, show domain + truncated path
      const domain = urlObj.hostname.replace(/^www\./, "");
      const maxLength = 25; // Adjust based on your chat width

      if ((domain + "/" + path).length > maxLength) {
        const availableLength = maxLength - domain.length - 4; // 4 for "/.../
        if (availableLength > 8) {
          const pathParts = path.split("/");
          const lastPart = pathParts[pathParts.length - 1];
          if (lastPart.length <= availableLength) {
            return `${domain}/.../${lastPart}`;
          } else {
            return `${domain}/.../${lastPart.substring(
              0,
              availableLength - 3
            )}...`;
          }
        } else {
          return `${domain}/...`;
        }
      }

      return `${domain}/${path}`;
    } catch (e) {
      // Fallback for invalid URLs
      return url.length > 40 ? url.substring(0, 37) + "..." : url;
    }
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
      link.textContent = formatUrlForDisplay(url);

      bubble.appendChild(link);
      messageContainer.appendChild(bubble);
      messages.appendChild(messageContainer);
      messages.scrollTop = messages.scrollHeight;
    });
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

  function appendStreamingMessage() {
    const messageContainer = document.createElement("div");
    messageContainer.className = "chat-message bot";

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

  function removeStreamingMessage(messageElement) {
    if (messageElement && messageElement.parentNode) {
      messageElement.parentNode.removeChild(messageElement);
    }
  }

  function updateStreamingMessage(messageElement, text) {
    const bubble = messageElement.querySelector(".chat-bubble");
    if (bubble) {
      // Remove loading class and dots when first text arrives
      if (bubble.classList.contains("loading-bubble")) {
        bubble.classList.remove("loading-bubble");
        bubble.innerHTML = ""; // Clear loading dots
      }
      bubble.textContent = text;
      messages.scrollTop = messages.scrollHeight;
    }
  }

  async function handleStreamingRequest(userMessage, botMessageElement) {
    return new Promise((resolve) => {
      try {
        // Create a POST request with streaming headers
        fetch(`${CONFIG.API_URL}/.netlify/functions/chatrag`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({ question: userMessage }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let fullText = "";

            function processStream() {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  resolve(true);
                  return;
                }

                // Decode the chunk and add to buffer
                buffer += decoder.decode(value, { stream: true });

                // Process complete SSE messages
                const lines = buffer.split("\n");
                buffer = lines.pop() || ""; // Keep incomplete line in buffer

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    try {
                      const data = JSON.parse(line.slice(6));

                      if (data.error) {
                        removeStreamingMessage(botMessageElement);
                        const errorMsg = data.error.includes("Authentication")
                          ? "API configuration error. Please check that API keys are set in the .env file."
                          : `Error: ${data.error}`;
                        appendMessage("Bot", errorMsg);
                        resolve(false);
                        return;
                      }

                      if (data.chunk) {
                        fullText += data.chunk;
                        updateStreamingMessage(botMessageElement, fullText);
                      }

                      if (data.done) {
                        if (data.sources) {
                          appendSourceLinks(data.sources);
                        }
                        resolve(true);
                        return;
                      }
                    } catch (e) {
                      console.warn("Failed to parse SSE data:", line);
                    }
                  }
                }

                return processStream();
              });
            }

            return processStream();
          })
          .catch((error) => {
            console.warn("Streaming failed, will try fallback:", error);
            resolve(false);
          });
      } catch (error) {
        console.warn("Streaming setup failed, will try fallback:", error);
        resolve(false);
      }
    });
  }

  async function handleNonStreamingRequest(userMessage, botMessageElement) {
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

      if (data.error) {
        removeStreamingMessage(botMessageElement);
        appendMessage("Bot", `Error: ${data.error}`);
        return;
      }

      // Update the streaming message with the full response
      updateStreamingMessage(botMessageElement, data.answer || "No response.");
      appendSourceLinks(data.sources);
    } catch (error) {
      removeStreamingMessage(botMessageElement);
      throw error;
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
