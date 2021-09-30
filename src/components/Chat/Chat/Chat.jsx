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
  acceptGroupCall,
  callReached,
  makeCall,
  makeGroupCall,
} from "../PrivateCallSystem/callLogic";
import { setGroupCallIsOpen } from "../../../app/actions/groupCallAction";

const Chat = ({
  socket,
  myStream,
  groupPeersRef,
  roomIdOfReceivingGroupCall,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const refetchData = () => {
      id && JSON.parse(sessionStorage.getItem("barta/groupName"))?.groupName
        ? getGroupInfo(dispatch, id?.split("(*Φ皿Φ*)")?.join(" "))
        : getUsersData(dispatch, id);
    };
    const reloadWebpage = () => {
      window.addEventListener("online", refetchData);
      window.addEventListener("offline", refetchData);
    };
    window.addEventListener("load", reloadWebpage);
    refetchData();

    return () => {
      window.removeEventListener("load", reloadWebpage);
      window.removeEventListener("online", refetchData);
      window.removeEventListener("offline", refetchData);
    };
  }, [dispatch, id]);

  const {
    userInfo,
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
    videoChat,
    userStatusToReceiveOtherCall,
    showCallButtons,
  } = useSelector((state) => ({
    userInfo: state.userReducer.userInfo,
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

    // private call
    openPrivateCall: state.privateCall.openPrivateCall,
    myId: state.privateCall.myId,
    idToCall: state.privateCall.idToCall,
    myName: state.privateCall.myName,
    receivingCall: state.privateCall.receivingCall,
    timer: state.privateCall.timer,
    videoChat: state.privateCall.videoChat,
    userStatusToReceiveOtherCall:
      state.privateCall.userStatusToReceiveOtherCall,

    // group call
    showCallButtons: state.groupCallReducer.showCallButtons,
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
        const ID = getRoomId(userInfo?.email);
        dispatch(setRoomId(ID));
        return ID;
      }
    }
  }, [dispatch, id, userInfo]);

  //////////////// GET MESSAGE FROM DATABASE //////////////
  useEffect(() => {
    const refetchData = () => {
      if (roomId) {
        dispatch(getMessagesFromDatabase({ pageNum: 1, roomId }, false));
      }
    };
    const reloadWebpage = () => {
      window.addEventListener("online", refetchData);
      window.addEventListener("offline", refetchData);
    };
    window.addEventListener("load", reloadWebpage);
    refetchData();

    return () => {
      window.removeEventListener("load", reloadWebpage);
      window.removeEventListener("online", refetchData);
      window.removeEventListener("offline", refetchData);
    };
  }, [roomId, dispatch, id]);

  const page = useRef(2);
  const getOldMessage = () => {
    if (reFetchMessage) {
      dispatch(
        getMessagesFromDatabase({ pageNum: page.current, roomId }, true)
      );
      dispatch(stopReFetchMessage());
      page.current++;
    }
  };
  // useEffect(() => {
  //   const onScroll = (e) => {
  //     const scroll = e.target.document.querySelector(
  //       ".react-scroll-to-bottom--css-rcops-1n7m0yu"
  //     ).scrollTop;
  //     console.log(scroll);
  //     if (scroll === 0 && reFetchMessage) {
  //       dispatch(
  //         getMessagesFromDatabase({ pageNum: page.current, roomId }, true)
  //       );
  //       dispatch(stopReFetchMessage());
  //       page.current++;
  //     }
  //   };
  //   document.addEventListener("scroll", onScroll);

  //   return () => document.removeEventListener("scroll", onScroll);
  // }, [dispatch, roomId, reFetchMessage]);

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
        callReached(
          data,
          dispatch,
          socket,
          history,
          userStatusToReceiveOtherCall
        );
      }
    });

    return () => socket.off("callUser");
  }, [
    dispatch,
    socket,
    receiverInfo,
    senderInfo,
    history,
    userStatusToReceiveOtherCall,
  ]);

  ////////// MAKE CALL ///////////////
  const connectionRef = useRef(null);
  const userStream = useRef(null);

  const callUser = (video) => {
    dispatch(isVideoChat(video));
    if (JSON.parse(sessionStorage.getItem("barta/groupName"))?.groupName) {
      dispatch(setGroupCallIsOpen(true));
      makeGroupCall(
        dispatch,
        socket,
        video,
        myStream,
        roomId,
        senderInfo,
        groupInfo,
        groupPeersRef,
        video
      );
    } else {
      dispatch(setPrivateCallIsOpen(true));
      makeCall(
        dispatch,
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
    }
  };

  ///////////// JOIN GROUP CALL //////////
  const acceptCall = () => {
    acceptGroupCall(
      dispatch,
      socket,
      roomIdOfReceivingGroupCall,
      senderInfo,
      groupPeersRef,
      myStream,
      videoChat
    );
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
            showCallButtons={showCallButtons}
            acceptCall={acceptCall}
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
            getOldMessage={getOldMessage}
            reFetchMessage={reFetchMessage}
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
