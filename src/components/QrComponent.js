import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import CryptoJS from "crypto-js";

import { getTotalPoints } from "../transaction/getTotalPoints";

const QrComponent = () => {
  const [point, setPoint] = useState("1");
  const [qrcode, setQrcode] = useState("");
  const [totalPoints, setTotalPoints] = useState();

  useEffect(() => {
    setPoint("1");
    getToekn(point);
  }, []);

  const getToekn = (point) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    const minliSecond = String(date.getMilliseconds()).padStart(2, "0");
    const formattedDateTime = `${year}${month}${day}${hour}${minute}${second}${minliSecond}`;
    let text = `token|${formattedDateTime}|point|${point}`;
    console.log("getToekn text = " + text);
    genQr(text);
  };

  const genQr = (text) => {
    const password = "forever_young";
    const ciphertext = CryptoJS.AES.encrypt(text, password);
    console.log(ciphertext.toString());
    setQrcode(ciphertext.toString());

    const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), password);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    console.log("genQr plaintext = " + plaintext);
  };

  const selectPoint = (e) => {
    setPoint(e.target.value);
    getToekn(e.target.value);
    console.log("select point = " + e.target.value);
  };

  const testGetPoint = async () => {
    const totalPoints = await getTotalPoints("U6e1614ff8a93a29d3b109fb9983a1dd3");
    setTotalPoints(totalPoints);
  }
  return (
    <>
      <form className="max-w-sm mx-auto flex justify-center text-center m-2">
        <label className="text-2xl">
          เลือกคะแนนที่จะได้รับ
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={point}
            onChange={(e) => selectPoint(e)}
          >
            <option className="text-xl" value="1">
              1
            </option>
            <option className="text-xl" value="2">
              2
            </option>
            <option className="text-xl" value="3">
              3
            </option>
            <option className="text-xl" value="4">
              4
            </option>
            <option className="text-xl" value="5">
              5
            </option>
            <option className="text-xl" value="6">
              6
            </option>
          </select>
        </label>
      </form>
      <hr />
      <p className="text-xl font-bold">Point = {point}</p>
      <div>
        <QRCode size={500} style={{ height: "300", maxWidth: "100%", width: "100%" }} value={qrcode} viewBox={`0 0 500 500`} />
      </div>
      <p>
        <button className="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500"
        onClick={testGetPoint}>Get point</button>
      </p>
      <p>{totalPoints && <span>{totalPoints}</span>}</p>
    </>
  );
};

export default QrComponent;
