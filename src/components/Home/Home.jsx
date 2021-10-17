import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChatBar from "../ChatBar/ChatBar";
import Chat from "../Chat/Chat/Chat";
import Login from "../Login/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import ResetPassword from "../Login/ResetPassword/ResetPassword";
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
  getFriendInfoFromSocket,
  getFriendInfo,
  getGroupIdForChatBar,
  setGroupsInfoFromDatabase,
} from "../../app/actions/userAction";
import {
  deleteMessage,
  deleteMessageFromChatBar,
  getNewMessageFromSocket,
  setSendedMessage,
  updateChatBarMessage,
  updateMessageStatus,
} from "../../app/actions/messageAction";

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
    accessToken,
    friendListOpen,
    openGroupList,
    chatMessage,
    roomId,
  } = useSelector((state) => ({
    userInfo: state.userReducer.userInfo,
    openGroupCall: state.groupCallReducer.openGroupCall,
    acceptedGroupCall: state.groupCallReducer.acceptedGroupCall,
    receivingCall: state.privateCall.receivingCall,
    groups: state.userReducer.groups,
    groupInfo: state.userReducer.groupInfo,
    chatList: state.userReducer.chatList,
    accessToken: state.userReducer.accessToken,
    friendListOpen: state.userReducer.friendListOpen,
    openGroupList: state.userReducer.openGroupList,
    chatMessage: state.messageReducer.chatMessages,
    roomId: state.messageReducer.roomId,
  }));

  const [roomIdOfReceivingGroupCall, setRoomIdOfReceivingGroupCall] =
    useState("");
  const [receivingGroupCall, setReceivingGroupCall] = useState(false);
  const [removeGroupCallModal, setRemoveGroupCallModal] = useState(true);

  // ////////////////// post user info ///////////////////////
  useEffect(() => {
    userInfo?.email && socket.emit("user-info", { email: userInfo?.email });
  }, [dispatch, socket, userInfo]);

  //////////////// Show Friend List or Group List /////////////
  const fetchGroupList = useRef(true);
  const fetchFriendList = useRef(true);
  useEffect(() => {
    const getData = () => {
      if (navigator.onLine) {
        friendListOpen &&
          fetchFriendList.current &&
          dispatch(getFriendInfo(userInfo?.email));
        openGroupList &&
          fetchGroupList.current &&
          dispatch(setGroupsInfoFromDatabase(userInfo?.email));

        if (friendListOpen) fetchFriendList.current = false;
        if (openGroupList) fetchGroupList.current = false;
      }
    };
    const conditionOfNetwork = () => {
      fetchFriendList.current = true;
      fetchGroupList.current = true;
      accessToken && getData();
    };
    const webpageLoad = () => {
      window.addEventListener("online", conditionOfNetwork);
      window.addEventListener("offline", conditionOfNetwork);
    };
    window.addEventListener("load", webpageLoad);
    accessToken && getData();

    return () => {
      window.removeEventListener("load", webpageLoad);
      window.removeEventListener("online", conditionOfNetwork);
      window.removeEventListener("offline", conditionOfNetwork);
    };
  }, [userInfo?.email, dispatch, friendListOpen, openGroupList, accessToken]);

  //////////////// Friend List Update ///////////////
  useEffect(() => {
    if (socket === null) return;
    socket.on("add-friend-list", (friendEmail) => {
      dispatch(getFriendInfoFromSocket(friendEmail));
    });
    return () => socket.off("add-friend-list");
  }, [socket, dispatch]);

  //////////////// Group List Update ///////////////
  useEffect(() => {
    if (socket === null) return;
    socket.on("add-group-list", (groupInfo) => {
      if (groupInfo.member === userInfo?.email?.split("@")[0]) {
        dispatch(getGroupIdForChatBar(groupInfo.groupId, "chatBar"));
      }
    });
    return () => socket.off("add-group-list");
  }, [socket, dispatch, userInfo]);

  ///// update chat bar last message ////////
  // get new message from socket
  useEffect(() => {
    socket.on("new-message", (message) => {
      if (message.id === roomId && message.sender === userInfo?.email) {
        dispatch(setSendedMessage(chatMessage, message));
      }
      if (message.id === roomId && message.sender !== userInfo?.email) {
        dispatch(getNewMessageFromSocket(message));
        updateMessageStatus([message?._id]);
      }
      dispatch(
        updateChatBarMessage(message, chatList, userInfo?.email, groups)
      );
    });

    return () => socket.off("new-message");
  }, [
    socket,
    dispatch,
    chatList,
    userInfo?.email,
    groups,
    roomId,
    chatMessage,
  ]);

  // delete message
  useEffect(() => {
    socket.on("delete-chatMessage", ({ _id }) => {
      console.log("deleted message", _id);
      if (chatMessage.length > 0 || chatMessage[0]) {
        dispatch(deleteMessage(chatMessage, _id));
      }
      dispatch(deleteMessageFromChatBar(_id, chatList, groups));
    });
    return () => socket.off("delete-chatMessage");
  }, [socket, dispatch, chatList, groups, chatMessage]);

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
          {!openGroupCall && !acceptedGroupCall && (
            <Router>
              <Switch>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/reset-password/:token">
                  <ResetPassword />
                </Route>
                <PrivateRoute exact path="/">
                  <ChatBar
                    socket={socket}
                    myStream={myStream}
                    groupPeersRef={groupPeersRef}
                    roomIdOfReceivingGroupCall={roomIdOfReceivingGroupCall}
                  />
                </PrivateRoute>
                <PrivateRoute path="/view-profile/:identity">
                  <Profile />
                </PrivateRoute>
                <PrivateRoute path="/update-account/:identity">
                  <UpdateAccount />
                </PrivateRoute>
                <PrivateRoute path="/chat/:id">
                  <Chat
                    socket={socket}
                    myStream={myStream}
                    groupPeersRef={groupPeersRef}
                    roomIdOfReceivingGroupCall={roomIdOfReceivingGroupCall}
                  />
                </PrivateRoute>
                <PrivateRoute path="/chat-settings">
                  <ChatSettings />
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
