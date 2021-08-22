import React, { useEffect } from "react";
import "./ChatBar.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { isUserOnline } from "./chatBar_logic";
import { ChatBarHeader, ChatList, SearchFriend } from "./chatBar_component";
import {
  getCaller,
  getCallerSignal,
  getUserName,
  isReceivingCall,
  isVideoChat,
  setReceiver,
} from "../../app/actions/privateCallAction";
import { getFriendInfoFromSocket } from "../../app/actions/userAction";

const ChatBar = ({ socket }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    users,
    friendList,
    error,
    loading,
    chatList,
    userInfo,
    makeGroup,
    selectedIdsForGroup,
  } = useSelector((state) => ({
    users: state.userReducer.allUserInfo,
    friendList: state.userReducer.chatList,
    error: state.userReducer.error,
    loading: state.userReducer.loading,
    chatList: state.userReducer.addChatList,
    userInfo: state.userReducer.userInfo,
    // group making tab
    makeGroup: state.userReducer.makeGroup,
    selectedIdsForGroup: state.userReducer.selectedIdsForGroup,
  }));

  //////////////// Friend List Update ///////////////
  useEffect(() => {
    if (socket === null) return;
    socket.on("add-friend-list", (friendEmail) => {
      dispatch(getFriendInfoFromSocket(friendEmail?.email));
    });
    return () => socket.off("add-friend-list");
  }, [socket, dispatch]);

  //////////////// Update friend Status ///////////////////
  useEffect(() => {
    if (socket === null && !friendList.length) return;

    const userStatus = (user) => {
      isUserOnline(user, friendList, dispatch);
    };

    socket.on("user-status", userStatus);
    return () => socket.off("user-status");
  }, [socket, dispatch, friendList]);

  ///////////////////// User Notify Private Call //////////////////
  useEffect(() => {
    // if (socket === null) return;
    socket.on("callUser", (data) => {
      if (data.userToCall === userInfo.email) {
        sessionStorage.setItem(
          "barta/receiver",
          JSON.stringify({ email: data.from })
        );
        dispatch(setReceiver(true));
        dispatch(isReceivingCall(true));
        dispatch(getCaller(data.from));
        dispatch(getUserName(data.name));
        dispatch(getCallerSignal(data.signal));
        data.callType === "video"
          ? dispatch(isVideoChat(true))
          : dispatch(isVideoChat(false));

        socket.emit("call-reach-to-me", data.from);
        history.push(`/chat/${data.callerDataBaseId}`);
      }
    });
    return () => socket.off("callUser");
  }, [dispatch, socket, userInfo, friendList, history]);

  return (
    <section className="chat__bar">
      <ChatBarHeader userPhotoURL={userInfo?.photoURL} dispatch={dispatch} />
      <div className="list__body">
        {chatList && !makeGroup && (
          <ChatList friendList={friendList} history={history} />
        )}
        {((!chatList && !makeGroup) || (!chatList && makeGroup)) && (
          <SearchFriend
            userEmail={userInfo?.email}
            users={users}
            loading={loading}
            history={history}
            dispatch={dispatch}
            makeGroup={makeGroup}
            selectedIdsForGroup={selectedIdsForGroup}
          />
        )}
      </div>
    </section>
  );
};

export default ChatBar;
