import React, { useRef, useState } from "react";
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
  setPrivateCallIsOpen,
  setReceiverIsBusy,
  setReceiverOfflineStatus,
} from "../../../app/actions/privateCallAction";
import { Buttons } from "./Component";
import "./PrivateCall.css";
import call_bg from "../../../img/bg/call_bg.jpg";
import ringtone from "../../../audios/Facebook_messenger_ringtone.mp3";
import { end, start } from "./timer.js";
import Timer from "./Timer.jsx";
import {
  cutCallByOtherUser,
  callNotReceive,
  stopBothVideoAndAudio,
} from "./callLogic";
import busy_call from "../../../audios/busy_call.mp3";
import receiverOfflineAudio from "../../../audios/call_not_reached_ton.mp3";

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
    receiverIsBusy,
    receiverIsOffline,
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
    roomId: state.messageReducer.roomId,
    openPrivateVideoCall: state.privateCall.openPrivateVideoCall,
    receiverIsBusy: state.privateCall.receiverIsBusy,
    receiverIsOffline: state.privateCall.receiverIsOffline,
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

  // CALL STATUS //
  const [callStatus, setCallStatus] = useState("");
  useEffect(() => {
    socket.on("call busy", (data) => {
      if (data.returnTo === userInfo?.email) {
        setCallStatus(data.status);
      }
    });

    return () => socket.off("call busy");
  }, [socket, userInfo]);

  // RECEIVER CALL YOU 1ST //
  useEffect(() => {
    socket.on("receiver call you first", (to) => {
      if (to === userInfo?.email) {
        leaveCall();
      }
    });

    return () => socket.off("receiver call you first");
  }, [socket, userInfo]);

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
    socket.on("callEnded", (to) => {
      if (to === userInfo.email) {
        cutCallByOtherUser(
          dispatch,
          connectionRef,
          timer,
          receiver,
          stream,
          userStream,
          interVal
        );
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
  const setTime = useRef(null);
  const database = useRef(true);
  useEffect(() => {
    if (openPrivateVideoCall && !receiver) {
      setTime.current = setTimeout(() => {
        if (!callAccepted) {
          callNotReceive(
            database.current,
            stream,
            dispatch,
            connectionRef,
            userStream,
            receiverInfo.email,
            userInfo.email,
            roomId,
            timer,
            videoChat,
            socket
          );
        } else {
          return;
        }
      }, 40000);
    }
    return () => clearTimeout(setTime.current);
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
    userInfo.email,
    userStream,
    videoChat,
  ]);

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

  const leaveCall = () => {
    setCallStatus("");
    stopBothVideoAndAudio(stream);
    end(interVal);
    setCallInfoInDatabase({
      id: roomId,
      sender: receiver ? caller : userInfo.email,
      receiver: receiver ? userInfo.email : receiverInfo.email,
      callDuration: callAccepted
        ? { ...timer, duration: true }
        : { duration: false },
      callDescription: videoChat ? "Video Call" : "Audio Call",
      status: "unseen",
      timeStamp: new Date().toUTCString(),
    });
    dispatch(setCallTimer({ s: 0, m: 0, h: 0 }));
    dispatch(getStream(null));
    dispatch(isCallEnded(true));
    dispatch(setStartTimer(false));
    dispatch(setPrivateCallIsOpen(false));
    dispatch(isReceivingCall(false));
    dispatch(isCallAccepted(false));
    connectionRef.current && connectionRef.current.destroy();
    userStream.current = null;
    socket.emit("cutCall", {
      to: receiverInfo.email,
    });
    if (!receiver && receiverIsBusy === "free") {
      setTimeout(() => {
        window.location.reload();
      }, 20);
    }

    dispatch(setReceiver(false));
    dispatch(setReceiverIsBusy(""));
    dispatch(setReceiverOfflineStatus(""));
  };

  // handle call conditions /////
  const audioRef = useRef(null);
  useEffect(() => {
    audioRef.current = document.getElementById("call_info_audio");
    audioRef.current.volume = 0.3;
    let t;
    if (receiverIsBusy === "busy") {
      audioRef.current.src = busy_call;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {})
          .catch(() => {
            audioRef.current.pause();
          });
      }
      audioRef.current.play();
      t = setTimeout(() => {
        audioRef.current.src = null;
        leaveCall();
      }, 5000);
      return () => clearTimeout(t);
    }
    if (receiverIsOffline === "offline") {
      audioRef.current.src = receiverOfflineAudio;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {})
          .catch(() => {
            audioRef.current.pause();
          });
      }
      t = setTimeout(() => {
        audioRef.current.src = null;
        leaveCall();
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [receiverIsBusy, receiverIsOffline, myStream, dispatch, stream]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative", width: "100%", height: "95vh" }}>
        <audio id="call_info_audio"></audio>
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
                      {callStatus
                        ? callStatus
                        : !startTimer
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
          stream={stream}
          dispatch={dispatch}
          answerCall={answerCall}
          leaveCall={leaveCall}
          videoChat={videoChat}
        />
      </div>
    </div>
  );
};

export default PrivateVideoCall;
