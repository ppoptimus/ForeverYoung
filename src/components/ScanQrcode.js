import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { AddUserPoint } from "../transaction/AddUserPoint";
import { getTotalPoints } from "../transaction/getTotalPoints";

const NewScan = ({ usrId }) => {
  const [dataDecypt, setDataDecypt] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [totalPoint, setTotalPoint] = useState(null);

  useEffect(() => {
    if (dataDecypt) {
      saveData(dataDecypt);
      getPoint();
    }
  }, [dataDecypt]);

  const startScan = async () => {
    try {
      const result = await liff.scanCodeV2();
      if (result) {
        const decryptedData = deCryptCode(result.value);
        setDataDecypt(decryptedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
        getPoint();
    }
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

  const saveData = async (data) => {
    try {
      let codeArr = data.split("|");
      let getToken = codeArr[0] === "token" ? codeArr[1] : null;
      let getPoint = codeArr[2] === "point" ? codeArr[3] : null;
      const result = await AddUserPoint(usrId, getPoint, getToken);
      if (result.success) {
        setSuccessMsg("Save success");
      } else {
        setErrorMsg(result.message);
      }
    } catch (err) {
      setErrorMsg(err);
    }
  };

  const getPoint = async () => {
    try {
        const point = await getTotalPoints(usrId);
        setTotalPoint(point);
    } catch (err) {
        setErrorMsg(err);
    }
  }

  return (
    <div>
      <button
        className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-extrabold rounded-full text-4xl px-6 py-4 text-center mt-6 me-4 mb-2"
        onClick={startScan}
      >
        Scan
      </button>
      {dataDecypt && <p>{dataDecypt}</p>}
      {successMsg && <p>{successMsg}</p>}
      {errorMsg && <p>{errorMsg}</p>}
      {totalPoint && <p>{totalPoint}</p>}
    </div>
  );
};

export default NewScan;
