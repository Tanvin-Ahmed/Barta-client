import React, { useEffect } from "react";
import "./Home.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChatBar from "../ChatBar/ChatBar";
import Chat from "../Chat/Chat";
import Login from "../Login/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { useDispatch } from "react-redux";
import { getFriendInfo } from "../../app/actions/userAction";

const Home = ({ socket }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let userInfo = localStorage.getItem("barta/user");
    userInfo = JSON.parse(userInfo);
    socket.emit("user-info", { email: userInfo?.email });
    dispatch(getFriendInfo(userInfo?.email));
  }, [dispatch, socket]);

  return (
    <section className="home">
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
    </section>
  );
};

export default Home;
