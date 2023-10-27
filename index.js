//ログの機能じゃないです。hwidをユーザIDに紐づけて記録して1回目と2回目のBeacon受信をより正確にする

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

// IDに紐づけてカウントを増やすハンドラ
function incrementCount(ID) {
  if (!countMap[ID]) {
      countMap[ID] = 1;
  } else {
      countMap[ID]++;
  }
}
// IDに紐づけたカウントを取得するハンドラ
function getCount(ID) {
  return countMap[ID] || 0;
}


// ユーザーごとに "hwid" を記録する関数
function recordHwid(ID, hwID) {
  if (!userHwidMap[ID]) {
      userHwidMap[ID] = [];
  }
  userHwidMap[ID].push(hwID);
}
// ユーザーごとに "hwid" を取得する関数
function getHwid(ID) {
  return userHwidMap[ID] || [];
}



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

    if (hwid === "017190a280" && notifiedUserIDs.indexOf(userID) === -1) {
      // 特定の "hwid" かつ未通知のユーザーに対する条件分岐
      console.log("ビーコン017190a280を検知");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "ビーコン017190a280を検知",
      });
      // ユーザーIDを通知済みリストに追加
      notifiedUserIDs.push(userID);
      // ユーザーごとに受信回数を記録
      incrementCount(userID);
      recordHwid(userID, hwid);


    } else if (hwid === "0171c239b0" && notifiedUserIDs.indexOf(userID) === -1) {
      // 他の "hwid" かつ未通知のユーザーに対する条件分岐
      console.log("ビーコン0171c239b0を検知");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "ビーコン0171c239b0を検知",
      });
      // ユーザーIDを通知済みリストに追加
      notifiedUserIDs.push(userID);
      // ユーザーごとに受信回数を記録
      incrementCount(userID);
      recordHwid(userID, hwid);


    } else if (notifiedUserIDs.indexOf(userID) !== -1 && getHwid(userID) !== hwid && getCount(userID) === 3) {
      // 既に通知済みのユーザーにはメッセージを送信
      console.log("2度目です。");
      //2回目の受信であることを記録
      incrementCount(userID);
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "2度目です。"+ hwid,
      });
    } else if (notifiedUserIDs.indexOf(userID) !== -1 && getHwid(userID) === hwid) {
      console.log("既に受信済み");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "既に受信しています。"+ hwid,
      });
    } else {
      console.log("3回目以上の検知");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "無効な検知"+ hwid,
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
