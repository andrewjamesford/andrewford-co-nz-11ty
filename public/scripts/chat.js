function initializeChat() {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");

  input.addEventListener("keypress", async (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      const userMessage = input.value.trim();
      appendMessage("You", userMessage);
      input.value = "";

      try {
        const response = await fetch("/.netlify/functions/chatrag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userMessage }),
        });

        const data = await response.json();
        appendMessage("Bot", data.answer || "No response.");
      } catch (error) {
        appendMessage("Bot", "Error: Unable to fetch response.");
      }
    }
  });

  function appendMessage(sender, text) {
    const message = document.createElement("div");
    message.textContent = `${sender}: ${text}`;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
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
