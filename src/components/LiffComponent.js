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
          if (liff.isLoggedIn()) {
            const userProfile = liff.getProfile();
            setProfile(userProfile);
            console.log("isLogin");
          } else {
            liff.login();
          }
        });
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
