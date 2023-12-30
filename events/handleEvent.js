// events/handleEvent.js

import { isTimestampExpired } from "./isTimestampExpired.js";
import { incrementCount } from "./incrementCount.js";
import { getCount } from "./getCount.js";
import { recordHwid } from "./recordHwid.js";
import { getHwid } from "./getHwid.js";
import { logger } from "../logger/logging.js";

export const handleEvent = (event, countMap, userHwidMap, notifiedUserIDs, client) => {
  if (event.type === "message") {
    if (event.message.text === "store\nで買い物をしました。") {
      logger("買い物をしました。", "INFO");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "買い物をしました。"
      });
    } else {
      // console.log("テキスト送ったよ");
      logger("event.typeがmessageのためテキストを送信", "DEBUG");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: event.message.text,
      });
    }
  } else if (event.type === "beacon") {
    // console.log("beaconを検知しました");
    logger("event.typeがbeaconのためbeaconを検知", "DEBUG");
    const hwid = event.beacon.hwid; // ハードウェアIDを取得
    const userID = event.source.userId; // ユーザーIDを取得
    const timestamp = event.timestamp; // タイムスタンプを取得

    // 設定した時間以上経過している場合、初期化を行う
    if (isTimestampExpired(timestamp)) {
      // timestampが10分以上経過している場合、初期化を行う
      //console.log("Timestampが10分以上経過しています。初期化を行います。");
      logger("Timestampが10分以上経過しています。初期化を行います。", "INFO");

      // ここで特定のユーザーに関連する情報を初期化するコードを追加する
      countMap[userID] = 0; // カウントを初期化
      userHwidMap[userID] = []; // "hwid" 関連の情報を初期化する

      // ユーザーIDを通知済みリストから削除
      const index = notifiedUserIDs.indexOf(userID);
      if (index !== -1) {
        notifiedUserIDs.splice(index, 1);
      }
    }

    if (hwid === process.env.HWID2 && notifiedUserIDs.indexOf(userID) === -1) {
      // 特定の "hwid" かつ未通知のユーザーに対する条件分岐
      //console.log("ビーコン017190a280を検知");
      logger("ビーコン017190a280を検知", "DEBUG");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "1個前のバス停を通過しました。枚方市駅まで乗車すると、乗車証明が発行されます。",
      });
      // ユーザーIDを通知済みリストに追加
      notifiedUserIDs.push(userID);
      // ユーザーごとに受信回数を記録
      incrementCount(countMap, userID);
      //console.log(getCount(countMap, userID));
      logger(getCount(countMap, userID), "INFO");
      recordHwid(userHwidMap, userID, hwid);
    } else if (hwid === process.env.HWID1 && notifiedUserIDs.indexOf(userID) === -1) {
      // 他の "hwid" かつ未通知のユーザーに対する条件分岐
      //console.log("ビーコン0171c239b0を検知");
      logger("ビーコン0171c239b0を検知", "DEBUG");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "1個前のバス停を通過しました。枚方市駅まで乗車すると、乗車証明が発行されます。",
      });
      // ユーザーIDを通知済みリストに追加
      notifiedUserIDs.push(userID);
      // ユーザーごとに受信回数を記録
      incrementCount(countMap, userID);
      //console.log(getCount(countMap, userID));
      logger(getCount(countMap, userID), "INFO");
      recordHwid(userHwidMap, userID, hwid);
    } else if (
      notifiedUserIDs.indexOf(userID) !== -1 &&
      getHwid(userHwidMap, userID) != hwid &&
      getCount(countMap, userID) == 1
    ) {
      // 既に通知済みのユーザーにはメッセージを送信
      //console.log("2度目です。");
      logger("2度目です。", "DEBUG");
      // 2回目の受信であることを記録
      incrementCount(countMap, userID);
      //console.log(getCount(countMap, userID));
      logger(getCount(countMap, userID), "INFO");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "乗車証明が取れました。",
      });
    } else if (
      notifiedUserIDs.indexOf(userID) !== -1 &&
      getHwid(userHwidMap, userID) == hwid
    ) {
      //console.log("既に受信済み");
      logger("既に受信済み", "DEBUG");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "本日はこれ以上乗車証明が発行できません。",
      });
    } else {
      //console.log("3回目以上の検知");
      logger("3回目以上の検知", "DEBUG");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "本日はこれ以上乗車証明が発行できません。",
      });
    }
  } else {
    //console.log("受信失敗");
    logger("受信失敗", "ERROR");
  }
};
