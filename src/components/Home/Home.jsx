import React, { useEffect } from "react";
import "./Home.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChatBar from "../ChatBar/ChatBar";
import Chat from "../Chat/Chat";
import Login from "../Login/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const Home = () => {
  console.log("home was rendered");
  return (
    <section className="home">
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <ChatBar />
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <PrivateRoute path="/chat">
            <Chat key="1" />
          </PrivateRoute>
        </Switch>
      </Router>
    </section>
  );
};

export default Home;
