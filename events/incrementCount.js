// IDに紐づけてカウントを増やすハンドラ
function incrementCount(countM,userID) {
    if (!countM[userID]) {
        countM[userID] = 1;
    } else {
        countM[userID]++;
    }
  }