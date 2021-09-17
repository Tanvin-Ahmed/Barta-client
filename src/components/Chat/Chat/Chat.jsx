import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import Peer from "simple-peer";
import {
  getGroupInfo,
  getRoomId,
  getUsersData,
  handleSendMessage,
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
import PrivateCall from "../PrivateCallSystem/PrivateCall";
import {
  getMyId,
  getMyName,
  getUserId,
  isVideoChat,
  setGroupCallIsOpen,
  setPrivateCallIsOpen,
} from "../../../app/actions/privateCallAction";
import {
  deleteMessage,
  getMessagesFromDatabase,
  getNewMessageFromSocket,
  isTyping,
  setRoomId,
  stopReFetchMessage,
  updateReactInChat,
} from "../../../app/actions/messageAction";
import { updateChatStatus } from "../../../app/actions/userAction";
import {
  callReached,
  makeCall,
  makeGroupCall,
} from "../PrivateCallSystem/callLogic";

const Chat = ({ socket, myStream, groupPeersRef }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    id && JSON.parse(sessionStorage.getItem("barta/groupName"))?.groupName
      ? getGroupInfo(dispatch, id?.split("(*Φ皿Φ*)")?.join(" "))
      : getUsersData(dispatch, id);
  }, [dispatch, id]);

  const {
    senderInfo,
    receiverInfo,
    groupInfo,
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
    getMessageSpinner,
    openPrivateCall,
    myId,
    idToCall,
    myName,
    receivingCall,
    timer,
    peersForGroupCall,
    openGroupCall,
  } = useSelector((state) => ({
    // private chat
    senderInfo: state.userReducer.userInfo,
    receiverInfo: state.userReducer.receiverInfo,
    groupInfo: state.userReducer.groupInfo,
    addChatList: state.userReducer.addChatList,
    chatMessage: state.messageReducer.chatMessages,
    uploadPercentage: state.messageReducer.uploadPercentage,
    largeScreen: state.messageReducer.largeScreen,
    typing: state.messageReducer.typing,
    clickUploadOption: state.messageReducer.clickUploadOption,
    chosenFiles: state.messageReducer.chosenFiles,
    isOpenOptions: state.messageReducer.isOpenOptions,
    reactTabIsOpen: state.messageReducer.reactTabIsOpen,
    reFetchMessage: state.messageReducer.reFetchMessage,
    getMessageSpinner: state.messageReducer.getMessageSpinner,

    // private video call
    openPrivateCall: state.privateCall.openPrivateCall,
    myId: state.privateCall.myId,
    idToCall: state.privateCall.idToCall,
    myName: state.privateCall.myName,
    receivingCall: state.privateCall.receivingCall,
    timer: state.privateCall.timer,
    peersForGroupCall: state.privateCall.peersForGroupCall,
    openGroupCall: state.privateCall.openGroupCall,
  }));
  const [inputText, setInputText] = useState("");

  ////////// GET ROOM ID //////////
  const roomId = useMemo(() => {
    if (id) {
      if (JSON.parse(sessionStorage.getItem("barta/groupName"))?.groupName) {
        const ID = id?.split("(*Φ皿Φ*)")?.join(" ");
        dispatch(setRoomId(ID));
        return ID;
      } else {
        const ID = getRoomId();
        dispatch(setRoomId(ID));
        return ID;
      }
    }
  }, [dispatch, id]);

  //////////////// GET MESSAGE FROM DATABASE //////////////
  useEffect(() => {
    if (roomId) {
      dispatch(getMessagesFromDatabase({ pageNum: 1, roomId }));
    }
  }, [roomId, dispatch, id]);

  const page = useRef(2);
  useEffect(() => {
    const onScroll = (e) => {
      const scroll = e.target.document.querySelector(
        ".react-scroll-to-bottom--css-tnqbh-1n7m0yu"
      )?.scrollTop;
      console.log(scroll);
      if (scroll === 0 && reFetchMessage) {
        dispatch(getMessagesFromDatabase({ pageNum: page.current, roomId }));
        dispatch(stopReFetchMessage());
        page.current++;
      }
    };

    window.addEventListener("scroll", onScroll);
    return window.removeEventListener("scroll", onScroll);
  }, [dispatch, roomId, reFetchMessage]);

  ////////////// GET MESSAGE FROM SOCKET //////////////////
  useEffect(() => {
    socket.on("new-message", (message) => {
      dispatch(getNewMessageFromSocket(message));
    });
    return () => socket.off("new-message");
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

  ////////////// SEND MESSAGE //////////////
  const handleOnEnter = () => {
    if (inputText.trim() || chosenFiles[0]) {
      handleSendMessage(
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
        callReached(data, dispatch, socket, history);
      }
    });

    return () => socket.off("callUser");
  }, [dispatch, socket, receiverInfo, senderInfo, history]);

  ////////// MAKE CALL ///////////////
  const connectionRef = useRef();
  const userStream = useRef();

  const callUser = (video) => {
    dispatch(isVideoChat(video));
    if (JSON.parse(sessionStorage.getItem("barta/groupName"))?.groupName) {
      dispatch(setGroupCallIsOpen(true));
      navigator.mediaDevices
        .getUserMedia({
          video: video ? { facingMode: "user" } : video,
          audio: true,
        })
        .then((stream) => {
          makeGroupCall(
            dispatch,
            socket,
            stream,
            myStream,
            roomId,
            senderInfo,
            groupInfo,
            groupPeersRef,
            video
          );
        })
        .catch((err) => alert(err.message));
    } else {
      dispatch(setPrivateCallIsOpen(true));
      navigator.mediaDevices
        .getUserMedia({
          video: video ? { facingMode: "user" } : video,
          audio: true,
        })
        .then((stream) => {
          makeCall(
            dispatch,
            stream,
            socket,
            Peer,
            myStream,
            userStream,
            connectionRef,
            idToCall,
            myId,
            myName,
            senderInfo,
            video,
            timer
          );
        })
        .catch((error) => alert(error.message));
    }
  };

  return (
    <section className="chat">
      {openPrivateCall || receivingCall || userStream.current ? (
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
            // for group
            groupInfo={groupInfo}
            // settings
            history={history}
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
            getMessageSpinner={getMessageSpinner}
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
