// src/transaction/getTotalPoints.js
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from '../util/firebase';

const getTotalPoints = async (userId) => {
  try {
    const usersRef = ref(db, 'users');
    const userQuery = query(usersRef, orderByChild('userId'), equalTo(userId));
    const snapshot = await get(userQuery);
    const data = snapshot.val();
    let totalPoints = 0;
    if (data) {
      Object.values(data).forEach(entry => {
        totalPoints += entry.point;
      });
    }
    return totalPoints;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting total points: " + error.message);
  }
};

export { getTotalPoints };
