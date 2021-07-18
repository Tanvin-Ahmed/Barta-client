import {
  CALLER,
  CALLER_SIGNAL,
  CALL_ACCEPTED,
  CALL_ENDED,
  GET_MY_NAME,
  GET_USER_NAME,
  MY_ID,
  OPEN_PRIVATE_VIDEO_CALL,
  READ_STREAM,
  RECEIVING_CALL,
  USER_ID,
  VIDEO_OPEN,
  VOICE_OPEN,
} from "../types";

export const setVideoCallIsOpen = (toggle) => {
  return {
    type: OPEN_PRIVATE_VIDEO_CALL,
    payload: toggle,
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

export const isReceivingCall = (call) => {
  return {
    type: RECEIVING_CALL,
    payload: call,
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
