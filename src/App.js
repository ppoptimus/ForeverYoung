import "./App.css";
import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";

import QrComponent from "./components/GenQrcode";
import NewScan from "./components/ScanQrcode";
import SpinWheel from "./games/SpinWheelApp";

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    liff
      .init({ liffId: "2005387393-XvmK0M34" })
      .then(() => {
        if (liff.isLoggedIn()) {
          liff
            .getProfile()
            .then((profile) => {
              setProfile(profile);
            })
            .catch((err) => console.error("Error getting profile:", err));
        } else {
          liff.login();
        }
      })
      .catch((err) => console.error("LIFF Initialization failed:", err));
  }, []);

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <Routes>
      <Route path="/spin" element={<SpinWheel />} />
      <Route path="/qr" element={<QrComponent />} />
      <Route path="/scan" element={<NewScan usrId={profile.userId} pictureUrl={profile.pictureUrl} displayName={profile.displayName} />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

const HomePage = () => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default App;
