// recordHwid.js

export function recordHwid(userHwidMap, userID, hwid) {
    if (!userHwidMap[userID]) {
        userHwidMap[userID] = [];
    }
    userHwidMap[userID].push(hwid);
  }
  