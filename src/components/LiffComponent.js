import React, { useEffect, useState } from "react";
import { AES } from 'crypto-js';
import liff from "@line/liff";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [points, setPoints] = useState(0);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    sessionStorage.clear();
    const url = new URL(window.location.href);
    console.log("url : " + url);
    const queryParameters = new URLSearchParams(window.location.search);
    const time = queryParameters.get("time");
    const point = queryParameters.get("point");
    
    if (time && point) {
      sessionStorage.setItem("time", time);
      sessionStorage.setItem("point", point);

      const initializeLiff = async () => {
        try {
          await liff.init({ liffId: "2005387393-XvmK0M34" });
          if (liff.isLoggedIn()) {
            const userProfile = await liff.getProfile();
            setProfile(userProfile);
  
            const storedTime = sessionStorage.getItem("time");
            const storedPoint = sessionStorage.getItem("point");
            
            if (storedTime && storedPoint) {
              setPoints(storedPoint);
              setToken(AES.encrypt(storedTime, 'forever_young').toString());
            }
          } else {
            liff.login();
          }
        } catch (error) {
          console.error("LIFF Initialization failed", error);
        }
      };
      // initializeLiff();
    }
    
  }, []);

  const sendNotification = async (userId) => {
    try {
      const response = await fetch(
        "https://lineapi.vercel.app/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            message: "You have successfully logged in!",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification", error);
    }
  };

  return (
    <div>
      <h1>LIFF App</h1>
      {profile ? (
        <div>
          <p>Name: {profile.displayName}</p>
          <p>User ID: {profile.userId}</p>
          <p>Status Message: {profile.statusMessage}</p>
          <p>Points: {points}</p>
          <p>Token: {token}</p>
          <img src={profile.pictureUrl} alt="Profile" width={250} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
