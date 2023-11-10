// incrementCount.js

export function incrementCount(countMap, userID) {
  if (!countMap[userID]) {
    countMap[userID] = 1;
  } else {
    countMap[userID]++;
  }
}
