// isTimestampExpired.js

export function isTimestampExpired(timestamp) {
    const currentTime = Date.now(); // 現在の時刻を取得（ミリ秒単位）
    const tenMinutesInMillis = 10 * 60 * 1000; // 10分をミリ秒単位に変換
  
    return currentTime - timestamp > tenMinutesInMillis;
  }
  