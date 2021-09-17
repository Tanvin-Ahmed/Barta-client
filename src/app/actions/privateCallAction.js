import axios from "axios";
import {
  CALLER,
  CALLER_SIGNAL,
  CALL_ACCEPTED,
  CALL_ENDED,
  CALL_REACH_TO_RECEIVER,
  CALL_TIMER,
  GET_MY_NAME,
  GET_USER_NAME,
  MY_ID,
  OPEN_GROUP_CALL,
  OPEN_PRIVATE_CALL,
  READ_STREAM,
  RECEIVING_CALL,
  RECEIVING_GROUP_CALL,
  SET_INTERVAL,
  SET_PEERS_FOR_GROUP_CALL,
  SET_RECEIVER,
  START_TIMER,
  USER_ID,
  VIDEO_CHAT,
  VIDEO_OPEN,
  VOICE_OPEN,
  GET_ROOM_ID_OF_RECEIVING_GROUP_CALL,
  ACCEPTOR_SET_PEERS_FOR_GROUP_CALL,
  SET_CALLER_NAME,
} from "../types";

export const setPrivateCallIsOpen = (toggle) => {
  return {
    type: OPEN_PRIVATE_CALL,
    payload: toggle,
  };
};

export const setGroupCallIsOpen = (toggle) => {
  return {
    type: OPEN_GROUP_CALL,
    payload: toggle,
  };
};
export const setPeersForGroupCall = (peers, from = "") => {
  return (dispatch) => {
    if (from === "receive-signal") {
      dispatch({
        type: ACCEPTOR_SET_PEERS_FOR_GROUP_CALL,
        payload: peers,
      });
    } else {
      dispatch({
        type: SET_PEERS_FOR_GROUP_CALL,
        payload: peers,
      });
    }
  };
};

export const isVideoChat = (bool) => {
  return {
    type: VIDEO_CHAT,
    payload: bool,
  };
};

export const setVideoOpen = (toggle) => {
  return {
    type: VIDEO_OPEN,
    payload: toggle,
  };
};

export const setVoiceOpen = (toggle) => {
  return {
    type: VOICE_OPEN,
    payload: toggle,
  };
};

export const getMyId = (id) => {
  return {
    type: MY_ID,
    payload: id,
  };
};

export const getUserId = (id) => {
  return {
    type: USER_ID,
    payload: id,
  };
};

export const getStream = (stream) => {
  return {
    type: READ_STREAM,
    payload: stream,
  };
};

export const isReceivingCall = (bool) => {
  return {
    type: RECEIVING_CALL,
    payload: bool,
  };
};

export const setReceivingGroupCall = (bool) => {
  return {
    type: RECEIVING_GROUP_CALL,
    payload: bool,
  };
};

export const getCaller = (caller) => {
  return {
    type: CALLER,
    payload: caller,
  };
};

export const getCallerSignal = (signal) => {
  return {
    type: CALLER_SIGNAL,
    payload: signal,
  };
};

export const isCallAccepted = (res) => {
  return {
    type: CALL_ACCEPTED,
    payload: res,
  };
};

export const isCallEnded = (end) => {
  return {
    type: CALL_ENDED,
    payload: end,
  };
};

export const getMyName = (name) => {
  return {
    type: GET_MY_NAME,
    payload: name,
  };
};

export const getUserName = (name) => {
  return {
    type: GET_USER_NAME,
    payload: name,
  };
};

export const setCallReachToReceiver = (bool) => {
  return {
    type: CALL_REACH_TO_RECEIVER,
    payload: bool,
  };
};

export const setCallTimer = (timer) => {
  return {
    type: CALL_TIMER,
    payload: timer,
  };
};

export const setStartTimer = (bol) => {
  return {
    type: START_TIMER,
    payload: bol,
  };
};

export const setInterVal = (interVal) => {
  return {
    type: SET_INTERVAL,
    payload: interVal,
  };
};

export const setReceiver = (bol) => {
  return {
    type: SET_RECEIVER,
    payload: bol,
  };
};

export const setCallerName = (name) => {
  return {
    type: SET_CALLER_NAME,
    payload: name,
  };
};

export const setCallInfoInDatabase = (callInfo) => {
  axios
    .post("http://localhost:5000/chatMessage/postCallInfo", callInfo)
    .then((res) => res)
    .catch((err) => err.message);
};