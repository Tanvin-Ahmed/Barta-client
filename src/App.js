import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home/Home";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserInfo } from "./app/actions/userAction";
import io from "socket.io-client";

const App = () => {
  const dispatch = useDispatch();
  useMemo(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io("http://localhost:5000/");
    setSocket(s);

    return () => s.close();
  }, []);

  return <div className="App">{socket && <Home socket={socket} />}</div>;
};

export default App;
