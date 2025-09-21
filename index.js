import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// متغيرات البيئة
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ويبهوك يستقبل الرسائل من TradingView
app.post("/webhook", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).send("Missing message field");
    }

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    // إرسال الرسالة إلى تليجرام
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("Telegram error:", data);
      return res.status(500).send("Failed to send message to Telegram");
    }

    res.status(200).send("Message sent to Telegram ✅");
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
