// incrementCount.js
function incrementCount(userID, countMap) {
    if (!countMap[userID]) {
      countMap[userID] = 1;
    } else {
      countMap[userID]++;
    }
  }
  
  export default incrementCount;
  