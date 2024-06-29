import "./App.css";
import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import QrComponent from "./components/GenQrcode";
import NewScan from "./components/ScanQrcode";

function App() {
  const [profile, setProfile] = useState(null);
  const [param, setParam] = useState(null);
  const [queryParameters] = useSearchParams();

  useEffect(() => {
    setParam(queryParameters.get("menu"));
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
  }, [queryParameters])
  
  if (!profile) {
    return <div>Loading...</div>; // รอจนกว่า profile จะถูกตั้งค่า
  }

  if (!param) {
    return <div>Loading...</div>; // รอจนกว่า param จะถูกตั้งค่า
  } 
  if (param === "genqr") {
    return <QrComponent usrId={profile.userId} />;
  } else if (param === "scan") {
    return <NewScan usrId={profile.userId} />;
  } else {
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }
}

export default App;
