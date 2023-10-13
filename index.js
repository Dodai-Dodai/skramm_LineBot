import express from "express";
import { Client, middleware } from "@line/bot-sdk";

const beaconMsg = "ビーコンを検知しました";
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

const client = new Client(config);
const PORT = parseInt(process.env.PORT) || 3000;
const app = express();

app.post("/", middleware(config), (req, res) => {
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

async function handleEvent(event) {
  if (event.type == "message" || event.message.type == "text") {
    // ユーザのプロフィール情報を取得
    const userId = event.source.userId;
    const profile = await client.getProfile(userId);
    const displayName = profile.displayName;

    // プロフィール情報を使用して検証処理を行う
    if (isLINEAccount(displayName, userId)) {
      // LINEアカウントとして認識
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "LINEアカウントとして認識されました。",
      });
    } else {
      // LINEアカウントとして認識されない
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "LINEアカウントとして認識されませんでした。",
      });
    }
  } else if (event.type == "beacon") {
    console.log("beaconを検知しました");
  }
}

function isLINEAccount(displayName, userId) {
  // プロフィール情報を元に検証
  // ここで特定の条件に合致するかどうかを判定
  // 例: 特定の表示名やユーザIDを持つユーザをLINEアカウントとして認識
  if (displayName === "特定の表示名" || userId === "特定のユーザID") {
    return true;
  } else {
    return false;
  }
}
