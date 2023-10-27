//ログの機能作ります。

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

// ユーザーIDを格納する配列です
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

function handleEvent(event) {
  if (event.type === "message") {
    console.log("テキスト送ったよ");
    client.replyMessage(event.replyToken, {
      type: "text",
      text: event.message.text,
    });

  //Beaconを受信したとき
  } else if (event.type === "beacon") {
    console.log("beaconを検知しました");
    const hwid = event.beacon.hwid; //　ハードウェアIDを取得
    const userID = event.source.userId; // ユーザーIDを取得

      // ユーザーごとに "hwid" を格納するオブジェクトを初期化
    if (!notifiedUserIDs[userID]) {
      notifiedUserIDs[userID] = [];
    }

    if (hwid === "017190a280" && notifiedUserIDs.indexOf(userID) === -1) {
      // 特定の "hwid" かつ未通知のユーザーに対する条件分岐
      console.log("ビーコン017190a280を検知");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "ビーコン017190a280を検知",
      });
      // ユーザーIDを通知済みリストに追加
      notifiedUserIDs.push(userID);
      // ユーザーごとに "hwid" を記録
      notifiedUserIDs[userID].push(hwid);


    } else if (hwid === "0171c239b0" && notifiedUserIDs.indexOf(userID) === -1) {
      // 他の "hwid" かつ未通知のユーザーに対する条件分岐
      console.log("ビーコン0171c239b0を検知");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "ビーコン0171c239b0を検知しました",
      });
      // ユーザーIDを通知済みリストに追加
      notifiedUserIDs.push(userID);
      // ユーザーごとに "hwid" を記録
      notifiedUserIDs[userID].push(hwid);


    } else if (notifiedUserIDs[userID].indexOf(userID) !== hwid && notifiedUserIDs.indexOf(userID) !== -1) {
      // 既に通知済みのユーザーにはメッセージを送信
      console.log("2度目です。");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "2度目です。"+ hwid,
      });
    }
  } else {
    console.log("受信失敗");
  }
}

// Signature verification function
function isValidSignature(body, signature, channelSecret) {
  const hash = crypto
    .createHmac("sha256", channelSecret)
    .update(body)
    .digest("base64");
  return hash === signature;
}
