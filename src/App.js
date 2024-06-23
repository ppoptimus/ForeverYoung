import "./App.css";
import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import QrComponent from "./components/QrComponent";
import QrScannerComponent from "./components/QrScannerComponent";

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
            .then((profile) => setProfile(profile))
            .catch((err) => console.error("Error getting profile:", err));
        } else {
          liff.login();
        }
      })
      .catch((err) => console.error("LIFF Initialization failed:", err));
  }, [queryParameters]);

  if (!param) {
    return <div>Loading...</div>;
  } else {
    if (param === "genqr") {
      return (
        <div>
          <QrComponent />
        </div>
      );
    } else if (param === "scan") {
      return <QrScannerComponent usrId={profile?.userId} />;
    } else {
      return (
        <div>
          <h1>Home</h1>
        </div>
      );
    }
  }
}

export default App;
