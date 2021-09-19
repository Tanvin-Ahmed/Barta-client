import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home/Home";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserInfo } from "./app/actions/userAction";
import io from "socket.io-client";
import PopupMessage from "./components/PopupMessage/PopupMessage";

const App = () => {
  const dispatch = useDispatch();
  useMemo(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  const [showPopup, setShowPopup] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io("http://localhost:5000/");
    setSocket(s);

    return () => s.close();
  }, []);

  // PREVENT RELOAD PAGE //
  useEffect(() => {
    const preventReload = (e) => {
      const ev = e || window.event;
      if (ev.keyCode === 116) {
        // F5 button
        ev.preventDefault();
      } else if (ev.keyCode === 82 && ev.ctrlKey) {
        // ctrl + r
        ev.preventDefault();
      } else if (ev.keyCode === 123) {
        // F12
        ev.preventDefault();
      } else if (ev.keyCode === 73 && ev.shiftKey && ev.ctrlKey) {
        // ctrl + shift + i
        ev.preventDefault();
      }
    };
    document.addEventListener("keydown", preventReload);

    return () => document.removeEventListener("keydown", preventReload);
  }, []);

  // reload issue ///
  // useEffect(() => {
  //   const reload = (e) => {
  //     e.returnValue = "Data will be lost if you leave the page, are you sure?";
  //   };
  //   window.addEventListener("beforeunload", reload);

  //   return () => window.removeEventListener("beforeunload", reload);
  // }, []);

  // popup-message
  useEffect(() => {
    const message = JSON.parse(sessionStorage.getItem("barta/popup-message"));
    if (message === true || message === false) {
      setShowPopup(message);
    }
  }, []);

  return (
    <div className="App">
      {showPopup ? (
        <PopupMessage setShowPopup={setShowPopup} />
      ) : (
        socket && <Home socket={socket} />
      )}
    </div>
  );
};

export default App;
