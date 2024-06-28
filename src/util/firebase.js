import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDyvVXVAs5WsjiPe2GhMyPpuxRFtxxSrfk",
    authDomain: "foreveryoung-9112b.firebaseapp.com",
    databaseURL: "https://foreveryoung-9112b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "foreveryoung-9112b",
    storageBucket: "foreveryoung-9112b.appspot.com",
    messagingSenderId: "58295371130",
    appId: "1:58295371130:web:8d694384bba3b20e06c2c3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
