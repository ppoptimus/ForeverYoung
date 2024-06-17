import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AES } from "crypto-js";
import liff from "@line/liff";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        liff.init({ liffId: "2005387393-XvmK0M34" }).then(() => {
          if (liff.isLoggedIn()) {
            const userProfile = liff.getProfile();
            setProfile(userProfile);
            localStorage.setItem("userId", profile.userId);
            console.log("isLogin");
            navigate(`/`);
          } else {
            liff.login();
          }
        });
      } catch (error) {
        console.error("LIFF Initialization failed", error);
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

      <p>Loading...</p>
    </div>
  );
};

export default Profile;
