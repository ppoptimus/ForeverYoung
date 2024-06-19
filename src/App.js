import "./App.css";
import liff from "@line/liff";
import React, { useEffect, useState, useRef } from "react";

function App() {
  const [profile, setProfile] = useState(null);
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
          <p>สวัสดีคุณ: {profile.displayName}</p>
          <p>วันนี้รับกี่แต้มดีนะ ลองสแกนดู</p>
        </div>
      )}
      <div>
        <button
          onClick={QrScannerComponent()}
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Scan Point
          <svg
            class="ml-2 w-6 h-6 text-white dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"
            />
            <path
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

const QrScannerComponent = () => {
  const [data, setData] = useState("No result");
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      liff.scanCodeV2().then((result) => {
        setData(result.value);
      });
    } catch (error) {
      setError(error);
    }
  }, []);

  return (
    <div>
      <h1>QR Code Scanner</h1>
      {error ? <p>{error}</p> : <p>{data}</p>}
      <p>{data}</p>
    </div>
  );
};

export default App;
