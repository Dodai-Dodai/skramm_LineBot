//ログの機能じゃないです。hwidをユーザIDに紐づけて記録して1回目と2回目のBeacon受信をより正確にする

import express from "express";
import { Client, middleware } from "@line/bot-sdk";

//イベント読み込み
import { handleEvent } from "./events/handleEvent.js";
import { isValidSignature } from "./isValidSignature.js";

const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

const client = new Client(config);
const PORT = parseInt(process.env.PORT) || 3000;
const app = express();
const countMap = {};//カウントを格納するオブジェクト
const userHwidMap = {};// ユーザーごとに "hwid" を記録するオブジェクト

// Middleware for signature verification
app.use(middleware(config));

// ユーザーIDを格納する配列
const notifiedUserIDs = [];

app.post("/", (req, res) => {
  // Verify the signature
  const body = JSON.stringify(req.body);
  const signature = req.get("x-line-signature");

  if (!isValidSignature(body, signature, config.channelSecret)) {
    console.log("Invalid signature");
    return res.status(400).send("Bad Request");
  }

  // The request is verified, proceed with processing
  const events = req.body.events;
  console.log("=============req.body.events=============");
  console.log(events);
  console.log("=============ここまで=============");

  // Promise.allで全てのイベント処理が終わるまで待機
  Promise.all(events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

app.listen(PORT);