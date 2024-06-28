// src/components/ScannerComponent.js
import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { AddUserPoint } from "../transaction/AddUserPoint";
import { getTotalPoints } from "../transaction/getTotalPoints";

const ScannerComponent = ({ usrId }) => {
  const [scanning, setScanning] = useState(false);
  const [point, setPoint] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [labelScan, setLabelScan] = useState("เริ่มสแกน");
  const [totalPoints, setTotalPoints] = useState();
  const [message, setMessage] = useState('');
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    if (scanning) {
      liff
        .scanCodeV2()
        .then(async (result) => {
          if (!result.value) {
            setError("QR Code ไม่ถูกต้อง");
            setScanning(false);
            return;
          }

          let plainText = deCryptCode(result.value);
          if (!plainText) {
            setError("การถอดรหัส QR Code ล้มเหลว");
            setScanning(false);
            return;
          }

          let codeArr = plainText.split("|");
          let getToken = codeArr[0] === "token" ? codeArr[1] : null;
          let getPoint = codeArr[2] === "point" ? Number(codeArr[3]) : null;

          if (getToken == null || getPoint == null) {
            setError("QR Code ไม่ถูกต้อง");
            setScanning(false);
          } else {
            if (getToken) setToken(() => getToken);
            if (getPoint) setPoint(() => getPoint);

            const addUserResult = await AddUserPoint(usrId, getPoint, getToken);

            if (addUserResult.success) {
              const totalPoints = await handleGetTotalPoints(usrId);
              setTotalPoints(totalPoints);
            } else {
              setError(addUserResult.message);
            }
            setLabelScan("สแกนอีกครั้ง");
            setScanning(false);
            // setScanComplete(true); // แสดงว่าเสร็จสิ้นการสแกน
          }
        })
        .catch((error) => {
          setError(error.message);
          setScanning(false);
        });
    }
  }, [scanning, usrId, point, token]);

  const startScan = () => {
    setScanning(true);
    setScanComplete(false); // รีเซ็ตสถานะเมื่อเริ่มสแกนใหม่
  };

  const deCryptCode = (qrcode) => {
    try {
      const password = "forever_young";
      const bytes = CryptoJS.AES.decrypt(qrcode.toString(), password);
      const plaintext = bytes.toString(CryptoJS.enc.Utf8);
      return plaintext;
    } catch (error) {
      console.error("การถอดรหัสล้มเหลว:", error);
      return null;
    }
  };

  const handleGetTotalPoints = async (userId) => {
    if (userId) {
      try {
        const totalPoints = await getTotalPoints(userId);
        return totalPoints;
      } catch (error) {
        setMessage('Error getting total points: ' + error.message);
        return null;
      }
    } else {
      setMessage('Please enter a userId');
      return null;
    }
  };

  const closeScanner = () => {
    setScanComplete(false); // ปิดหน้าจอสแกน
  };

  return (
    <div className="text-center align-middle p-6">
      <p>
        {!scanning && !scanComplete && (
          <button
            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-extrabold rounded-full text-4xl px-6 py-4 text-center mt-6 me-4 mb-2"
            onClick={startScan}
          >
            {labelScan}
          </button>
        )}
        {scanning && <span>กำลังสแกน...</span>}
      </p>

      {scanComplete && (
        <div>
          {point && <h2>ครั้งนี้คุณได้แต้ม: {point} แต้ม</h2>}
          {totalPoints !== null && <p>Total Points: {totalPoints}</p>}
          {error && <span>{error}</span>}
          <button
            className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-extrabold rounded-full text-4xl px-6 py-4 text-center mt-6 me-4 mb-2"
            onClick={closeScanner}
          >
            ปิดหน้าจอ
          </button>
        </div>
      )}
    </div>
  );
};

export default ScannerComponent;
