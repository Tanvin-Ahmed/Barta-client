import {
  isCallAccepted,
  isCallEnded,
  isReceivingCall,
  setCallTimer,
  setReceiver,
  setStartTimer,
  setPrivateCallIsOpen,
  setCallReachToReceiver,
  setCallInfoInDatabase,
  setVideoOpen,
  getStream,
  setVoiceOpen,
  getCaller,
  getUserName,
  getCallerSignal,
  isVideoChat,
  setPeersForGroupCall,
} from "../../../app/actions/privateCallAction";
import { end, start } from "./timer.js";
import Peer from "simple-peer";

// stop both mic and camera
export const stopBothVideoAndAudio = (stream) => {
  stream?.getTracks()?.forEach((track) => {
    if (track.readyState === "live") {
      track.stop();
    }
  });
};

// handle video
export const handleVideoMute = (stream, videoOpen, dispatch) => {
  stream.getVideoTracks()[0].enabled = !videoOpen;
  dispatch(setVideoOpen(!videoOpen));
  dispatch(getStream(stream));
};
// handle audio
export const handleAudioMute = (stream, voiceOpen, dispatch) => {
  stream.getAudioTracks()[0].enabled = !voiceOpen;
  dispatch(setVoiceOpen(!voiceOpen));
  dispatch(getStream(stream));
};

export const makeCall = (
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
) => {
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
};

export const cutCallByOtherUser = (
  dispatch,
  connectionRef,
  timer,
  receiver,
  stream,
  userStream,
  interVal
) => {
  stopBothVideoAndAudio(stream);
  dispatch(isCallEnded(true));
  dispatch(setStartTimer(false));
  dispatch(setPrivateCallIsOpen(false));
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
};

export const callNotReceive = (
  database,
  stream,
  dispatch,
  connectionRef,
  userStream,
  receiverEmail,
  userEmail,
  roomId,
  timer,
  videoChat,
  socket
) => {
  stopBothVideoAndAudio(stream);
  database &&
    setCallInfoInDatabase({
      id: roomId,
      sender: userEmail,
      receiver: receiverEmail,
      callDuration: timer,
      callDescription: videoChat ? "Video Call" : "Audio Call",
      timeStamp: new Date().toUTCString(),
    });
  database = false;
  dispatch(setPrivateCallIsOpen(false));
  dispatch(setCallReachToReceiver(false));
  connectionRef.current && connectionRef.current.destroy();
  userStream.current = null;
  socket.emit("cutCall", {
    to: receiverEmail,
  });
};

export const callReached = (data, dispatch, socket, history) => {
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
};

const createPeer = (
  roomID,
  userToSignal,
  callerID,
  callerName,
  stream,
  socket
) => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
  });

  peer.on("signal", (signal) => {
    socket.emit("sending signal", {
      roomID,
      userToSignal,
      callerID,
      callerName,
      signal,
    });
  });

  return peer;
};

export const addPeer = (
  incomingSignal,
  callerID,
  stream,
  socket,
  roomID,
  userID
) => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream,
  });

  peer.on("signal", (signal) => {
    socket.emit("returning signal", { signal, callerID, roomID, userID });
  });

  peer.signal(incomingSignal);

  return peer;
};

export const makeGroupCall = (
  dispatch,
  socket,
  stream,
  myStream,
  roomId,
  senderInfo,
  groupInfo,
  groupPeersRef,
  videoChat
) => {
  dispatch(getStream(stream));
  const members = groupInfo.members.filter(
    (member) => member !== senderInfo?.email
  );
  socket.emit("members to call", {
    members: members,
    callerID: senderInfo?.email,
    callerName: senderInfo?.displayName,
    roomID: roomId,
    callType: videoChat ? "Video Call" : "Audio Call",
  });

  socket.emit("join room", {
    roomID: roomId,
    userID: senderInfo?.email,
    userName: senderInfo?.displayName,
  });

  myStream.current.srcObject = stream;

  socket.on("user joined", (payload) => {
    // console.log("user joined", payload, senderInfo?.email);
    if (roomId === payload.roomID) {
      if (payload.userToSignal === senderInfo?.email) {
        // console.log("user joined", payload);
        dispatch(isCallAccepted(true));
        const peer = addPeer(
          payload.signal,
          payload.callerID,
          stream,
          socket,
          payload.roomID,
          senderInfo?.email
        );
        groupPeersRef.current.push({
          peerID: payload.callerID,
          peerName: payload.callerName,
          peer,
        });
        dispatch(
          setPeersForGroupCall(
            {
              peerID: payload.callerID,
              peerName: payload.callerName,
              peer,
            },
            "receive-signal"
          )
        );
      }
    }
  });
};

export const acceptGroupCall = (
  dispatch,
  socket,
  roomIdOfReceivingGroupCall,
  userInfo,
  stream,
  groupPeersRef
) => {
  dispatch(isCallAccepted(true));
  // console.log("join room", roomIdOfReceivingGroupCall, userInfo);
  socket.emit("join room", {
    roomID: roomIdOfReceivingGroupCall,
    userID: userInfo?.email,
    userName: userInfo?.displayName,
  });

  socket.on("all users", ({ usersInThisRoom, roomID }) => {
    const users = usersInThisRoom;
    if (roomIdOfReceivingGroupCall !== roomID) return;
    if (!users.length) return;
    // console.log("all users", users);
    const peers = [];
    users.forEach((otherID) => {
      const peer = createPeer(
        roomIdOfReceivingGroupCall,
        otherID?.id,
        userInfo?.email,
        userInfo?.displayName,
        stream,
        socket
      );
      groupPeersRef.current.push({
        peerID: otherID?.id,
        peerName: otherID?.name,
        peer,
      });
      peers.push({
        peerID: otherID?.id,
        peerName: otherID?.name,
        peer,
      });
    });
    dispatch(setPeersForGroupCall(peers));
  });

  socket.on("user joined", (payload) => {
    // console.log("user joined", payload, userInfo?.email);
    if (roomIdOfReceivingGroupCall === payload.roomID) {
      if (payload.userToSignal === userInfo?.email) {
        const peer = addPeer(
          payload.signal,
          payload.callerID,
          stream,
          socket,
          payload.roomID,
          userInfo?.email
        );
        groupPeersRef.current.push({
          peerID: payload.callerID,
          peerName: payload.callerName,
          peer,
        });

        dispatch(
          setPeersForGroupCall(
            {
              peerID: payload.callerID,
              peerName: payload.callerName,
              peer,
            },
            "receive-signal"
          )
        );
      }
    }
  });

  socket.on("receiving returned signal", (payload) => {
    // console.log(
    //   "receiving returned signal",
    //   payload,
    //   roomIdOfReceivingGroupCall,
    //   userInfo.email
    // );
    if (payload.roomID === roomIdOfReceivingGroupCall) {
      if (payload.callerID === userInfo.email) {
        const item = groupPeersRef.current.find((p) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      }
    }
  });
};
