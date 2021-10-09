import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home/Home";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserInfo } from "./app/actions/userAction";
import io from "socket.io-client";
import PopupMessage from "./components/PopupMessage/PopupMessage";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

const App = () => {
  const dispatch = useDispatch();
  const { tokenVerifySpinner } = useSelector((state) => ({
    tokenVerifySpinner: state.userReducer.tokenVerifySpinner,
  }));

  const [showPopup, setShowPopup] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const getData = () => {
      if (navigator.onLine) {
        dispatch(getUserInfo("firstTime"));
      }
    };
    const conditionOfNetwork = () => {
      getData();
    };
    const webpageLoad = () => {
      window.addEventListener("online", conditionOfNetwork);
      window.addEventListener("offline", conditionOfNetwork);
    };
    window.addEventListener("load", webpageLoad);
    getData();

    return () => {
      window.removeEventListener("load", webpageLoad);
      window.removeEventListener("online", conditionOfNetwork);
      window.removeEventListener("offline", conditionOfNetwork);
    };
  }, [dispatch]);

  // socket
  useEffect(() => {
    const s = io("https://barta-the-real-time-chat-app.herokuapp.com/");
    setSocket(s);

    return () => s.close();
  }, []);

  // refresh jwt
  useEffect(() => {
    setInterval(() => {
      dispatch(getUserInfo());
    }, 60 * 60000);
  }, [dispatch]);

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
      ) : tokenVerifySpinner ? (
        <div className="token__spinner">
          <CircularProgress className="spinner" size="small" />
        </div>
      ) : (
        socket && <Home socket={socket} />
      )}
    </div>
  );
};

export default App;
