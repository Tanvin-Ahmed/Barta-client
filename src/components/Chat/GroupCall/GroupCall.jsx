import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStream,
  isCallAccepted,
} from "../../../app/actions/privateCallAction";
import { acceptGroupCall } from "../PrivateCallSystem/callLogic";
import { Buttons } from "../PrivateCallSystem/Component";
import "./GroupCall.css";
import { stopBothVideoAndAudio } from "../PrivateCallSystem/callLogic";
import {
  setCallerName,
  setGroupCallIsOpen,
  setPeersForGroupCall,
} from "../../../app/actions/groupCallAction";

const UserVideo = ({ peerObj }) => {
  const ref = useRef(null);

  useEffect(() => {
    peerObj.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peerObj]);

  return (
    <div className="text-center">
      <video className="user_video" playsInline ref={ref} autoPlay></video>
      <h6 className="text-light">{peerObj?.peerName}</h6>
    </div>
  );
};

const GroupCall = ({
  socket,
  myStream,
  groupPeersRef,
  roomIdOfReceivingGroupCall,
  setRoomIdOfReceivingGroupCall,
  setReceivingGroupCall,
  receivingGroupCall,
}) => {
  const dispatch = useDispatch();
  const {
    stream,
    videoChat,
    userInfo,
    peersForGroupCall,
    videoOpen,
    voiceOpen,
    callAccepted,
  } = useSelector((state) => ({
    stream: state.privateCall.stream,
    videoChat: state.privateCall.videoChat,
    userInfo: state.userReducer.userInfo,
    peersForGroupCall: state.groupCallReducer.peersForGroupCall,
    videoOpen: state.privateCall.videoOpen,
    voiceOpen: state.privateCall.voiceOpen,
    callAccepted: state.privateCall.callAccepted,
  }));

  /////// ACCEPT CALL ///////
  const acceptCall = () => {
    acceptGroupCall(
      dispatch,
      socket,
      roomIdOfReceivingGroupCall,
      userInfo,
      groupPeersRef,
      myStream,
      videoChat
    );
  };

  //////////// CUT CALL FROM USER //////////////
  useEffect(() => {
    socket.on("user left", (id) => {
      const peerObj = groupPeersRef.current.find((p) => p.peerID === id);
      if (peerObj) {
        peerObj.peer.destroy();
      }
      const peers = groupPeersRef.current.filter((p) => p.peerID !== id);
      groupPeersRef.current = peers;
      dispatch(setPeersForGroupCall(peers));
    });
  }, [socket, dispatch, groupPeersRef]);

  //////// CUT CALL ///////
  const leaveCall = () => {
    stopBothVideoAndAudio(stream);
    myStream.current.srcObject = null;
    dispatch(getStream(null));
    dispatch(isCallAccepted(false));
    groupPeersRef.current.forEach((peerObj) => {
      peerObj?.peer?.destroy();
    });
    groupPeersRef.current = [];
    dispatch(setPeersForGroupCall([]));
    socket.emit("cut call", userInfo?.email);
    if (receivingGroupCall) {
      setReceivingGroupCall(false);
      dispatch(setCallerName(""));
      setRoomIdOfReceivingGroupCall("");
    } else {
      dispatch(setGroupCallIsOpen(false));
    }
  };

  return (
    <section className="group__call">
      <video
        className="user_video"
        playsInline
        autoPlay
        ref={myStream}
        muted
      ></video>
      {peersForGroupCall?.length > 0 &&
        peersForGroupCall.map((peerObj, index) => (
          <UserVideo key={index} peerObj={peerObj} />
        ))}
      <div className="buttons__position">
        <Buttons
          videoOpen={videoOpen}
          voiceOpen={voiceOpen}
          receivingCall={receivingGroupCall}
          callAccepted={callAccepted}
          stream={stream}
          dispatch={dispatch}
          answerCall={acceptCall}
          leaveCall={leaveCall}
          videoChat={videoChat}
        />
      </div>
    </section>
  );
};

export default GroupCall;
