import React, { useEffect } from "react";
import "./Home.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChatBar from "../ChatBar/ChatBar";
import Chat from "../Chat/Chat/Chat";
import Login from "../Login/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

import { useDispatch } from "react-redux";
import { getFriendInfo } from "../../app/actions/userAction";

const Home = ({ socket }) => {
  const dispatch = useDispatch();

  // ////////////////// post user info ///////////////////////
  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem("barta/user"));
    dispatch(getFriendInfo(userInfo?.email));
    if (socket === null && !userInfo?.email) return;
    socket.emit("user-info", { email: userInfo?.email });
  }, [dispatch, socket]);

  return (
    <section className="home">
      {socket && (
        <Router>
          <Switch>
            <PrivateRoute exact path="/">
              <ChatBar socket={socket} />
            </PrivateRoute>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/chat/:id">
              <Chat socket={socket} />
            </PrivateRoute>
          </Switch>
        </Router>
      )}
    </section>
  );
};

export default Home;
