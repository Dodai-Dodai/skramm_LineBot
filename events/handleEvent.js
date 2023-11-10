// events/handleEvent.js

import { isTimestampExpired } from "./isTimestampExpired.js";
import { incrementCount } from "./incrementCount.js";
import { getCount } from "./getCount.js";
import { recordHwid } from "./recordHwid.js";
import { getHwid } from "./getHwid.js";

export const handleEvent = (event) => {
  if (event.type === "message") {
    console.log("テキスト送ったよ");
    client.replyMessage(event.replyToken, {
      type: "text",
      text: event.message.text,
    });
  } else if (event.type === "beacon") {
    console.log("beaconを検知しました");
    const hwid = event.beacon.hwid; // ハードウェアIDを取得
    const userID = event.source.userId; // ユーザーIDを取得
    const timestamp = event.timestamp; // タイムスタンプを取得

    // 設定した時間以上経過している場合、初期化を行う。
    if (isTimestampExpired(timestamp)) {
      // timestampが10分以上経過している場合、初期化を行う
      console.log("Timestampが10分以上経過しています。初期化を行います。");

      // ここで特定のユーザーに関連する情報を初期化するコードを追加する
      countMap[userID] = 0; // カウントを初期化
      userHwidMap[userID] = []; // "hwid" 関連の情報を初期化

      // ユーザーIDを通知済みリストから削除
      const index = notifiedUserIDs.indexOf(userID);
      if (index !== -1) {
        notifiedUserIDs.splice(index, 1);
      }
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
      // ユーザーごとに受信回数を記録
      incrementCount(countMap, userID);
      console.log(getCount(countMap, userID));
      recordHwid(userHwidMap, userID, hwid);
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
      incrementCount(countMap, userID);
      console.log(getCount(countMap, userID));
      recordHwid(userHwidMap, userID, hwid);
    } else if (
      notifiedUserIDs.indexOf(userID) !== -1 &&
      getHwid(userHwidMap, userID) != hwid &&
      getCount(countMap, userID) == 1
    ) {
      // 既に通知済みのユーザーにはメッセージを送信
      console.log("2度目です。");
      // 2回目の受信であることを記録
      incrementCount(countMap, userID);
      console.log(getCount(countMap, userID));
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "2度目です。" + hwid,
      });
    } else if (
      notifiedUserIDs.indexOf(userID) !== -1 &&
      getHwid(userHwidMap, userID) == hwid
    ) {
      console.log("既に受信済み");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "既に受信しています。" + hwid,
      });
    } else {
      console.log("3回目以上の検知");
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "無効な検知" + hwid,
      });
    }
  } else {
    console.log("受信失敗");
  }
};
