import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

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
          let plainText = deCryptCode(result.value);
          let codeArr = plainText.split("|");
          let getToken = codeArr[0] === "token" ? codeArr[1] : null;
          let getPoint = codeArr[2] === "point" ? codeArr[3] : null;
          if (getToken == null || getPoint == null) {
            setError("QR Code ไม่ถูกต้อง");
          } else {
            if (getToken) {
              setToken(() => getToken);
            }
            if (getPoint) {
              setPoint(() => getPoint);
            }
          }
          sendDataScan(usrId, getPoint, getToken);
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

  const deCryptCode = (qrcode) => {
    const password = "forever_young";
    const bytes = CryptoJS.AES.decrypt(qrcode.toString(), password);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  };

  return (
    <div className="text-center align-middle p-6">
      <p>
        {!scanning && (
          <button
            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-extrabold rounded-full text-4xl px-6 py-4 text-center mt-6 me-4 mb-2"
            onClick={startScan}>
            {labelScan}
          </button>
        )}
        {scanning && <span>กำลังสแกน...</span>}
      </p>

      <p>{point && <h2>ครั้งนี้คุณได้แต้ม: {point} แต้ม</h2>}</p>
      <p>{error && <span>{error}</span>}</p>
    </div>
  );
};

const sendDataScan = async (userId, point, token) => {
  try {
    let bodyContent = JSON.stringify({
      userId: userId,
      point: parseInt(point),
      token: token,
    });
    const response = await fetch(
      "https://3e77-2001-44c8-4285-5b4b-155-52ae-6073-abec.ngrok-free.app/sendResultScan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyContent,
      }
    );
    console.log(bodyContent);
    if (!response.ok) {
      throw new Error("Failed to send notification");
    }
  } catch (error) {
    console.error("Error sending notification", error);
  }
};

export default QrScannerComponent;
