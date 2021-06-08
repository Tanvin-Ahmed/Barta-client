import { Avatar, CardActionArea, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./ChatBar.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PeopleIcon from "@material-ui/icons/People";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUserInfo,
  getFriendInfo,
  updateChatList,
} from "../../app/actions/userAction";
import { useHistory } from "react-router";
import { Spinner } from "react-bootstrap";
import io from "socket.io-client";

let socket;
const ChatBar = () => {
  const history = useHistory();

  const { users, friendList, error, loading, chatList } = useSelector(
    (state) => ({
      users: state.userReducer.allUserInfo,
      friendList: state.userReducer.chatList,
      error: state.userReducer.error,
      loading: state.userReducer.loading,
      chatList: state.userReducer.addChatList,
    })
  );

  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    let userData = localStorage.getItem("barta/user");
    userData = JSON.parse(userData);
    setUserInfo(userData);

    socket = io("http://localhost:5000/");

    dispatch(getFriendInfo(userData.email));
  }, []);

  const handleSearchForFriend = (e) => {
    e.preventDefault();

    dispatch(getAllUserInfo(e.target.value, userInfo.email));
  };

  const handleReceiverInfo = (receiver) => {
    sessionStorage.setItem("barta/receiver", JSON.stringify(receiver));
    history.push("/chat");
  };
  console.log("chat bar render");

  return (
    <section className="chat__bar">
      <div className="chatBar__header">
        <div className="text-center">
          <h3>Barta</h3>
        </div>
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <div className="avatar">
            <IconButton>
              <Avatar src={userInfo.photoURL} />
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
              {friendList?.map((friend) => (
                <CardActionArea
                  onClick={() => handleReceiverInfo(friend)}
                  className="px-3 d-flex justify-content-start align-items-center"
                >
                  <div className="mr-3">
                    <Avatar src={friend.photoURL} />
                  </div>
                  <h6 className="m-4">{friend.displayName}</h6>
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
                users?.map((otherUser) => {
                  if (otherUser.email !== userInfo.email) {
                    return (
                      <CardActionArea
                        onClick={() => handleReceiverInfo(otherUser)}
                        className="px-3 d-flex justify-content-start align-items-center"
                      >
                        <div className="mr-3">
                          <Avatar src={otherUser.photoURL} />
                        </div>
                        <h6 className="m-4">{otherUser.displayName}</h6>
                      </CardActionArea>
                    );
                  }
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
