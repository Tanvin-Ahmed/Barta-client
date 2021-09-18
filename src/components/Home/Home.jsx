import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChatBar from "../ChatBar/ChatBar";
import Chat from "../Chat/Chat/Chat";
import Login from "../Login/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

import { useDispatch, useSelector } from "react-redux";
import ChatSettings from "../Chat/ChatSettings/ChatSettings";
import { isVideoChat } from "../../app/actions/privateCallAction";
import GroupCall from "../Chat/GroupCall/GroupCall";
import NotificationModalForGroupCall from "../Chat/GroupCall/NotificationModalForGroupCall/NotificationModalForGroupCall";
import {
  setCallerName,
  setShowCallButtons,
} from "../../app/actions/groupCallAction";

const Home = ({ socket }) => {
  const myStream = useRef(null);
  const groupPeersRef = useRef([]);
  const dispatch = useDispatch();
  const { userInfo, openGroupCall, callAccepted } = useSelector((state) => ({
    userInfo: state.userReducer.userInfo,
    openGroupCall: state.groupCallReducer.openGroupCall,
    callAccepted: state.privateCall.callAccepted,
  }));

  const [roomIdOfReceivingGroupCall, setRoomIdOfReceivingGroupCall] =
    useState("");
  const [receivingGroupCall, setReceivingGroupCall] = useState(false);
  const [removeGroupCallModal, setRemoveGroupCallModal] = useState(true);

  // reload issue ///
  useEffect(() => {
    const reload = (e) => {
      console.log(e);
      e.returnValue = "Data will be lost if you leave the page, are you sure?";
    };
    window.addEventListener("beforeunload", reload);

    return () => window.removeEventListener("beforeunload", reload);
  }, []);

  // ////////////////// post user info ///////////////////////
  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem("barta/user"));
    socket.emit("user-info", { email: userInfo?.email });
  }, [dispatch, socket]);

  ////////////////  GROUP CALL ///////////////////
  //************* GROUP CALL RECEIVE OTHER USERS ************//
  useEffect(() => {
    socket.on(
      "group call for you",
      ({ callerID, callerName, member, roomID, callType }) => {
        if (member === userInfo?.email) {
          setRemoveGroupCallModal(false);
          setReceivingGroupCall(true);
          setRoomIdOfReceivingGroupCall(roomID);
          dispatch(setCallerName(callerName));
          if (callType === "Video Call") {
            dispatch(isVideoChat(true));
          } else if (callType === "Audio Call") {
            dispatch(isVideoChat(false));
          }
          socket.emit("call-reach-to-me", callerID);
        }
      }
    );
    return () => socket.off("group call for you");
  }, [socket, dispatch, userInfo?.email]);

  useEffect(() => {
    // socket.emit("is user present in group call", roomId);
    socket.on("total user", ({ usersInThisRoom, roomID }) => {
      if (roomID !== roomIdOfReceivingGroupCall) return;
      if (usersInThisRoom.length) dispatch(setShowCallButtons(false));
      else dispatch(setShowCallButtons(true));
    });

    return () => socket.off("total user");
  }, [socket, roomIdOfReceivingGroupCall, dispatch]);

  return (
    <section className="home">
      {socket && (
        <>
          {(openGroupCall || callAccepted) && (
            <GroupCall
              socket={socket}
              myStream={myStream}
              groupPeersRef={groupPeersRef}
              roomIdOfReceivingGroupCall={roomIdOfReceivingGroupCall}
              setRoomIdOfReceivingGroupCall={setRoomIdOfReceivingGroupCall}
              setReceivingGroupCall={setReceivingGroupCall}
              receivingGroupCall={receivingGroupCall}
            />
          )}
          {receivingGroupCall && !callAccepted && !removeGroupCallModal && (
            <NotificationModalForGroupCall
              socket={socket}
              roomIdOfReceivingGroupCall={roomIdOfReceivingGroupCall}
              groupPeersRef={groupPeersRef}
              myStream={myStream}
              setRemoveGroupCallModal={setRemoveGroupCallModal}
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
          {!openGroupCall && !callAccepted && (
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
                    roomIdOfReceivingGroupCall={roomIdOfReceivingGroupCall}
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
