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
import { setCallerName } from "../../app/actions/groupCallAction";
import UpdateAccount from "../UpdateAccount/UpdateAccount";
import Profile from "../Profile/Profile";
import {
  updateGroupListData,
  updateProfileDataFromSocket,
} from "../../app/actions/userAction";

const Home = ({ socket }) => {
  const myStream = useRef(null);
  const groupPeersRef = useRef([]);
  const dispatch = useDispatch();
  const {
    userInfo,
    openGroupCall,
    acceptedGroupCall,
    receivingCall,
    groups,
    groupInfo,
    chatList,
  } = useSelector((state) => ({
    userInfo: state.userReducer.userInfo,
    openGroupCall: state.groupCallReducer.openGroupCall,
    acceptedGroupCall: state.groupCallReducer.acceptedGroupCall,
    receivingCall: state.privateCall.receivingCall,
    groups: state.userReducer.groups,
    groupInfo: state.userReducer.groupInfo,
    chatList: state.userReducer.chatList,
  }));

  const [roomIdOfReceivingGroupCall, setRoomIdOfReceivingGroupCall] =
    useState("");
  const [receivingGroupCall, setReceivingGroupCall] = useState(false);
  const [removeGroupCallModal, setRemoveGroupCallModal] = useState(true);

  // ////////////////// post user info ///////////////////////
  useEffect(() => {
    userInfo?.email && socket.emit("user-info", { email: userInfo?.email });
  }, [dispatch, socket, userInfo]);

  // update group info
  useEffect(() => {
    socket.on("update-group-data", (data) => {
      const isMyGroup = userInfo?.groups?.find((g) => g.groupId === data._id);
      if (isMyGroup) {
        dispatch(updateGroupListData(data, groups, isMyGroup, groupInfo));
      }
    });

    return () => socket.off("update-group-data");
  }, [socket, userInfo, dispatch, groups, groupInfo]);

  // update my profile or friend info
  useEffect(() => {
    socket.on("update-profile-data", (data) => {
      dispatch(updateProfileDataFromSocket(data, userInfo, chatList));
    });
  }, [socket, userInfo, dispatch, chatList]);

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
  }, [socket, dispatch, userInfo?.email, receivingCall, receivingGroupCall]);

  // useEffect(() => {
  //   // socket.emit("is user present in group call", roomId);
  //   socket.on("total user", ({ usersInThisRoom, roomID }) => {
  //     if (roomID !== roomIdOfReceivingGroupCall || roomID !== roomId) return;
  //     setRoomIdOfReceivingGroupCall(roomID);
  //     if (usersInThisRoom.length) dispatch(setShowCallButtons(false));
  //     else dispatch(setShowCallButtons(true));
  //   });

  //   return () => socket.off("total user");
  // }, [socket, roomIdOfReceivingGroupCall, dispatch, roomId]);

  return (
    <section className="home">
      {socket && (
        <>
          {(openGroupCall || acceptedGroupCall) && (
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
          {receivingGroupCall &&
            !acceptedGroupCall &&
            !removeGroupCallModal && (
              <NotificationModalForGroupCall
                socket={socket}
                roomIdOfReceivingGroupCall={roomIdOfReceivingGroupCall}
                groupPeersRef={groupPeersRef}
                myStream={myStream}
                setRemoveGroupCallModal={setRemoveGroupCallModal}
              />
            )}
          <Router>
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <PrivateRoute exact path="/">
                {!openGroupCall && !acceptedGroupCall && (
                  <ChatBar socket={socket} />
                )}
              </PrivateRoute>
              <PrivateRoute path="/view-profile/:identity">
                {!openGroupCall && !acceptedGroupCall && <Profile />}
              </PrivateRoute>
              <PrivateRoute path="/update-account/:identity">
                {!openGroupCall && !acceptedGroupCall && <UpdateAccount />}
              </PrivateRoute>
              <PrivateRoute path="/chat/:id">
                {!openGroupCall && !acceptedGroupCall && (
                  <Chat
                    socket={socket}
                    myStream={myStream}
                    groupPeersRef={groupPeersRef}
                    roomIdOfReceivingGroupCall={roomIdOfReceivingGroupCall}
                  />
                )}
              </PrivateRoute>
              <PrivateRoute path="/chat-settings">
                {!openGroupCall && !acceptedGroupCall && <ChatSettings />}
              </PrivateRoute>
            </Switch>
          </Router>
        </>
      )}
    </section>
  );
};

export default Home;
