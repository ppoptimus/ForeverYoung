import liff from "@line/liff";
import React, { useEffect, useState } from "react";

const QrScannerComponent = ({ usrId }) => {
  const [scanning, setScanning] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [labelScan, setLabelScan] = useState("เริ่มสแกน");

  useEffect(() => {
    if (scanning) {
      liff
        .scanCodeV2()
        .then((result) => {
          let point = result != null ? result.value.split("|")[1] : null;
          setData(`${point}`);
          //   sendDataScan(usrId, result.value);
          setLabelScan("สแกนอีกครั้ง");
          setScanning(false);
        })
        .catch((error) => {
          setError(error);
          setScanning(false);
        });
    }
  }, [scanning, usrId]);

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

      <p>{data && <span>ครั้งนี้คุณได้แต้ม: {data} แต้ม</span>}</p>
      <p>{error && <span>เกิดข้อผิดพลาดในการสแกน: {error.message}</span>}</p>
    </div>
  );
};

const sendDataScan = async (userId, message) => {
  try {
    let bodyContent = JSON.stringify({
      to: userId,
      messages: [
        {
          type: "text",
          text: message,
        },
      ],
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
