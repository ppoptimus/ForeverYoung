import React, { useState } from "react";
import "./SlotGame.css";

const symbols = [
  process.env.PUBLIC_URL + "/img/coffeeSleep.png",
  process.env.PUBLIC_URL + "/img/milkshake.png",
  process.env.PUBLIC_URL + "/img/hotcoffee.png",
  process.env.PUBLIC_URL + "/img/caramel.png",
  process.env.PUBLIC_URL + "/img/greentea.png",
  process.env.PUBLIC_URL + "/img/thaitea.png",
  process.env.PUBLIC_URL + "/img/milkshake.png",
  process.env.PUBLIC_URL + "/img/milkshake.png",
  process.env.PUBLIC_URL + "/img/milkshake.png",
  process.env.PUBLIC_URL + "/img/milkshake.png",
  process.env.PUBLIC_URL + "/img/hotcoffee.png",
  process.env.PUBLIC_URL + "/img/thaitea.png",
  process.env.PUBLIC_URL + "/img/thaitea.png",
  process.env.PUBLIC_URL + "/img/thaitea.png",
  process.env.PUBLIC_URL + "/img/lincheepeach.png",
];

const getRandomSymbol = () =>
  symbols[Math.floor(Math.random() * symbols.length)];

const SlotMachine = () => {
  const [slot1, setSlot1] = useState(symbols[0]);
  const [slot2, setSlot2] = useState(symbols[1]);
  const [slot3, setSlot3] = useState(symbols[2]);
  const [result, setResult] = useState("");
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    setSpinning(true);
    setResult("");

    const duration = 2000; // Set spinning duration to 2 seconds

    setTimeout(() => {
      const newSlot1 = getRandomSymbol();
      const newSlot2 = getRandomSymbol();
      const newSlot3 = getRandomSymbol();

      setSlot1(newSlot1);
      setSlot2(newSlot2);
      setSlot3(newSlot3);

      if (newSlot1 === newSlot2 && newSlot2 === newSlot3) {
        setResult("You win!");
      } else {
        setResult("Try again!");
      }

      setSpinning(false);
    }, duration);
  };

  return (
    <div>
      <div className="slot-machine bg-contain bg-no-repeat bg-center slot-bg">
        
        <div className={`slots ${spinning ? "spinning" : ""}`}>
          <div className="slot">
            <img style={{marginRight:"1rem", marginLeft:"-1.5rem"}} src={slot1} width={130} />
          </div>
          <div className="slot">
            <img style={{marginLeft:"-1.75rem"}} src={slot2} width={140} />
          </div>
          <div className="slot">
            <img style={{marginLeft:"-1.5rem"}} src={slot3} width={130} />
          </div>
        </div>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={spin}
        disabled={spinning}>
        Spin
      </button>
      <div className="result">ผล : {result}</div>
    </div>
  );
};

const SlotGame = () => (
  <div className="App">
    <h1>React Slot Machine</h1>
    <SlotMachine />
  </div>
);

export default SlotGame;
