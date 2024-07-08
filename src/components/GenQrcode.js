import React, { useState, useEffect, useCallback } from "react";
import QRCode from "react-qr-code";
import CryptoJS from "crypto-js";

const QrComponent = () => {
  const [point, setPoint] = useState("1");
  const [qrcode, setQrcode] = useState("");

  const genQr = useCallback((text) => {
    const password = "forever_young";
    const ciphertext = CryptoJS.AES.encrypt(text, password).toString();
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    console.log("ciphertext = ", ciphertext);
    console.log("plaintext = ", plaintext);
    setQrcode(ciphertext);
  }, []);

  const getToken = useCallback((point) => {
    const date = new Date();
    const formattedDateTime = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(date.getSeconds()).padStart(2, "0")}${String(date.getMilliseconds()).padStart(2, "0")}`;
    let text = `token|${formattedDateTime}|point|${point}`;
    genQr(text);
  }, [genQr]);

  useEffect(() => {
    if (point) {
      getToken(point);
    }
  }, [point, getToken]);

  const selectPoint = (e) => {
    setPoint(e.target.value);
  };

  return (
    <>
      <form className="max-w-sm mx-auto flex justify-center text-center m-2">
        <label className="text-2xl">
          เลือกคะแนนที่จะได้รับ
          <select
            className="form-select"
            value={point}
            onChange={selectPoint}
          >
            <option disabled>เลือกแต้มที่ได้รับ</option>
            <option className="text-xl" value="1">1</option>
            <option className="text-xl" value="2">2</option>
            <option className="text-xl" value="3">3</option>
            <option className="text-xl" value="4">4</option>
            <option className="text-xl" value="5">5</option>
            <option className="text-xl" value="6">6</option>
          </select>
        </label>
      </form>
      <hr />
      <p className="text-xl font-bold">Point = {point}</p>
      <div>
        <QRCode
          size={500}
          style={{ height: "300px", maxWidth: "100%", width: "100%" }}
          value={qrcode}
          viewBox={`0 0 500 500`}
        />
      </div>
    </>
  );
};

export default QrComponent;
