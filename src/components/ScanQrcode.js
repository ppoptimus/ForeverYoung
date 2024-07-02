import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { AddUserPoint } from "../transaction/AddUserPoint";
import { getTotalPoints } from "../transaction/getTotalPoints";
import getExistsToken from "../transaction/getExistsToken";
import '../ScanQrcode.css'

const ScanQrcode = ({ usrId, pictureUrl, displayName }) => {
  const [dataDecypt, setDataDecypt] = useState(null);
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
        if (decryptedData === "error") {
          setDataDecypt(null);
          setErrorMsg("QrCode ไม่ถูกต้อง!");
        } else {
          setDataDecypt(decryptedData);
        }
      } else {
        setDataDecypt(null);
        return;
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
      <div className="container-fluid mb-5">
        <div className="row justify-content-start align-items-center">
          <div className="col-3">
            <img className="rounded-circle img-thumbnail" src={pictureUrl} alt="" />
          </div>
          <div className="col-6">
            <div className="text-xl-start fs-5 fw-bold">{displayName}</div>
            <div className="text-lg-start">แต้มคงเหลือ : {totalPoint ? <span>{totalPoint}</span> : 0}</div>
          </div>
        </div>
        <div className="mb-5 pb-5">
          <Detail />
        </div>
      </div>

      <div className="position-fixed bottom-0 start-50 translate-middle-x d-flex justify-content-center w-100 mb-5">
        <button className="button-14 m-2" type="button">
          <div className="button-14-top text">
            <i className="fs-1 bi bi-joystick"></i> <span className="ms-1">Play Games</span>
          </div>
          <div className="button-14-bottom"></div>
          <div className="button-14-base"></div>
        </button>
        <button className="button-27 m-2" type="button" onClick={startScan}>
          <span className="d-flex align-items-center">
            <i className="fs-1 bi bi-qr-code-scan"></i> <span className="ms-1">Scan</span>
          </span>
        </button>
      </div>
    </>
  );
};

const Detail = () => {
  return (
    <div className="container mt-3 mb-5">
      <div className="header">
        <h1 className="display-4 fw-bold text-primary">สะสมแต้ม เล่นเกม รับส่วนลด!</h1>
        <p className="lead text-muted">สนุกกับกิจกรรมสุดพิเศษ สะสมแต้ม เล่นเกม ลุ้นรับรางวัลมากมาย!</p>
      </div>

      <div className="row mt-3 mb-5">
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title section-title text-danger">
                <i className="bi bi-trophy icon"></i>
                สะสมแต้มง่ายๆ
              </h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">ซื้อสินค้าครบ 100 บาท รับฟรี 1 แต้ม!</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title section-title text-primary">
                <i className="bi bi-controller icon"></i>
                เอาแต้มไปเล่นเกมส์ลุ้นรางวัล
              </h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">แต่ละเกมอาจใช้แต้มไม่เท่ากัน เช็คแต้มที่ใช้ได้ก่อนเล่น</li>
                <li className="list-group-item">เล่นเกมส์สนุกๆ ลุ้นรับรางวัลมากมาย เช่น คูปองส่วนลดและรางวัลอื่นๆ อีกมากมาย!</li>
                <li className="list-group-item">ยิ่งเล่น ยิ่งมีสิทธิ์ลุ้นรางวัลมากขึ้น!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ScanQrcode;
