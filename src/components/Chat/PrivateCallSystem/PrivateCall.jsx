import React, { useRef } from "react";
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
} from "../../../app/actions/privateCallAction";
import { Buttons } from "./Component";
import "./PrivateCall.css";
import call_bg from "../../../img/bg/call_bg.jpg";
import ringtone from "../../../audios/Facebook_messenger_ringtone.mp3";
import { end, start } from "./timer.js";
import Timer from "./Timer.jsx";

const PrivateVideoCall = ({
  socket,
  userStream,
  myStream,
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
    openPrivateVideoCall,
  } = useSelector((state) => ({
    stream: state.privateCall.stream,
    receivingCall: state.privateCall.receivingCall,
    callerSignal: state.privateCall.callerSignal,
    caller: state.privateCall.caller,
    callAccepted: state.privateCall.callAccepted,
    videoOpen: state.privateCall.videoOpen,
    voiceOpen: state.privateCall.voiceOpen,
    callEnded: state.privateCall.callEnd,
    receiverInfo: state.userReducer.receiverInfo,
    userInfo: state.userReducer.userInfo,
    videoChat: state.privateCall.videoChat,
    userName: state.privateCall.userName,
    callReachToReceiver: state.privateCall.callReachToReceiver,
    startTimer: state.privateCall.startTimer,
    timer: state.privateCall.timer,
    interVal: state.privateCall.interVal,
    receiver: state.privateCall.receiver,
    roomId: state.privateCall.roomId,
    openPrivateVideoCall: state.privateCall.openPrivateVideoCall,
  }));

  ////////////////// OPEN CAMERA AND MICROPHONE OF RECEIVER //////////////////
  useEffect(() => {
    receivingCall &&
      navigator.mediaDevices
        .getUserMedia({ video: videoChat, audio: true })
        .then((stream) => {
          dispatch(getStream(stream));
          myStream.current.srcObject = stream;
        });
  }, [dispatch, myStream, receivingCall, videoChat]);

  ////////////////// RESPONSE IF RECEIVER IS ONLINE ///////////////////
  useEffect(() => {
    socket.on("call-reach-to-user", (to) => {
      if (to === userInfo.email) {
        dispatch(setCallReachToReceiver(true));
      }
    });
    return () => socket.off("call-reach-to-user");
  }, [socket, dispatch, userInfo]);

  ///////////////// CUT THE CALL FROM RECEIVER ///////////////////////
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
        dispatch(isCallEnded(true));
        dispatch(setStartTimer(false));
        dispatch(setVideoCallIsOpen(false));
        dispatch(isReceivingCall(false));
        dispatch(isCallAccepted(false));
        connectionRef.current && connectionRef.current.destroy();
        userStream.current = null;
        (timer.s > 0 || timer.m > 0 || timer.h > 0) &&
          end(interVal) &&
          dispatch(setCallTimer({ s: 0, m: 0, h: 0 }));
        !receiver &&
          setTimeout(() => {
            window.location.reload();
          }, 10);
        dispatch(setReceiver(false));
      }
    });
    return () => socket.off("callEnded");
  }, [
    socket,
    receiver,
    connectionRef,
    userStream,
    userInfo,
    dispatch,
    stream,
    interVal,
    timer,
  ]);

  ///////////////// CUT THE CALL AFTER FIXED TIME TO RINGING ///////////////////
  let setTime = useRef({ database: true, time: null });
  useEffect(() => {
    if (openPrivateVideoCall && !receiver && !callAccepted) {
      setTime.current.time = setTimeout(() => {
        stream?.getTracks()?.forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
        setTime.current.database &&
          setCallInfoInDatabase({
            id: roomId,
            sender: userInfo.email,
            receiver: receiverInfo.email,
            callDuration: timer,
            callDescription: videoChat ? "Video Call" : "Audio Call",
            timeStamp: new Date().toUTCString(),
          });
        setTime.current.database = false;
        dispatch(setVideoCallIsOpen(false));
        dispatch(setCallReachToReceiver(false));
        connectionRef.current && connectionRef.current.destroy();
        userStream.current = null;
        socket.emit("cutCall", {
          to: receiverInfo.email,
        });
      }, 40000);
    } else {
      callAccepted && clearTimeout(setTime.current.time);
    }
  }, [
    callAccepted,
    openPrivateVideoCall,
    connectionRef,
    dispatch,
    receiver,
    receiverInfo.email,
    roomId,
    socket,
    stream,
    timer,
    userInfo.email,
    userStream,
    videoChat,
  ]);

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
      userStream.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = async () => {
    stopBothVideoAndAudio();
    end(interVal);
    await setCallInfoInDatabase({
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
    userStream.current = null;
    socket.emit("cutCall", {
      to: receiverInfo.email,
    });
    !receiver &&
      setTimeout(() => {
        window.location.reload();
      }, 10);
    dispatch(setReceiver(false));
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative", width: "100%", height: "95vh" }}>
        {videoChat ? (
          <>
            {callAccepted && !callEnded ? (
              <video playsInline ref={userStream} autoPlay className="video" />
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
                ref={myStream}
                autoPlay
                className="myStream__after_callReceive"
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
            <audio muted ref={myStream} autoPlay></audio>
            {callAccepted && !callEnded && (
              <audio ref={userStream} autoPlay></audio>
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
