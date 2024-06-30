import { getDatabase, ref, query, orderByChild, equalTo, get } from "firebase/database";

const getExistsToken = async (userId, time) => {
  const db = getDatabase();
  const usersRef = ref(db, 'users');
  
  const userIdQuery = query(usersRef, orderByChild('userId'), equalTo(userId));

  try {
    const snapshot = await get(userIdQuery);
    if (snapshot.exists()) {
      const users = snapshot.val();
      const exists = Object.entries(users).some(([key, value]) => value.time === time);
      if (exists) {
        return "duplicate";
      } else {
        return "success";
      }
    } else {
      return "success";
    }
  } catch (err) {
    return "error: " + err.message;
  }
};

export default getExistsToken;
