import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home/Home";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { getUserInfo } from "./app/actions/userAction";
import io from "socket.io-client";
import { useRef } from "react";

const App = () => {
  const socket = useRef(io("http://localhost:5000/"));
  const dispatch = useDispatch();

  useMemo(async () => {
    await dispatch(getUserInfo());
  }, [dispatch]);

  return (
    <div className="App">
      <Home socket={socket.current} />
    </div>
  );
};

export default App;
