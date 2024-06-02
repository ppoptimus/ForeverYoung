import React, { useEffect, useState } from "react";
import liff from "@line/liff";

const LiffComponent = () => {
  const [profile, setProfile] = useState(null);
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: "2005387393-XvmK0M34" });
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          console.log("User Profile:", userProfile);
          console.log("Param :", params.get("topic")); 

          sendNotification(userProfile.userId);
        } else {
          liff.login();
        }
      } catch (error) {
        console.error("LIFF Initialization failed", error);
      }
    };

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

    initializeLiff();
  }, []);

  return (
    <div>
      <h1>LIFF App</h1>
      {profile ? (
        <div>
          <p>Name: {profile.displayName}</p>
          <p>User ID: {profile.userId}</p>
          <p>Status Message: {profile.statusMessage}</p>
          <img src={profile.pictureUrl} alt="Profile" width={250} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LiffComponent;
