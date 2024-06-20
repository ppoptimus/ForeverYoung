import "./App.css";
import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import QrComponent from "./components/QrComponent";
import { useSearchParams } from "react-router-dom";

function App() {
  const [profile, setProfile] = useState(null);
  const [param, setParam] = useState(null);
  const [queryParameters] = useSearchParams();

  useEffect(() => {
    setParam(queryParameters.get("type"));
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
  }

  if (param === "genqr") {
    return (
      <div>
        <QrComponent />
      </div>
    );
  } else if (param === "scan") {
    return (
      <div>
        {profile && (
          <div>
            <p>สวัสดีคุณ: {profile.displayName}</p>
            <p>วันนี้รับกี่แต้มดีนะ ลองสแกนดู</p>
          </div>
        )}
        <QrScannerComponent usrId={profile?.userId} />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }
}

const QrScannerComponent = ({ usrId }) => {
  const [scanning, setScanning] = useState(false);
  const [data, setData] = useState("No result");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (scanning) {
      liff
        .scanCodeV2()
        .then((result) => {
          setData(result.value);
          sendNotification(usrId, result.value);
          setScanning(false);
        })
        .catch((error) => {
          setError(error);
          setScanning(false);
        });
    }
  }, [scanning, usrId]);

  const startScan = () => {
    setScanning(true); // เริ่มการสแกนเมื่อคลิกที่ปุ่ม Scan
  };

  return (
    <div>
      {!data && !error && <p>กำลังสแกน...</p>}
      {data && <p>ผลลัพธ์: {data}</p>}
      {error && <p>เกิดข้อผิดพลาดในการสแกน: {error.message}</p>}
      {!scanning && (
        <button
          className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={startScan}>
          เริ่มสแกน
        </button>
      )}
    </div>
  );
};

const sendNotification = async (userId, message) => {
  try {
    let bodyContent = JSON.stringify({
      "to": userId,
      "messages": [
        {
          "type": "text",
          "text": message
        }
      ]
    });
    const response = await fetch("https://lineapi.vercel.app/sendResultScan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyContent
    });

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }
  } catch (error) {
    console.error("Error sending notification", error);
  }
};

export default App;
