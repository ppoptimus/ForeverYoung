import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { AddUserPoint } from "../transaction/AddUserPoint";
import { getTotalPoints } from "../transaction/getTotalPoints";
import getExistsToken from "../transaction/getExistsToken";
import "../ScanQrcode.css";

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
      <div className="container-fluid mb-1 position-relative">
        <div className="row justify-content-start align-items-center">
          <div className="col-3" style={{ zIndex: 20 }}>
            <img className="rounded-circle img-thumbnail" src={pictureUrl} alt="" />
          </div>
          <div className="col-9" style={{ zIndex: 20 }}>
            <div className="text-xl-start fs-5 fw-bold text-light">{displayName}</div>
            <div className="text-lg-start text-white">
              แต้มคงเหลือ : {totalPoint ? <span className="text-xl-start fw-bold shadow">{totalPoint}</span> : 0}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <button className="btn btn-info bouncy m-2 shadow" type="button" style={{ zIndex: 20 }}>
            <i className="fs-1 bi bi-joystick"></i> <span className="ms-1">Play Games</span>
          </button>
        </div>
      </div>
      <div className="mb-5 pb-5" style={{ zIndex: 10 }}>
        <Detail />
      </div>

      <div className="position-fixed bottom-0 start-50 translate-middle-x d-flex justify-content-center w-100 mb-5" style={{ zIndex: 11 }}>
        <button className="btn btn-dark rounded-pill m-2 px-4 py-2" type="button" onClick={startScan}>
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
    <div className="container mt-3 mb-5 position-relative" style={{ zIndex: 1 }}>
      <div className="svg-background">
        <svg preserveAspectRatio="xMidYMid slice" viewBox="10 10 80 80">
          <path
            fill="#9b5de5"
            className="out-top"
            d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"
          />
          <path
            fill="#f15bb5"
            className="in-top"
            d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"
          />
          <path
            fill="#00bbf9"
            className="out-bottom"
            d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"
          />
          <path
            fill="#00f5d4"
            className="in-bottom"
            d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"
          />
        </svg>
      </div>
      <div className="header position-relative" style={{ zIndex: 2 }}>
        <h1 className="display-5 fw-bold">
          <span>ได้แต้มแล้ว</span>
          <br />
          <span>มาเล่นเกมกัน!</span>
        </h1>
        <p className="lead">สนุกกับกิจกรรมสุดพิเศษ สะสมแต้ม เล่นเกม ลุ้นรับคูปองมากมาย!</p>
      </div>

      <div className="row mt-3 mb-5 position-relative" style={{ zIndex: 2 }}>
        <div className="col-md-6 mb-4">
        <div className="card card-1 h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title section-title">
                <i className="bi bi-trophy icon"></i>
                สะสมแต้มง่ายๆ
              </h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">ซื้อครบ 100 บาท รับ 1 แต้ม!</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card card-2 h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title section-title">
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
