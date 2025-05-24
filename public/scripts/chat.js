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
