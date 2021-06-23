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
  ShowFileBeforeUpload,
  UploadFile,
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
    clickUploadOption,
    chosenFiles,
  } = useSelector((state) => ({
    senderInfo: state.userReducer.userInfo,
    receiverInfo: state.userReducer.receiverInfo,
    addChatList: state.userReducer.addChatList,
    chatMessage: state.messageReducer.oneOneMessage,
    uploadPercentage: state.messageReducer.uploadPercentage,
    largeScreen: state.messageReducer.largeScreen,
    typing: state.messageReducer.typing,
    clickUploadOption: state.messageReducer.clickUploadOption,
    chosenFiles: state.messageReducer.chosenFiles,
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
    if (inputText.trim() || chosenFiles[0]) {
      handleOneOneChat(
        roomId,
        addChatList,
        setInputText,
        inputText,
        senderInfo?.email,
        receiverInfo?.email,
        dispatch,
        chosenFiles
      );
    }
  };

  return (
    <section className="chat">
      <ChatHeader
        receiverInfo={receiverInfo}
        addChatList={addChatList}
        largeScreen={largeScreen}
      />

      {uploadPercentage > 0 && (
        <UploadProgressBar uploadPercentage={uploadPercentage} />
      )}

      <ChatBody
        chatMessage={chatMessage}
        senderInfo={senderInfo}
        receiverInfo={receiverInfo}
        typing={typing}
      />

      {chosenFiles[0] && (
        <ShowFileBeforeUpload chosenFiles={chosenFiles} dispatch={dispatch} />
      )}
      {clickUploadOption && <UploadFile dispatch={dispatch} />}

      <ChatFooter
        largeScreen={largeScreen}
        socket={socket}
        senderEmail={senderInfo?.email}
        inputText={inputText}
        setInputText={setInputText}
        handleOnEnter={handleOnEnter}
        dispatch={dispatch}
        clickUploadOption={clickUploadOption}
        chosenFiles={chosenFiles[0]}
      />
    </section>
  );
};

export default Chat;
