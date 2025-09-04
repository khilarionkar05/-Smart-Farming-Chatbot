const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


const BOTPRESS_URL = "http://localhost:3000";
const BOT_ID = "my-bot";   
const USER_ID = "web-user1"; 

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message?.trim()) {
      return res.status(400).json({ reply: "⚠️ Please type a message." });
    }

    const bpRes = await fetch(
      `${BOTPRESS_URL}/api/v1/bots/${BOT_ID}/converse/${USER_ID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "text", text: message }),
      }
    );

    const data = await bpRes.json();
    const reply =
      data?.map((x) => x.text).filter(Boolean).join("\n") ||
      "⚠️ No response from Botpress.";
    res.json({ reply });
  } catch (err) {
    console.error("Botpress proxy error:", err);
    res.status(500).json({ reply: "⚠️ Error connecting to Botpress server." });
  }
});

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Web server running at http://localhost:${PORT}`);
});
