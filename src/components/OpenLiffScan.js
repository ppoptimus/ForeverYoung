import React, { useEffect, useState, useRef } from "react";
import liff from "@line/liff";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function OpenLiffScan() {
  const [profile, setProfile] = useState(null);
  const [scannedData, setScannedData] = useState("");
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

  return (
    <div>
      <h1>QR Code Scanner</h1>
      {profile && (
        <div>
          <p>Name: {profile.displayName}</p>
          <img src={profile.pictureUrl} alt="Profile" />
        </div>
      )}
      <QRScanner onScan={(data) => setScannedData(data)} />
      {scannedData && (
        <div>
          <h2>Scanned Data</h2>
          <p>{scannedData}</p>
        </div>
      )}
    </div>
  );
}

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader.decodeFromVideoDevice(
      undefined,
      videoRef.current,
      (result, err) => {
        if (result) {
          onScan(result.getText());
        }
      }
    );

    return () => {
      codeReader.reset();
    };
  }, [onScan]);

  return (
    <div className="scanner-wrapper">
      <video ref={videoRef} />
      <div className="scanner-frame"></div>
    </div>
  );
};
