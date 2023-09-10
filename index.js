import express from "express";
import { Client, middleware } from "@line/bot-sdk";

const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  };
  const client = new Client(config);
  const PORT = process.env.PORT || 3000;
const app = express();


// postされたときに実行される　handleEvent関数を実行
app.post("/", middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

// サーバーを起動
app.listen(PORT);

// イベントを処理する関数
function handleEvent(event) {
    if (event.type !== "message" || event.message.type !== "text") {
      return Promise.resolve(null);
    }
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: event.message.text,
    });
  }

