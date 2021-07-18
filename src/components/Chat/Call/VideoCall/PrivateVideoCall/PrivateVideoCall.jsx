import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStream,
  isCallAccepted,
  isCallEnded,
  isReceivingCall,
  setVideoCallIsOpen,
  setVideoOpen,
  setVoiceOpen,
} from "../../../../../app/actions/privateVideoCallAction";
import { Buttons } from "./Component";
import "./PrivateVideoCall.css";
import call_bg from "../../../../../img/bg/call_bg.jpg";

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
  } = useSelector((state) => ({
    stream: state.privateVideoCall.stream,
    receivingCall: state.privateVideoCall.receivingCall,
    callerSignal: state.privateVideoCall.callerSignal,
    caller: state.privateVideoCall.caller,
    callAccepted: state.privateVideoCall.callAccepted,
    videoOpen: state.privateVideoCall.videoOpen,
    voiceOpen: state.privateVideoCall.voiceOpen,
    callEnded: state.privateVideoCall.callEnd,
  }));

  useEffect(() => {
    receivingCall &&
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          dispatch(getStream(stream));
          myVideo.current.srcObject = stream;
        });
  }, [dispatch, myVideo, receivingCall]);

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
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    stopBothVideoAndAudio();
    dispatch(isCallEnded(true));
    dispatch(setVideoCallIsOpen(false));
    dispatch(isReceivingCall(false));
    dispatch(isCallAccepted(false));
    console.log(connectionRef);
    connectionRef.current.destroy();
    console.log(connectionRef);
    userVideo.current = null;
    // window.location.reload();
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative", width: "100%", height: "95vh" }}>
        {callAccepted && !callEnded ? (
          <video
            playsInline
            ref={userVideo}
            autoPlay
            style={{ minWidth: "100%", minHeight: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            src={call_bg}
            alt=""
            style={{ minWidth: "100%", minHeight: "100%", objectFit: "cover" }}
          />
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
      </div>
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
        />
      </div>
    </div>
  );
};

export default PrivateVideoCall;
