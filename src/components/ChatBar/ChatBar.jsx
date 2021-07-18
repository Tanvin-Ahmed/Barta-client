import React, { useEffect } from "react";
import "./ChatBar.css";
import { useDispatch, useSelector } from "react-redux";
import { updateFriendStatus } from "../../app/actions/userAction";
import { useHistory } from "react-router";
import { friendListUpdate } from "./chatBar_logic";
import { ChatBarHeader, ChatList, SearchFriend } from "./chatBar_component";
import {
  getCaller,
  getCallerSignal,
  getUserName,
  isReceivingCall,
} from "../../app/actions/privateVideoCallAction";

const ChatBar = ({ socket }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { users, friendList, error, loading, chatList, userInfo } = useSelector(
    (state) => ({
      users: state.userReducer.allUserInfo,
      friendList: state.userReducer.chatList,
      error: state.userReducer.error,
      loading: state.userReducer.loading,
      chatList: state.userReducer.addChatList,
      userInfo: state.userReducer.userInfo,
    })
  );

  useEffect(() => {
    socket.emit("my-account", userInfo?.email?.split("@")[0]);
    friendListUpdate(socket, dispatch);
    updateFriendStatus(socket, friendList, dispatch);

    // for video chat
    socket.on("callUser", (data) => {
      if (data.userToCall === userInfo.email) {
        sessionStorage.setItem(
          "barta/receiver",
          JSON.stringify({ email: data.from })
        );
        dispatch(isReceivingCall(true));
        dispatch(getCaller(data.from));
        dispatch(getUserName(data.name));
        dispatch(getCallerSignal(data.signal));
        history.push(`/chat/${data.callerDataBaseId}`);
      }
    });
  }, [dispatch, socket, userInfo, friendList, history]);

  return (
    <section className="chat__bar">
      <ChatBarHeader userPhotoURL={userInfo?.photoURL} dispatch={dispatch} />
      <div className="list__body">
        {chatList ? (
          <ChatList friendList={friendList} history={history} />
        ) : (
          <SearchFriend
            userEmail={userInfo?.email}
            users={users}
            loading={loading}
            history={history}
            dispatch={dispatch}
          />
        )}
      </div>
    </section>
  );
};

export default ChatBar;
