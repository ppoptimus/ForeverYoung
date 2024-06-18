import "./App.css";
import liff from "@line/liff";
import React, { useEffect, useState, useRef } from "react";
import QrScanner from 'react-qr-scanner';

function App() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    // liff
    //   .init({ liffId: "2005387393-XvmK0M34" })
    //   .then(() => {
    //     if (liff.isLoggedIn()) {
    //       liff
    //         .getProfile()
    //         .then((profile) => setProfile(profile))
    //         .catch((err) => console.error("Error getting profile:", err));
    //     } else {
    //       liff.login();
    //     }
    //   })
    //   .catch((err) => console.error("LIFF Initialization failed:", err));
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
       <QrScannerComponent />
    </div>
  );
}

const QrScannerComponent = () => {
  const [data, setData] = useState('No result');
  const [error, setError] = useState(null);

  const handleScan = (result) => {
    if (result) {
      setData(result);
    }
  };

  const handleError = (error) => {
    console.error(error);
    setError('Error accessing camera: ' + error.message);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <QrScanner
          delay={300}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />
      )}
      <p>{data}</p>
    </div>
  );
};




export default App;
