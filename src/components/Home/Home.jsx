import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChatBar from "../ChatBar/ChatBar";
import Chat from "../Chat/Chat/Chat";
import Login from "../Login/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

import { useDispatch, useSelector } from "react-redux";
import ChatSettings from "../Chat/ChatSettings/ChatSettings";
import {
  setReceivingGroupCall,
  setRoomIdOfReceivingGroupCall,
  isVideoChat,
  setCallerName,
} from "../../app/actions/privateCallAction";
import GroupCall from "../Chat/GroupCall/GroupCall";

const Home = ({ socket }) => {
  const myStream = useRef(null);
  const groupPeersRef = useRef([]);
  const dispatch = useDispatch();
  const { userInfo, receivingGroupCall, openGroupCall } = useSelector(
    (state) => ({
      userInfo: state.userReducer.userInfo,
      receivingGroupCall: state.privateCall.receivingGroupCall,
      openGroupCall: state.privateCall.openGroupCall,
    })
  );
  const [roomIdOfReceivingGroupCall, setRoomIdOfReceivingGroupCall] =
    useState("");

  // ////////////////// post user info ///////////////////////
  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem("barta/user"));
    socket.emit("user-info", { email: userInfo?.email });
  }, [dispatch, socket]);

  ////////////// GROUP CALL RECEIVE OTHER USERS //////////////
  useEffect(() => {
    socket.on(
      "group call for you",
      ({ callerID, callerName, member, roomID, callType }) => {
        if (member === userInfo?.email) {
          setRoomIdOfReceivingGroupCall(roomID);
          dispatch(setCallerName(callerName));
          if (callType === "Video Call") {
            dispatch(isVideoChat(true));
          } else if (callType === "Audio Call") {
            dispatch(isVideoChat(false));
          }
          socket.emit("call-reach-to-me", callerID);
          dispatch(setReceivingGroupCall(true));
        }
      }
    );
    return () => socket.off("group call for you");
  }, [socket, dispatch, userInfo?.email]);

  return (
    <section className="home">
      {socket && (
        <>
          {(openGroupCall || receivingGroupCall) && (
            <GroupCall
              socket={socket}
              myStream={myStream}
              groupPeersRef={groupPeersRef}
              roomIdOfReceivingGroupCall={roomIdOfReceivingGroupCall}
            />
          )}
          {/* {(openPrivateCall || receivingCall || userStream.current) && (
            <PrivateCall
              socket={socket}
              userStream={userStream}
              myStream={myStream}
              connectionRef={connectionRef}
              Peer={Peer}
            />
          )} */}
          {!openGroupCall && !receivingGroupCall && (
            <Router>
              <Switch>
                <PrivateRoute exact path="/">
                  <ChatBar socket={socket} />
                </PrivateRoute>
                <Route path="/login">
                  <Login />
                </Route>
                <PrivateRoute path="/chat/:id">
                  <Chat
                    socket={socket}
                    myStream={myStream}
                    groupPeersRef={groupPeersRef}
                  />
                </PrivateRoute>
                <PrivateRoute path="/chat-settings">
                  <ChatSettings socket={socket} />
                </PrivateRoute>
              </Switch>
            </Router>
          )}
        </>
      )}
    </section>
  );
};

export default Home;
