import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
const CHAT_ID   = (process.env.TELEGRAM_CHAT_ID || "").trim();
const SECRET    = (process.env.WEBHOOK_SECRET || "").trim(); // اختياري

app.get("/", (_, res) => res.send("✅ TradingView → Telegram bot is running."));

app.post("/webhook", async (req, res) => {
  try {
    // تحقّق اختياري للسرّ
    if (SECRET && (req.body?.secret || "").trim() !== SECRET) {
      return res.status(401).json({ ok: false, description: "Unauthorized (bad secret)" });
    }

    const text = (req.body?.message || "📢 Test").toString();

    // أرسل لتليجرام
    const tg = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });

    const result = await tg.json();
    // رجّع رد تيليجرام كما هو لسهولة التشخيص
    return res.status(result.ok ? 200 : 500).json(result);
  } catch (e) {
    return res.status(500).json({ ok: false, description: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
