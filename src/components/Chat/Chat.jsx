import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
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
import { postFriendInfo, updateChatList } from "../../app/actions/userAction";
import {
  getOneOneChat,
  getOneOneChatFromSocket,
  postOneOneChat,
} from "../../app/actions/messageAction";
import io from "socket.io-client";

const ROOT_CSS = css({
  height: "70%",
  width: "100%",
});
let socket;
const Chat = () => {
  const { addChatList, chatMessage, uploadPercentage } = useSelector(
    (state) => ({
      addChatList: state.userReducer.addChatList,
      chatMessage: state.messageReducer.oneOneMessage,
      uploadPercentage: state.messageReducer.uploadPercentage,
    })
  );
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");
  const [receiverInfo, setReceiverInfo] = useState({});
  const [senderInfo, setSenderInfo] = useState({});

  useEffect(async () => {
    const friend = await sessionStorage.getItem("barta/receiver");
    await setReceiverInfo(JSON.parse(friend));
    const user = await localStorage.getItem("barta/user");
    await setSenderInfo(JSON.parse(user));
  }, []);

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

  useEffect(() => {
    socket = io("http://localhost:5000/");
    socket.emit("join", { roomId });

    socket.on("one_one_chatMessage", (message) => {
      dispatch(getOneOneChatFromSocket(message));
    });
  }, []);

  useMemo(() => {
    dispatch(getOneOneChat(roomId));
  }, []);

  const handleOnEnter = (text) => {
    const chat = {
      id: roomId,
      sender: senderInfo.email,
      message: text,
      timeStamp: new Date().toUTCString(),
    };
    dispatch(postOneOneChat(chat));

    !addChatList &&
      dispatch(
        postFriendInfo(roomId, { friendInfo: [senderInfo, receiverInfo] })
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
        {chatMessage !== [] &&
          chatMessage.map((message) => (
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
                  ? `${senderInfo.displayName}`
                  : `${receiverInfo.displayName}`}
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
        <InputEmoji
          value={inputText}
          onChange={setInputText}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder="Type a message"
        />
        {inputText && (
          <IconButton id="sendIcon">
            <SendIcon />
          </IconButton>
        )}
      </div>
    </section>
  );
};

export default Chat;
