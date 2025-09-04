const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

function appendMessage(sender, text) {
  const el = document.createElement("div");
  el.className = `message ${sender}`;
  el.textContent = text;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  // temporary “thinking…” bubble
  const thinking = document.createElement("div");
  thinking.className = "message bot";
  thinking.textContent = "🤔 Thinking…";
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // same-origin request → no CORS issues
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    thinking.remove();
    appendMessage("bot", data.reply || "⚠️ No reply received.");
  } catch (err) {
    console.error(err);
    thinking.remove();
    appendMessage("bot", "⚠️ Error connecting to server.");
  }
});
