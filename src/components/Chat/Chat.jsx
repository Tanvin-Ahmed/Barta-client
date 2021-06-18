import React, { useEffect, useMemo, useState } from "react";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import { getOneOneChat } from "../../app/actions/messageAction";
import { useParams } from "react-router-dom";
import {
  getOneOneChatMessageFromSocket,
  getRoomId,
  getUsersData,
  handleIsFriendTyping,
  handleOneOneChat,
  receiverStatusFromSocket,
  screen,
} from "./one_one_chat_logic";
import {
  ChatBody,
  ChatFooter,
  ChatHeader,
  UploadProgressBar,
} from "./one_one_chat_component";

const Chat = ({ socket }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  useMemo(() => {
    getUsersData(dispatch, id);
  }, [dispatch, id]);

  const {
    senderInfo,
    receiverInfo,
    addChatList,
    chatMessage,
    uploadPercentage,
    largeScreen,
    typing,
  } = useSelector((state) => ({
    senderInfo: state.userReducer.userInfo,
    receiverInfo: state.userReducer.receiverInfo,
    addChatList: state.userReducer.addChatList,
    chatMessage: state.messageReducer.oneOneMessage,
    uploadPercentage: state.messageReducer.uploadPercentage,
    largeScreen: state.messageReducer.largeScreen,
    typing: state.messageReducer.typing,
  }));
  const [inputText, setInputText] = useState("");

  const roomId = useMemo(() => {
    return getRoomId();
  }, []);

  useEffect(() => {
    socket.emit("join", { roomId });
    handleIsFriendTyping(socket, receiverInfo?.email, dispatch);
    getOneOneChatMessageFromSocket(socket, dispatch);
    receiverStatusFromSocket(socket, receiverInfo, dispatch);
  }, [dispatch, roomId, socket, receiverInfo]);

  useEffect(() => {
    window.addEventListener("resize", screen(dispatch));
    return () => window.removeEventListener("resize", screen(dispatch));
  }, [dispatch]);

  useMemo(() => {
    dispatch(getOneOneChat(roomId));
  }, [dispatch, roomId]);

  const handleOnEnter = () => {
    if (inputText.trim()) {
      handleOneOneChat(
        roomId,
        addChatList,
        setInputText,
        inputText,
        senderInfo?.email,
        receiverInfo?.email,
        dispatch
      );
    }
  };

  return (
    <section className="chat">
      <ChatHeader receiverInfo={receiverInfo} addChatList={addChatList} />

      {uploadPercentage > 0 && (
        <UploadProgressBar uploadPercentage={uploadPercentage} />
      )}

      <ChatBody
        chatMessage={chatMessage}
        senderInfo={senderInfo}
        receiverInfo={receiverInfo}
        typing={typing}
      />

      <ChatFooter
        largeScreen={largeScreen}
        socket={socket}
        senderEmail={senderInfo?.email}
        inputText={inputText}
        setInputText={setInputText}
        handleOnEnter={handleOnEnter}
      />
    </section>
  );
};

export default Chat;
