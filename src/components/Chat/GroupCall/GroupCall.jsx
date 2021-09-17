import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStream } from "../../../app/actions/privateCallAction";
import { acceptGroupCall } from "../PrivateCallSystem/callLogic";
import { Buttons } from "../PrivateCallSystem/Component";
import "./GroupCall.css";

const UserVideo = ({ peerObj }) => {
  const ref = useRef(null);

  useEffect(() => {
    peerObj.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peerObj]);

  return (
    <video className="user_video" playsInline ref={ref} autoPlay></video>
    // <div className="text-center">
    //   <h6>{peerObj?.peerName}</h6>
    // </div>
  );
};

const GroupCall = ({
  socket,
  myStream,
  groupPeersRef,
  roomIdOfReceivingGroupCall,
}) => {
  const dispatch = useDispatch();
  const {
    stream,
    receivingGroupCall,
    videoChat,
    userInfo,
    peersForGroupCall,
    videoOpen,
    voiceOpen,
    callAccepted,
    callerName,
  } = useSelector((state) => ({
    stream: state.privateCall.stream,
    receivingGroupCall: state.privateCall.receivingGroupCall,
    videoChat: state.privateCall.videoChat,
    userInfo: state.userReducer.userInfo,
    peersForGroupCall: state.privateCall.peersForGroupCall,
    videoOpen: state.privateCall.videoOpen,
    voiceOpen: state.privateCall.voiceOpen,
    callAccepted: state.privateCall.callAccepted,
    callerName: state.privateCall.callerName,
  }));

  useEffect(() => {
    receivingGroupCall &&
      navigator.mediaDevices
        .getUserMedia({
          video: videoChat ? { facingMode: "user" } : false,
          audio: true,
        })
        .then((stream) => {
          myStream.current.srcObject = stream;
          dispatch(getStream(stream));
        })
        .catch((err) => alert(err.message));
  }, [receivingGroupCall, videoChat, myStream, dispatch]);

  const acceptCall = () => {
    acceptGroupCall(
      dispatch,
      socket,
      roomIdOfReceivingGroupCall,
      userInfo,
      stream,
      groupPeersRef
    );
  };

  console.log(peersForGroupCall);

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
          // leaveCall={leaveCall}
          videoChat={videoChat}
        />
      </div>
    </section>
  );
};

export default GroupCall;
