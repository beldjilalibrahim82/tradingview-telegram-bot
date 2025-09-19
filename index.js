import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// استدعاء المتغيرات من Render (Environment Variables)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// مسار Webhook خاص بـ TradingView
app.post("/webhook", async (req, res) => {
  try {
    const alertMessage = req.body; // TradingView يرسل JSON هنا
    console.log("Alert received:", alertMessage);

    // إرسال الرسالة لتليجرام
    const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `📢 *إشارة جديدة من TradingView*:\n\n${JSON.stringify(alertMessage, null, 2)}`,
        parse_mode: "Markdown"
      }),
    });

    const result = await telegramRes.json();
    console.log("Telegram response:", result);

    res.status(200).send("✅ Message sent to Telegram");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("❌ Error sending message");
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
