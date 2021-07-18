import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import { getOneOneChat } from "../../app/actions/messageAction";
import { useParams } from "react-router-dom";
import Peer from "simple-peer";
import {
  deleteChatMessage,
  getOneOneChatMessageFromSocket,
  getRoomId,
  getUsersData,
  handleIsFriendTyping,
  handleOneOneChat,
  receiverStatusFromSocket,
  screen,
  updateReact,
} from "./one_one_chat_logic";
import {
  ChatBody,
  ChatFooter,
  ChatHeader,
  ShowFileBeforeUpload,
  UploadFile,
  UploadProgressBar,
} from "./one_one_chat_component";
import PrivateVideoCall from "./Call/VideoCall/PrivateVideoCall/PrivateVideoCall";
import {
  getMyId,
  getMyName,
  getStream,
  getUserId,
  isCallAccepted,
  isReceivingCall,
  setVideoCallIsOpen,
} from "../../app/actions/privateVideoCallAction";

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
    isOpenOptions,
    reactTabIsOpen,
    openPrivateVideoCall,
    myId,
    idToCall,
    myName,
    receivingCall,
  } = useSelector((state) => ({
    // private chat
    senderInfo: state.userReducer.userInfo,
    receiverInfo: state.userReducer.receiverInfo,
    addChatList: state.userReducer.addChatList,
    chatMessage: state.messageReducer.oneOneMessage,
    uploadPercentage: state.messageReducer.uploadPercentage,
    largeScreen: state.messageReducer.largeScreen,
    typing: state.messageReducer.typing,
    clickUploadOption: state.messageReducer.clickUploadOption,
    chosenFiles: state.messageReducer.chosenFiles,
    isOpenOptions: state.messageReducer.isOpenOptions,
    reactTabIsOpen: state.messageReducer.reactTabIsOpen,

    // private video call
    openPrivateVideoCall: state.privateVideoCall.openPrivateVideoCall,
    myId: state.privateVideoCall.myId,
    idToCall: state.privateVideoCall.idToCall,
    myName: state.privateVideoCall.myName,
    receivingCall: state.privateVideoCall.receivingCall,
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
    chatMessage.length > 0 && updateReact(socket, dispatch, chatMessage);
    chatMessage.length > 0 && deleteChatMessage(socket, dispatch, chatMessage);

    // video chat data
    dispatch(getUserId(receiverInfo.email));
    dispatch(getMyId(senderInfo.email));
    dispatch(getMyName(senderInfo.displayName));
  }, [dispatch, roomId, socket, receiverInfo, chatMessage, senderInfo]);

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

  ///////////////////// Private Call /////////////////
  const connectionRef = useRef();
  const userVideo = useRef();
  const myVideo = useRef();

  const callUser = () => {
    dispatch(setVideoCallIsOpen(true));
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        dispatch(getStream(stream));
        myVideo.current.srcObject = stream;

        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
        });

        peer.on("signal", (signal) => {
          socket.emit("callUser", {
            userToCall: idToCall,
            signal: signal,
            from: myId,
            name: myName,
            callerDataBaseId: id,
          });
        });

        socket.on("callAccepted", (data) => {
          if (data.to === senderInfo.email) {
            dispatch(isCallAccepted(true));
            dispatch(isReceivingCall(false));
            peer.signal(data.signal);
          }
        });

        peer.on("stream", (stream) => {
          userVideo.current.srcObject = stream;
        });

        connectionRef.current = peer;
      });
  };

  return (
    <section className="chat">
      {openPrivateVideoCall || receivingCall || userVideo.current ? (
        <PrivateVideoCall
          socket={socket}
          userVideo={userVideo}
          myVideo={myVideo}
          connectionRef={connectionRef}
          Peer={Peer}
        />
      ) : (
        <>
          <ChatHeader
            receiverInfo={receiverInfo}
            addChatList={addChatList}
            largeScreen={largeScreen}
            callUser={callUser}
          />

          {uploadPercentage > 0 && (
            <UploadProgressBar uploadPercentage={uploadPercentage} />
          )}
          <ChatBody
            chatMessage={chatMessage}
            senderInfo={senderInfo}
            receiverInfo={receiverInfo}
            typing={typing}
            dispatch={dispatch}
            isOpenOptions={isOpenOptions}
            reactTabIsOpen={reactTabIsOpen}
          />

          {chosenFiles[0] && (
            <ShowFileBeforeUpload
              chosenFiles={chosenFiles}
              dispatch={dispatch}
            />
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
        </>
      )}
    </section>
  );
};

export default Chat;
