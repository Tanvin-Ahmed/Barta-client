import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStream,
  isCallAccepted,
  isCallEnded,
  isReceivingCall,
  setCallInfoInDatabase,
  setCallReachToReceiver,
  setCallTimer,
  setReceiver,
  setStartTimer,
  setVideoCallIsOpen,
  setVideoOpen,
  setVoiceOpen,
} from "../../../../../app/actions/privateVideoCallAction";
import { Buttons } from "./Component";
import "./PrivateVideoCall.css";
import call_bg from "../../../../../img/bg/call_bg.jpg";
import ringtone from "../../../../../audios/Facebook_messenger_ringtone.mp3";
import { end, start } from "./timer";
import Timer from "./Timer.jsx";

const PrivateVideoCall = ({
  socket,
  userVideo,
  myVideo,
  connectionRef,
  Peer,
}) => {
  const dispatch = useDispatch();
  const {
    stream,
    receivingCall,
    callerSignal,
    caller,
    callAccepted,
    videoOpen,
    voiceOpen,
    callEnded,
    receiverInfo,
    userInfo,
    videoChat,
    userName,
    callReachToReceiver,
    startTimer,
    timer,
    interVal,
    receiver,
    roomId,
  } = useSelector((state) => ({
    stream: state.privateVideoCall.stream,
    receivingCall: state.privateVideoCall.receivingCall,
    callerSignal: state.privateVideoCall.callerSignal,
    caller: state.privateVideoCall.caller,
    callAccepted: state.privateVideoCall.callAccepted,
    videoOpen: state.privateVideoCall.videoOpen,
    voiceOpen: state.privateVideoCall.voiceOpen,
    callEnded: state.privateVideoCall.callEnd,
    receiverInfo: state.userReducer.receiverInfo,
    userInfo: state.userReducer.userInfo,
    videoChat: state.privateVideoCall.videoChat,
    userName: state.privateVideoCall.userName,
    callReachToReceiver: state.privateVideoCall.callReachToReceiver,
    startTimer: state.privateVideoCall.startTimer,
    timer: state.privateVideoCall.timer,
    interVal: state.privateVideoCall.interVal,
    receiver: state.privateVideoCall.receiver,
    roomId: state.messageReducer.roomId,
  }));

  ////////////////// OPEN CAMERA AND MICROPHONE //////////////////
  useEffect(() => {
    receivingCall &&
      navigator.mediaDevices
        .getUserMedia({ video: videoChat, audio: true })
        .then((stream) => {
          dispatch(getStream(stream));
          myVideo.current.srcObject = stream;
        });
  }, [dispatch, myVideo, receivingCall, videoChat]);

  ////////////////// RESPONSE IF RECEIVER IS ONLINE ///////////////////
  useEffect(() => {
    socket.once("call-reach-to-user", (to) => {
      if (to === userInfo.email) {
        dispatch(setCallReachToReceiver(true));
      }
    });
  }, [socket, dispatch, userInfo]);

  ///////////////// CUT THE CALL ///////////////////////
  useEffect(() => {
    const cutCall = () => {
      stream?.getTracks()?.forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
    };

    socket.on("callEnded", (to) => {
      if (to === userInfo.email) {
        cutCall();
        dispatch(setReceiver(false));
        dispatch(isCallEnded(true));
        dispatch(setStartTimer(false));
        dispatch(setVideoCallIsOpen(false));
        dispatch(isReceivingCall(false));
        dispatch(isCallAccepted(false));
        connectionRef.current && connectionRef.current.destroy();
        userVideo.current = null;
        end(interVal);
        dispatch(setCallTimer({ s: 0, m: 0, h: 0 }));
        window.location.reload();
      }
    });
  }, [socket, connectionRef, userVideo, userInfo, dispatch, stream, interVal]);

  // stop both mic and camera
  const stopBothVideoAndAudio = () => {
    stream?.getTracks()?.forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  // handle video
  const handleVideoMute = () => {
    stream.getVideoTracks()[0].enabled = !videoOpen;
    dispatch(setVideoOpen(!videoOpen));
    dispatch(getStream(stream));
  };
  // handle audio
  const handleAudioMute = () => {
    stream.getAudioTracks()[0].enabled = !voiceOpen;
    dispatch(setVoiceOpen(!voiceOpen));
    dispatch(getStream(stream));
  };

  const answerCall = () => {
    dispatch(isCallAccepted(true));

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("answerCall", { signal, to: caller });
      dispatch(isReceivingCall(false));
      dispatch(setStartTimer(true));
      start(timer, dispatch);
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    stopBothVideoAndAudio();
    end(interVal);
    setCallInfoInDatabase({
      id: roomId,
      sender: receiver ? caller : userInfo.email,
      receiver: receiver ? userInfo.email : receiverInfo.email,
      callDuration: timer,
      callDescription: videoChat ? "Video Call" : "Audio Call",
      timeStamp: new Date().toUTCString(),
    });
    dispatch(setCallTimer({ s: 0, m: 0, h: 0 }));
    dispatch(isCallEnded(true));
    dispatch(setStartTimer(false));
    dispatch(setVideoCallIsOpen(false));
    dispatch(isReceivingCall(false));
    dispatch(isCallAccepted(false));
    connectionRef.current && connectionRef.current.destroy();
    userVideo.current = null;
    dispatch(setReceiver(false));
    socket.emit("cutCall", {
      to: receiverInfo.email,
    });
    window.location.reload();
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative", width: "100%", height: "95vh" }}>
        {videoChat ? (
          <>
            {callAccepted && !callEnded ? (
              <video playsInline ref={userVideo} autoPlay className="video" />
            ) : (
              <>
                <img
                  src={call_bg}
                  alt=""
                  style={{
                    minWidth: "100%",
                    minHeight: "100%",
                    objectFit: "cover",
                    position: "relative",
                  }}
                />
                {receivingCall ? (
                  <div className="callInfo">
                    <h5>{userName}</h5>
                    <h6>is calling....</h6>
                    <audio src={ringtone} loop autoPlay></audio>
                  </div>
                ) : (
                  <div className="callInfo">
                    {!startTimer && <h6>You calling....</h6>}
                    <h5>{receiverInfo.displayName}</h5>
                    <h6>
                      {!startTimer
                        ? callReachToReceiver
                          ? "Ringing...."
                          : "Connecting..."
                        : ""}
                    </h6>
                  </div>
                )}
              </>
            )}
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className="myVideo__after_callReceive"
              />
            )}
          </>
        ) : (
          <>
            <img
              src={call_bg}
              alt=""
              style={{
                minWidth: "100%",
                minHeight: "100%",
                objectFit: "cover",
                position: "relative",
              }}
            />
            {receivingCall ? (
              <div className="callInfo">
                <h5>{userName}</h5>
                <h6>is calling....</h6>
                <audio src={ringtone} loop autoPlay></audio>
              </div>
            ) : (
              <div className="callInfo">
                {!startTimer && <h6>You calling....</h6>}
                <h5>{receiverInfo.displayName}</h5>
                <h6>
                  {!startTimer
                    ? callReachToReceiver
                      ? "Ringing...."
                      : "Connecting..."
                    : ""}
                </h6>
              </div>
            )}
            <audio muted ref={myVideo} autoPlay></audio>
            {callAccepted && !callEnded && (
              <audio ref={userVideo} autoPlay></audio>
            )}
          </>
        )}
      </div>
      {callAccepted && !callEnded && (
        <div className="timer">
          <Timer timer={timer} />
        </div>
      )}
      <div className="buttons__position">
        <Buttons
          videoOpen={videoOpen}
          voiceOpen={voiceOpen}
          receivingCall={receivingCall}
          callAccepted={callAccepted}
          handleAudioMute={handleAudioMute}
          handleVideoMute={handleVideoMute}
          answerCall={answerCall}
          leaveCall={leaveCall}
          videoChat={videoChat}
        />
      </div>
    </div>
  );
};

export default PrivateVideoCall;
