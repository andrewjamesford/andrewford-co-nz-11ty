document.getElementById("chat-toggle").addEventListener("click", () => {
  const chatContainer = document.getElementById("chat-container");
  chatContainer.style.display =
    chatContainer.style.display === "none" ? "block" : "none";

  // Load chat script if not already loaded
  if (!window.chatInitialized) {
    const script = document.createElement("script");
    script.src = "/path/to/chat.js"; // Replace with the actual path to your chat logic
    script.onload = () => {
      window.chatInitialized = true;
      initializeChat(); // Function defined in chat.js to set up event listeners
    };
    document.body.appendChild(script);
  }
});
