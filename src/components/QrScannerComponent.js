import liff from "@line/liff";
import React, { useEffect, useState } from "react";

const QrScannerComponent = ({ usrId }) => {
  const [scanning, setScanning] = useState(false);
  const [point, setPoint] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [labelScan, setLabelScan] = useState("เริ่มสแกน");

  useEffect(() => {
    if (scanning) {
      liff
        .scanCodeV2()
        .then((result) => {
          let codeArr = result.value.split("|");
          let getToken = (codeArr[0] === "token") ? codeArr[1] : null;
          let getPoint = (codeArr[2] === "point") ? codeArr[3] : null;
          if(getToken == null || getPoint == null){
            setError("QR Code ไม่ถูกต้อง");
          }else{
            if (getToken) {
              setToken(getToken);
            }
            if (getPoint) {
              setPoint(getPoint);
            }
          }
          sendDataScan(usrId, point, token);
          setLabelScan("สแกนอีกครั้ง");
          setScanning(false);
        })
        .catch((error) => {
          setError(error);
          setScanning(false);
        });
    }
  }, [scanning, usrId, point, token]);

  const startScan = () => {
    setScanning(true);
  };

  return (
    <div className="text-center align-middle p-6">
      <p>
        {!scanning && (
          <button
            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={startScan}>
            {labelScan}
          </button>
        )}
        {scanning && <span>กำลังสแกน...</span>}
      </p>

      <p>{point && <span>ครั้งนี้คุณได้แต้ม: {point} แต้ม</span>}</p>
      <p>{error && <span>เกิดข้อผิดพลาดในการสแกน: {error.message}</span>}</p>
    </div>
  );
};

const sendDataScan = async (userId, point, token) => {
  try {
    let bodyContent = JSON.stringify({
      "userId" : userId,
      "point" : point,
      "token" : token
    });
    const response = await fetch("https://lineapi.vercel.app/sendResultScan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyContent,
    });

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }
  } catch (error) {
    console.error("Error sending notification", error);
  }
};

export default QrScannerComponent;
