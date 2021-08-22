import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
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
import PrivateCall from "../PrivateCallSystem/PrivateCall";
import {
  getCaller,
  getCallerSignal,
  getMyId,
  getMyName,
  getStream,
  getUserId,
  getUserName,
  isCallAccepted,
  isReceivingCall,
  isVideoChat,
  setReceiver,
  setStartTimer,
  setVideoCallIsOpen,
} from "../../../app/actions/privateCallAction";
import {
  deleteMessage,
  getOneOneChat,
  getOneOneChatFromSocket,
  isTyping,
  stopReFetchMessage,
  updateReactInChat,
} from "../../../app/actions/messageAction";
import { start } from "../PrivateCallSystem/timer";
import LinearProgress from "@material-ui/core/LinearProgress";
import { updateChatStatus } from "../../../app/actions/userAction";

const Chat = ({ socket }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

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
    reFetchMessage,
    getMessageProgress,
    openPrivateVideoCall,
    myId,
    idToCall,
    myName,
    receivingCall,
    timer,
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
    reFetchMessage: state.messageReducer.reFetchMessage,
    getMessageProgress: state.messageReducer.getMessageProgress,

    // private video call
    openPrivateVideoCall: state.privateCall.openPrivateVideoCall,
    myId: state.privateCall.myId,
    idToCall: state.privateCall.idToCall,
    myName: state.privateCall.myName,
    receivingCall: state.privateCall.receivingCall,
    timer: state.privateCall.timer,
  }));
  const [inputText, setInputText] = useState("");

  const roomId = useMemo(() => {
    return getRoomId(dispatch);
  }, [dispatch]);

  ////////////// GET MESSAGE //////////////////
  useEffect(() => {
    socket.on("one_one_chatMessage", (message) => {
      dispatch(getOneOneChatFromSocket(message));
    });
    return () => socket.off("one_one_chatMessage");
  }, [socket, dispatch]);

  useEffect(() => {
    socket.emit("join", { roomId });
  }, [socket, roomId]);

  //////////////// TYPING CONDITION //////////////
  useEffect(() => {
    socket.on("displayTyping", (typingCondition) => {
      if (typingCondition?.email === receiverInfo?.email) {
        dispatch(isTyping(typingCondition?.type));
      }
    });
    return () => socket.off("displayTyping");
  }, [socket, dispatch, receiverInfo.email]);

  ////////////////// GET USER STATUS //////////////////
  useEffect(() => {
    socket.on("user-status", (friendStatus) => {
      if (friendStatus?.email === receiverInfo?.email) {
        receiverInfo.status = friendStatus?.status;
        if (friendStatus?.status === "active") {
          receiverInfo.goOffLine = "";
        } else {
          receiverInfo.goOffLine = new Date().toUTCString();
        }
        dispatch(updateChatStatus(receiverInfo));
      }
    });
    return () => socket.off("user-status");
  }, [socket, dispatch, receiverInfo]);

  /////////////// UPDATE MESSAGE REACTION //////////////
  useEffect(() => {
    socket.on("update-react", (update) => {
      if (chatMessage.length > 0 || chatMessage[0]) {
        dispatch(updateReactInChat(chatMessage, update));
      }
    });
    return () => socket.off("update-react");
  }, [socket, dispatch, chatMessage]);

  ////////////// DELETE MESSAGE //////////////
  useEffect(() => {
    socket.on("delete-chatMessage", (deletedItem) => {
      if (chatMessage.length > 0 || chatMessage[0])
        dispatch(deleteMessage(chatMessage, deletedItem._id));
    });
    return () => socket.off("delete-chatMessage");
  }, [socket, dispatch, chatMessage]);

  ////////////// SCREEN_SIZE //////////////
  useEffect(() => {
    window.addEventListener("resize", screen(dispatch));
    return () => window.removeEventListener("resize", screen(dispatch));
  }, [dispatch]);

  //////////////// GET MESSAGE FROM DATABASE //////////////
  useEffect(() => {
    roomId && dispatch(getOneOneChat({ pageNum: 1, roomId }));
  }, [roomId, dispatch]);

  const page = useRef(2);
  useEffect(() => {
    const onScroll = (e) => {
      const scroll = e.target.document.querySelector(
        ".react-scroll-to-bottom--css-tnqbh-1n7m0yu"
      )?.scrollTop;
      console.log(scroll);
      if (scroll === 0 && reFetchMessage) {
        dispatch(getOneOneChat({ pageNum: page.current, roomId }));
        dispatch(stopReFetchMessage());
        page.current++;
      }
    };

    window.addEventListener("scroll", onScroll);
    return window.removeEventListener("scroll", onScroll);
  }, [dispatch, roomId, reFetchMessage]);

  ////////////// SEND MESSAGE //////////////
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
  ///////// RECEIVE CALL ////////
  useEffect(() => {
    dispatch(getUserId(receiverInfo.email));
    dispatch(getMyId(senderInfo.email));
    dispatch(getMyName(senderInfo.displayName));
  }, [receiverInfo.email, senderInfo, dispatch]);

  useEffect(() => {
    socket.on("callUser", (data) => {
      if (data.userToCall === senderInfo.email) {
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
  }, [dispatch, socket, receiverInfo, senderInfo, history]);

  ////////// MAKE CALL ///////////////
  const connectionRef = useRef();
  const userStream = useRef();
  const myStream = useRef();

  const callUser = (video) => {
    dispatch(setVideoCallIsOpen(true));
    dispatch(isVideoChat(video));
    navigator.mediaDevices
      .getUserMedia({ video: video, audio: true })
      .then((stream) => {
        dispatch(getStream(stream));
        myStream.current.srcObject = stream;

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
            callerDataBaseId: senderInfo._id,
            callType: video ? "video" : "audio",
          });
        });

        socket.on("callAccepted", (data) => {
          console.log(data);
          if (data.to === senderInfo.email) {
            dispatch(isCallAccepted(true));
            dispatch(setStartTimer(true));
            start(timer, dispatch);
            dispatch(isReceivingCall(false));
            peer.signal(data.signal);
          }
        });

        peer.on("stream", (stream) => {
          userStream.current.srcObject = stream;
        });

        connectionRef.current = peer;
      });
  };

  return (
    <section className="chat">
      {openPrivateVideoCall || receivingCall || userStream.current ? (
        <PrivateCall
          socket={socket}
          userStream={userStream}
          myStream={myStream}
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
          {getMessageProgress > 0 && (
            <LinearProgress variant="determinate" value={getMessageProgress} />
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
