const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post("/webhook", async (req, res) => {
  try {
    const { symbol, price, message } = req.body;

    const text = `
📢 ${message}
🔹 الزوج: ${symbol}
💰 السعر: ${price}
⏰ ${new Date().toLocaleString()}
    `;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML"
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error sending message:", error.response ? error.response.data : error.message);
    res.status(500).send("Error sending message");
  }
});

app.listen(3000, () => console.log("Server is running"));
