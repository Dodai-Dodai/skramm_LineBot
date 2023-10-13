import express from "express";
import { Client, middleware } from "@line/bot-sdk";
const beaconMsg = "ビーコンを検知しました"
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};
const client = new Client(config);
const PORT = parseInt(process.env.PORT) || 3000;
const app = express();
app.post("/", middleware(config), (req, res) => {
  //リクエスト元のIPアドレスを取得
  console.log("=============ip=============");
  console.log(req.ip);
  console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  console.log("=============req.body=============");
  console.log(req.body);
  console.log("=============req.body.events=============");
  console.log(req.body.events);
  console.log("=============ここまで=============");

  //署名を検証して正当なリクエストかどうか確認

  /*if (!client.validateSignature(req.body, config.channelSecret)) {
    return res.status(401).send("Invalid signature");
  }
  }*/

  // Promise.allで全てのイベント処理が終わるまで待機
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});
app.listen(PORT);
function handleEvent(event) {
  if (event.type == "message" || event.message.type == "text") {
    client.replyMessage(event.replyToken, {
      type: "text",
      text: event.message.text,
    });
  } else if (event.type == "beacon") {
    console.log("beaconを検知しました");
  }
}