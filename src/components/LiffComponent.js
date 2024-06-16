import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AES } from "crypto-js";
import liff from "@line/liff";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [points, setPoints] = useState(0);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const liffState = url.searchParams.get("liff.state");

    const initializeLiff = async () => {
      try {
        liff.init({ liffId: "2005387393-XvmK0M34" }).then(() => {
          window.location.href = "https://liff.line.me/2005387393-XvmK0M34/?time=134&point=5";
        });
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);

          const storedTime = localStorage.getItem("time");
          const storedPoint = localStorage.getItem("point");

          if (storedTime && storedPoint) {
            setPoints(storedPoint);
            setToken(AES.encrypt(storedTime, "forever_young").toString());
          }
        } else {
          liff.login();
        }
      } catch (error) {
        console.error("LIFF Initialization failed", error);
        navigate(`/home`);
      }
    };
    initializeLiff();
  }, []);

  const sendNotification = async (userId) => {
    try {
      const response = await fetch("https://lineapi.vercel.app/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          message: "You have successfully logged in!",
        }),
      });

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
