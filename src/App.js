import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import liff from "@line/liff";

const LiffComponent = React.lazy(() => import("./components/LiffComponent"));
const QrComponent = React.lazy(() => import("./components/QrComponent"));
const SlotGame = React.lazy(() => import("./games/SlotGame"));
const SlotGame2 = React.lazy(() => import("./games/SlotGame2"));

function App() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const liffState = url.searchParams.get("liff.state");

    if (liffState) {
      const decodedLiffState = decodeURIComponent(liffState);
      const params = new URLSearchParams(decodedLiffState.split("?")[1]);
      console.log("params = " + params);
      const hasTime = params.has("time");
      const hasPoint = params.has("point");

      if (hasTime && hasPoint) {
        localStorage.setItem('time', params.get('time'));
        localStorage.setItem('point', params.get('point'));
        // navigate(`/profile`);
        liff.init({ liffId: "2005387393-XvmK0M34" }).then(() => {
          const userProfile = liff.getProfile();
          setProfile(userProfile);
          localStorage.setItem('profile', profile);
        });
      }
    }
    else{
      const queryParameters = new URLSearchParams(window.location.search);
      console.log("queryParameters = " + queryParameters);
      const time = queryParameters.get("time");
      const point = queryParameters.get("point");
      if (time && point){
        localStorage.setItem('time', time);
        localStorage.setItem('point', point);
        navigate(`/profile`);
      }
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/adminforfilm" element={<QrComponent />}></Route>
        <Route path="/profile" element={<LiffComponent />}></Route>
        <Route path="/slot" element={<SlotGame />}></Route>
        <Route path="/slot2" element={<SlotGame2 />}></Route>
        <Route path="/*" element={<NoMatch />}></Route>
        <Route path="/Home" element={<Navigate to={"/"} />}></Route>
      </Routes>
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
