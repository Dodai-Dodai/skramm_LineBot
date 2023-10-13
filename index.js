import express from "express";
import { Client, middleware } from "@line/bot-sdk";
import crypto from "crypto";

const beaconMsg = "ビーコンを検知しました";

const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

const client = new Client(config);
const PORT = parseInt(process.env.PORT) || 3000;
const app = express();

// Middleware for signature verification
app.use(middleware(config));

app.post("/", (req, res) => {
  // Verify the signature
  const body = JSON.stringify(req.body);
  const signature = req.get("x-line-signature");

  if (!isValidSignature(body, signature, config.channelSecret)) {
    console.log("Invalid signature");
    return res.status(400).send("Bad Request");
  }
 
    console.log("イイネイヌ");
  

  // The request is verified, proceed with processing
  // リクエスト元のIPアドレスを取得
  console.log("=============ip=============");
  console.log(req.ip);
  console.log(req.headers["x-forwarded-for"] || req.connection.remoteAddress);
  console.log("=============req.body=============");
  console.log(req.body);
  console.log("=============req.body.events=============");
  console.log(req.body.events);
  console.log("=============ここまで=============");

  // Promise.allで全てのイベント処理が終わるまで待機
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

app.listen(PORT);

function handleEvent(event) {
  // if (event.type == "message" || event.message.type == "text") {
  //   console.log("テキスト送ったよ");
  //   client.replyMessage(event.replyToken, {
  //     type: "text",
  //     text: event.message.text,
  //   });
  // } else if (event.type == "beacon") {
    console.log("beaconを検知しました");
    client.replyMessage(event.replyToken, {
      type: "text",
      text: 'ビーコンを受信しました。' ,// ビーコン受信時のメッセージ
    });

  // }
  // else{
  //   console.log("受信失敗");
  // }
}

// Signature verification function
function isValidSignature(body, signature, channelSecret) {
  const hash = crypto
    .createHmac("sha256", channelSecret)
    .update(body)
    .digest("base64");
  return hash === signature;
}
