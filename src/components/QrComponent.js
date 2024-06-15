import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

const QrComponent = () => {
  const [point, setPoint] = useState("1");
  const [time, setTime] = useState(null);

  useEffect(() => {
    getToekn();
  }, [])
  
  const urlBase = "https://foreveryoung-seven.vercel.app";
  let desUrl = `${urlBase}?time=${time}&point=${point}`;

  const getToekn = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    const minliSecond = String(date.getMilliseconds()).padStart(2, "0");

    const formattedDateTime = `${year}${month}${day}${hour}${minute}${second}${minliSecond}`;
    setTime(formattedDateTime);
  };

  const selectPoint = (e) => {
    getToekn();
    setPoint(e.target.value);
    console.log(e.target.value);
    console.log(desUrl);
  };
  return (
    <>
      <form className="max-w-sm mx-auto flex justify-center text-center m-2">
        <label className="text-2xl">
          เลือกคะแนนที่จะได้รับ
          <select
            className="text-2xl bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={point}
            onChange={(e) => selectPoint(e)}>
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
        <QRCode
          size={500}
          style={{ height: "300", maxWidth: "100%", width: "100%" }}
          value={desUrl}
          viewBox={`0 0 500 500`}
        />
      </div>
    </>
  );
};

export default QrComponent;
