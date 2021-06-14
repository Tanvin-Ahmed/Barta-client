import { Avatar, CardActionArea, IconButton } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import "./ChatBar.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PeopleIcon from "@material-ui/icons/People";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUserInfo,
  getFriendInfoFromSocket,
  updateChatList,
  updateFriendStatus,
} from "../../app/actions/userAction";
import { useHistory } from "react-router";
import { Spinner } from "react-bootstrap";

const ChatBar = ({ socket }) => {
  const history = useHistory();

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

  const dispatch = useDispatch();

  let userEmail = useRef("");
  let friendMail = useRef("");
  useEffect(() => {
    socket.emit("my-account", userInfo?.email?.split("@")[0]);
    socket.on("add-friend-list", (friendEmail) => {
      if (friendEmail?.email !== friendMail.current) {
        friendMail.current = friendEmail?.email;
        dispatch(getFriendInfoFromSocket(friendEmail?.email));
      }
    });
    socket.on("user-status", (user) => {
      if (friendList[0]) {
        if (user?.email && user.email !== userEmail.current) {
          userEmail.current = user?.email;
          isUserOnline(user, friendList);
        }
      }
      setTimeout(() => {
        userEmail.current = "";
      }, 50);
    });

    const isUserOnline = (user, friendList) => {
      for (let i in friendList) {
        if (friendList[i].email === user?.email) {
          friendList[i].status = user?.status;
          if (user?.status === "inactive") {
            friendList[i].goOfLine = new Date().toUTCString();
          } else {
            friendList[i].goOfLine = "";
          }
          break;
        }
      }
      dispatch(updateFriendStatus(friendList));
    };
  }, [dispatch, socket, userInfo, friendList]);

  const handleSearchForFriend = (e) => {
    e.preventDefault();

    dispatch(getAllUserInfo(e.target.value, userInfo?.email));
  };

  const handleReceiverInfo = (receiver) => {
    sessionStorage.setItem(
      "barta/receiver",
      JSON.stringify({ email: receiver.email })
    );
    history.push(`/chat/${receiver._id}`);
  };

  return (
    <section className="chat__bar">
      <div className="chatBar__header">
        <div className="text__center">
          <h3 className="text-center">Barta</h3>
        </div>
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <div className="avatar">
            <IconButton style={{ position: "relative" }}>
              <Avatar src={userInfo?.photoURL} />
              <div className="onLine" />
            </IconButton>
          </div>
          <div className="more__options">
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>
        <div className="add__friend mt-2 d-flex justify-content-around align-items-center flex-wrap">
          <div>
            <CardActionArea
              onClick={() => dispatch(updateChatList(true))}
              style={{ padding: "0.2rem 2rem" }}
            >
              <PeopleIcon />
            </CardActionArea>
          </div>
          <div>
            <CardActionArea
              onClick={() => dispatch(updateChatList(false))}
              style={{ padding: "0.2rem 2rem" }}
            >
              <PersonAddIcon />
            </CardActionArea>
          </div>
          <div>
            <CardActionArea style={{ padding: "0.2rem 2rem" }}>
              <GroupAddIcon />
            </CardActionArea>
          </div>
        </div>
      </div>
      <div className="list__body">
        {chatList ? (
          <>
            <div className="find__friend mt-3 sticky-top">
              <input
                type="text"
                className="form-control"
                placeholder="Find Friend"
              />
            </div>
            <div className="friend__list mt-2">
              {friendList?.reverse().map((friend) => (
                <CardActionArea
                  key={friend?._id}
                  onClick={() => handleReceiverInfo(friend)}
                  className="px-3 d-flex justify-content-start align-items-center"
                >
                  <div style={{ position: "relative" }} className="mr-3">
                    <Avatar src={friend?.photoURL} />
                    <div
                      className={
                        friend?.status === "active" ? "onLine" : "d-none"
                      }
                    />
                  </div>
                  <h6 className="m-4">{friend?.displayName}</h6>
                </CardActionArea>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="find__users mt-2 sticky-top">
              <input
                onChange={handleSearchForFriend}
                type="text"
                className="form-control"
                placeholder="Add new Friend"
              />
            </div>
            <div className="users__list mt-2">
              {loading ? (
                <div className="loadingSpinner">
                  <Spinner animation="grow" variant="warning" />
                </div>
              ) : (
                users !== [] &&
                users?.map((otherUser) => {
                  if (otherUser.email !== userInfo.email) {
                    return (
                      <CardActionArea
                        key={otherUser._id}
                        onClick={() => handleReceiverInfo(otherUser)}
                        className="px-3 d-flex justify-content-start align-items-center"
                      >
                        <div className="mr-3">
                          <Avatar src={otherUser?.photoURL} />
                        </div>
                        <h6 className="m-4">{otherUser?.displayName}</h6>
                      </CardActionArea>
                    );
                  }
                  return null;
                })
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ChatBar;
