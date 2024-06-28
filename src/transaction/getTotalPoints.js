// src/transaction/getTotalPoints.js
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from '../util/firebase';

const getTotalPoints = async (userId) => {
  console.log(userId);
  try {
    const usersRef = ref(db, 'users');
    console.log("usersRef=",usersRef);
    const userQuery = query(usersRef, orderByChild('userId'), equalTo(userId));
    console.log("userQuery=",userQuery);
    const snapshot = await get(userQuery);
    console.log("snapshot=",snapshot);
    const data = snapshot.val();
    console.log("data=",data);
    let totalPoints = 0;
    if (data) {
      Object.values(data).forEach(entry => {
        totalPoints += entry.point;
        console.log("totalPoints=",totalPoints);
      });
    }
    return totalPoints;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting total points: " + error.message);
  }
};

export { getTotalPoints };
