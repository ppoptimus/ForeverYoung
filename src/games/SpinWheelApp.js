import React, { useState, useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import './SpinWheel.css'

const SpinWheel = () => {
  const wheelRef = useRef(null);
  const [finalValue, setFinalValue] = useState("Click On The Spin Button To Start");
  const rotationValues = [
    { minDegree: 0, maxDegree: 30, value: 2 },
    { minDegree: 31, maxDegree: 90, value: 1 },
    { minDegree: 91, maxDegree: 150, value: 6 },
    { minDegree: 151, maxDegree: 210, value: 5 },
    { minDegree: 211, maxDegree: 270, value: 4 },
    { minDegree: 271, maxDegree: 330, value: 3 },
    { minDegree: 331, maxDegree: 360, value: 2 },
  ];
  const data = [16, 16, 16, 16, 16, 16];
  const pieColors = ["#8b35bc", "#b163da", "#8b35bc", "#b163da", "#8b35bc", "#b163da"];
  let myChart = useRef(null);
  let count = useRef(0);
  let resultValue = useRef(101);

  useEffect(() => {
    const ctx = wheelRef.current.getContext("2d");
    if (myChart.current) {
      myChart.current.destroy(); // ทำลาย Chart เก่า
    }
    myChart.current = new Chart(ctx, {
      // สร้าง Chart ใหม่ที่นี่
      plugins: [ChartDataLabels],
      type: "pie",
      data: {
        labels: [1, 2, 3, 4, 5, 6],
        datasets: [
          {
            backgroundColor: pieColors,
            data: data,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 0 },
        plugins: {
          tooltip: false,
          legend: {
            display: false,
          },
          datalabels: {
            color: "#ffffff",
            formatter: (_, context) => context.chart.data.labels[context.dataIndex],
            font: { size: 24 },
          },
        },
      },
    });
  
    // Cleanup function
    return () => {
      if (myChart.current) {
        myChart.current.destroy(); // ทำลาย Chart เมื่อ component SpinWheel ถูก unmount
      }
    };
  }, []); // ใช้วงเล็บว่างใน useEffect เพื่อให้ทำงานเฉพาะครั้งแรกที่ component ถูก render เท่านั้น
  

  const valueGenerator = (angleValue) => {
    for (let i of rotationValues) {
      if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
        setFinalValue(`Value: ${i.value}`);
        break;
      }
    }
  };

  const spinWheel = () => {
    count.current = 0;
    resultValue.current = 101;
    setFinalValue("Good Luck!");
    let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
    let rotationInterval = setInterval(() => {
      myChart.current.options.rotation += resultValue.current;
      myChart.current.update();
      if (myChart.current.options.rotation >= 360) {
        count.current += 1;
        resultValue.current -= 5;
        myChart.current.options.rotation = 0;
      } else if (count.current > 15 && myChart.current.options.rotation === randomDegree) {
        valueGenerator(randomDegree);
        clearInterval(rotationInterval);
      }
    }, 10);
  };

  return (
    <div className="wrapper">
      <div className="container">
        <canvas ref={wheelRef} id="wheel"></canvas>
        <button id="spin-btn" onClick={spinWheel}>
          Spin
        </button>
        <img src={process.env.PUBLIC_URL + "/img/arrow.svg"} alt="spinner-arrow" />
      </div>
      <div id="final-value">
        <p>{finalValue}</p>
      </div>
    </div>
  );
};

export default SpinWheel;
