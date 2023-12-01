// index.js

import express from "express";
import { Client, middleware } from "@line/bot-sdk";
import crypto from "crypto";
import { handleEvent } from "./events/handleEvent.js";
import { isValidSignature } from "./events/isValidSignature.js";
import { logger } from "./logger/logging.js";
import e from "express";

const beaconMsg = "ビーコンを検知しました";

const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

const client = new Client(config);
const PORT = parseInt(process.env.PORT) || 3000;
const app = express();
const countMap = {}; // カウントを格納するオブジェクト
const userHwidMap = {}; // ユーザーごとに "hwid" を記録するオブジェクト

// Middleware for signature verification
app.use(middleware(config));

// ユーザーIDを格納する配列
const notifiedUserIDs = [];

app.post("/", (req, res) => {
  // Verify the signature
  const body = JSON.stringify(req.body);
  const signature = req.get("x-line-signature");

  if (!isValidSignature(body, signature, config.channelSecret)) {
    //console.log("Invalid signature");
    logger("Invalid signature", "ERROR");
    return res.status(400).send("Bad Request");
  }

  // The request is verified, proceed with processing
  const events = req.body.events;
  /*
  * console.log("=============req.body.events=============");
  * console.log(events);
  * console.log("=============いつもここまで=============");
  */
  logger(events, "INFO");

  // Promise.allで全てのイベント処理が終わるまで待機
  Promise.all(events.map((event) => handleEvent(event, countMap, userHwidMap, notifiedUserIDs, client))).then((result) =>
    res.json(result)
  );
});

app.listen(PORT);
