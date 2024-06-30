import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { AddUserPoint } from "../transaction/AddUserPoint";
import { getTotalPoints } from "../transaction/getTotalPoints";
import getExistsToken from "../transaction/getExistsToken";

const ScanQrcode = ({ usrId, pictureUrl, displayName }) => {
  const [dataDecypt, setDataDecypt] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [totalPoint, setTotalPoint] = useState(null);

  useEffect(() => {
    if (dataDecypt) {
      saveData(dataDecypt);
    }
    getPoint();
  }, [dataDecypt, totalPoint, errorMsg]);

  const startScan = async () => {
    try {
      const result = await liff.scanCodeV2();
      if (result) {
        const decryptedData = deCryptCode(result.value);
        if (decryptedData === "") {
          setErrorMsg("QrCode ไม่ถูกต้อง!");
        } else {
          setDataDecypt(decryptedData);
        }
      }
    } catch (error) {
      setErrorMsg(error);
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
      return "error";
    }
  };

  const saveData = async (data) => {
    let checkExists = "";
    try {
      let codeArr = data.split("|");
      let getToken = codeArr[0] === "token" ? codeArr[1] : null;
      let getPoint = codeArr[2] === "point" ? codeArr[3] : null;
      checkExists = await getExistsToken(usrId, getToken);
      if (checkExists === "success") {
        const result = await AddUserPoint(usrId, getPoint, getToken);
        if (result.success) {
          setSuccessMsg("Save success");
        } else {
          setErrorMsg(result.message);
        }
      } else if (checkExists === "duplicate") {
        setErrorMsg("Duplicate Token!");
      } else {
        setErrorMsg(checkExists);
      }
    } catch (err) {
      setErrorMsg(err);
    } finally {
      getPoint();
    }
  };

  const getPoint = async () => {
    try {
      const point = await getTotalPoints(usrId);
      setTotalPoint(point);
    } catch (err) {
      setErrorMsg(err);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div class="row justify-content-start align-items-center">
          <div class="col-3">
            <img className="rounded-circle img-thumbnail" src={pictureUrl} alt="" />
          </div>
          <div class="col-6">
            <div className="text-xl-start fs-5 fw-bold">{displayName}</div>
            <div className="text-lg-start">แต้มคงเหลือ : {totalPoint ? <span>{totalPoint}</span> : 0}</div>
          </div>
        </div>
      </div>

      <div className="position-absolute bottom-0 start-50 translate-middle-x text-center">
        <div className="m-2">
          {successMsg && <b>{successMsg}</b>}
          {errorMsg && <b className="text-danger">{errorMsg}</b>}
        </div>
        <button className="btn btn-dark rounded-pill fs-3 px-4 py-2" onClick={startScan}>
          <i className="bi bi-qr-code-scan"></i> Scan
        </button>
      </div>
    </>
  );
};

export default ScanQrcode;
