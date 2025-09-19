import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post("/webhook", async (req, res) => {
  try {
    const alertMessage = req.body; // TradingView alert JSON
    console.log("Alert received:", alertMessage);

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `📢 إشعار جديد من TradingView:\n${JSON.stringify(alertMessage, null, 2)}`
      }),
    });

    res.status(200).send("Message sent to Telegram");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending message");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
