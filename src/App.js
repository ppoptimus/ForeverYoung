import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import "./App.css";

const LiffComponent = React.lazy(() => import("./components/LiffComponent"));
const QrComponent = React.lazy(() => import("./components/QrComponent"));
const SlotGame = React.lazy(() => import("./games/SlotGame"));
const SlotGame2 = React.lazy(() => import("./games/SlotGame2"));

function App() {
  const [fromQr, setFromQr] = useState(true);
  const url = new URL(window.location.href);
  const liffState = url.searchParams.get('liff.state');
  const decodedLiffState = decodeURIComponent(liffState);
  const params = new URLSearchParams(decodedLiffState.split('?')[1]);
  const time = params.get('time');
  const point = params.get('point');
  const isAdmin = url.searchParams.has("adminforfilm");

  useEffect(() => {
    if(time&point){
      setFromQr(true);
    }
  }, [])
  
  if(fromQr){
    <Navigate to="/profile" replace={true} />
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/adminforfilm" element={<QrComponent />}></Route>
          <Route path="/profile" element={<LiffComponent />}></Route>
          <Route path="/slot" element={<SlotGame />}></Route>
          <Route path="/slot2" element={<SlotGame2 />}></Route>
          <Route path="/*" element={<NoMatch />}></Route>
          <Route path="/Home" element={<Navigate to={"/"} />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>This is Home</h1>
      
    </div>
  );
}
export default App;
