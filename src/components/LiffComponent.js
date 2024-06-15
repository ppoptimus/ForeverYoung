import React, { useEffect, useState } from "react";
import { AES } from 'crypto-js';
import liff from "@line/liff";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [points, setPoints] = useState(0);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    if (sessionStorage.getItem("point")){
      sessionStorage.clear();
    }
    const url = new URL(window.location.href);
    const liffState = url.searchParams.get("liff.state");

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

    if (liffState){
      const decodedLiffState = decodeURIComponent(liffState);
      const params = new URLSearchParams(decodedLiffState.split("?")[1]);
  
      const hasTime = params.has("time");
      const hasPoint = params.has("point");
      const time = params.get("time");
      const point = params.get("point");
      
      console.log("url = " + url);
      console.log("time = " + time);
      
      if (hasTime && hasPoint) {
        sessionStorage.setItem("time", time);
        sessionStorage.setItem("point", point);
        initializeLiff();
      }
    }
    else{
      const queryParameters = new URLSearchParams(window.location.search);
      const hasTime = queryParameters.has("time");
      const hasPoint = queryParameters.has("point");
      if(hasTime && hasPoint){
        const time = queryParameters.get("time");
        const point = queryParameters.get("point");
        console.log("queryParameters = " + queryParameters);
        console.log("time = " + time);

        sessionStorage.setItem("time", time);
        sessionStorage.setItem("point", point);
        initializeLiff();
      }
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
