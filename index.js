const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const SECRET = process.env.WEBHOOK_SECRET || null;

app.get("/", (req, res) => {
  res.send("✅ TradingView → Telegram bot is running.");
});

app.post("/", async (req, res) => {
  try {
    if (SECRET && req.body.secret !== SECRET) {
      return res.status(401).send("Unauthorized: wrong secret");
    }

    const message = req.body.message || "⚠️ No message content received.";
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true
    });

    res.send("Message sent to Telegram ✅");
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).send("Error sending message");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
