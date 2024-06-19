import "./App.css";
import liff from "@line/liff";
import React, { useEffect, useState } from "react";

function App() {
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  const handleScanQRCode = () => {
    try {
      liff.scanCodeV2().then((result) => {
        console.log('Scan result:', result.value);
        setData(result.value);
      });
    } catch (error) {
      console.error('Error scanning QR code:', error);
      setError(error);
    }
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      {profile && (
        <div>
          <p>สวัสดีคุณ: {profile.displayName}</p>
          <p>วันนี้รับกี่แต้มดีนะ ลองสแกนดู</p>
        </div>
      )}
      <QrScannerComponent />
    </div>
  );
}

const QrScannerComponent = () => {
  const [scanning, setScanning] = useState(false);
  const [data, setData] = useState("No result");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (scanning) {
      liff
        .scanCodeV2()
        .then((result) => {
          setData(result.value);
          setScanning(false); // หลังจากสแกนเสร็จแล้วให้ปิดการสแกน
        })
        .catch((error) => {
          setError(error);
          setScanning(false); // หากเกิดข้อผิดพลาดในการสแกนให้ปิดการสแกนเช่นกัน
        });
    }
  }, [scanning]);

  const startScan = () => {
    setScanning(true); // เริ่มการสแกนเมื่อคลิกที่ปุ่ม Scan
  };

  return (
    <div>
      {!data && !error && <p>กำลังสแกน...</p>}
      {data && <p>ผลลัพธ์: {data}</p>}
      {error && <p>เกิดข้อผิดพลาดในการสแกน: {error.message}</p>}
      {!scanning && (
        <button onClick={startScan}>เริ่มสแกน</button>
      )}
    </div>
  );
};

export default App;
