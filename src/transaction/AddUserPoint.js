// src/transaction/AddUserPoint.js
import { ref, push } from 'firebase/database';
import { db } from '../util/firebase';

const AddUserPoint = async (userId, point, time) => {
  try {
    const usersRef = ref(db, 'users');
    const pointNumber = Number(point); // แปลง point ให้เป็นตัวเลข
    await push(usersRef, { userId, point: pointNumber, time });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export { AddUserPoint };
