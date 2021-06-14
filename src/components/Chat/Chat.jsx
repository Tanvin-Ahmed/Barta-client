import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Chat.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CallIcon from "@material-ui/icons/Call";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import ScrollToBottom from "react-scroll-to-bottom";
import InputEmoji from "react-input-emoji";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import { css } from "@emotion/css";
import { useDispatch, useSelector } from "react-redux";
import {
  getReceiverInfo,
  postFriendInfo,
  updateChatList,
} from "../../app/actions/userAction";
import {
  getOneOneChat,
  getOneOneChatFromSocket,
  getScreenSize,
  postOneOneChat,
} from "../../app/actions/messageAction";
import { useParams } from "react-router-dom";

const ROOT_CSS = css({
  height: "70%",
  width: "100%",
});
const Chat = ({ socket }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  useMemo(() => {
    const getUsersData = async () => {
      await dispatch(getReceiverInfo(id));
    };
    getUsersData();
  }, [dispatch, id]);

  const {
    senderInfo,
    receiverInfo,
    addChatList,
    chatMessage,
    uploadPercentage,
    largeScreen,
  } = useSelector((state) => ({
    senderInfo: state.userReducer.userInfo,
    receiverInfo: state.userReducer.receiverInfo,
    addChatList: state.userReducer.addChatList,
    chatMessage: state.messageReducer.oneOneMessage,
    uploadPercentage: state.messageReducer.uploadPercentage,
    largeScreen: state.messageReducer.largeScreen,
  }));
  const [inputText, setInputText] = useState("");

  const roomId = useMemo(() => {
    const sender = JSON.parse(localStorage.getItem("barta/user"))?.email?.split(
      "@"
    );
    const receiver = JSON.parse(
      sessionStorage.getItem("barta/receiver")
    )?.email?.split("@");
    const ascendingSort = [sender[0], receiver[0]].sort();
    return `${ascendingSort[0]}_${ascendingSort[1]}`;
  }, []);

  let lastMessageTime = useRef("");
  useEffect(() => {
    socket.emit("join", { roomId });

    socket.on("one_one_chatMessage", (message) => {
      if (message.timeStamp !== lastMessageTime.current) {
        lastMessageTime.current = message.timeStamp;
        dispatch(getOneOneChatFromSocket(message));
      }
    });
  }, [dispatch, roomId, socket]);

  useEffect(() => {
    const screen = () => {
      console.log(window.innerWidth);
      if (window.innerWidth > 768) {
        dispatch(getScreenSize(true));
      } else {
        dispatch(getScreenSize(false));
      }
    };
    window.addEventListener("resize", screen);

    return () => {
      window.removeEventListener("resize", screen);
    };
  }, [dispatch]);

  console.log(largeScreen);

  useMemo(() => {
    dispatch(getOneOneChat(roomId));
  }, [dispatch, roomId]);

  const handleOnEnter = () => {
    const chat = {
      id: roomId,
      sender: senderInfo.email,
      message: inputText,
      timeStamp: new Date().toUTCString(),
    };
    dispatch(postOneOneChat(chat));

    setInputText("");
    !addChatList &&
      dispatch(
        postFriendInfo(roomId, {
          friendInfo: [
            {
              email: senderInfo?.email,
              friendOf: receiverInfo?.email?.split("@")[0],
            },
            {
              email: receiverInfo.email,
              friendOf: senderInfo?.email?.split("@")[0],
            },
          ],
        })
      ) &&
      dispatch(updateChatList(true));
  };

  return (
    <section className="chat">
      <div className="chat__header">
        <div className="header__info">
          <Avatar src={receiverInfo?.photoURL} />
          <h6
            style={{ fontWeight: "bold", letterSpacing: "1px" }}
            className="p-2"
          >
            {receiverInfo.displayName}
          </h6>
        </div>
        <div className="chat__options">
          <IconButton>
            <CallIcon />
          </IconButton>
          <IconButton>
            <VideoCallIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      {uploadPercentage > 0 && (
        <div className="upload__progressBar">
          <div style={{ width: `${uploadPercentage}%` }} className="bar"></div>
        </div>
      )}

      <ScrollToBottom className={`${ROOT_CSS} chat__body`}>
        {chatMessage.map((message) => (
          <div
            key={message._id}
            className={
              message?.sender === senderInfo.email
                ? "chat__text myChat"
                : "chat__text"
            }
          >
            <p className="name">
              {message?.sender === senderInfo.email
                ? `${senderInfo.displayName?.split(" ")[0]}`
                : `${receiverInfo.displayName?.split(" ")[0]}`}
            </p>
            <div>
              {message?.message}
              <p className="time">
                {new Date(message?.timeStamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </ScrollToBottom>

      <div className="chat__footer">
        <IconButton>
          <AttachFileIcon />
        </IconButton>
        {largeScreen ? (
          <>
            <InputEmoji
              value={inputText}
              onChange={setInputText}
              cleanOnEnter
              onEnter={handleOnEnter}
              placeholder="Type a message"
            />
            {inputText.trim() && (
              <IconButton onClick={handleOnEnter} id="sendIcon">
                <SendIcon />
              </IconButton>
            )}
          </>
        ) : (
          <>
            <InputEmoji
              value={inputText}
              onChange={setInputText}
              placeholder="Type a message"
            />
            {inputText.trim() && (
              <IconButton onClick={handleOnEnter} id="sendIcon">
                <SendIcon />
              </IconButton>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Chat;
