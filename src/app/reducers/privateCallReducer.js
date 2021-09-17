import {
  ACCEPTOR_SET_PEERS_FOR_GROUP_CALL,
  CALLER,
  CALLER_SIGNAL,
  CALL_ACCEPTED,
  CALL_ENDED,
  CALL_REACH_TO_RECEIVER,
  CALL_TIMER,
  GET_MY_NAME,
  GET_ROOM_ID_OF_RECEIVING_GROUP_CALL,
  GET_USER_NAME,
  MY_ID,
  OPEN_GROUP_CALL,
  OPEN_PRIVATE_CALL,
  READ_STREAM,
  RECEIVING_CALL,
  RECEIVING_GROUP_CALL,
  SET_CALLER_NAME,
  SET_INTERVAL,
  SET_PEERS_FOR_GROUP_CALL,
  SET_RECEIVER,
  START_TIMER,
  USER_ID,
  VIDEO_CHAT,
  VIDEO_OPEN,
  VOICE_OPEN,
} from "../types";

const initialState = {
  openPrivateCall: false,
  openGroupCall: false,
  myId: "", // private call
  idToCall: "", // for private call
  stream: null,
  receivingCall: false,
  receivingGroupCall: false,
  caller: "", // private call caller id
  callerSignal: null,
  callAccepted: false,
  callEnded: false,
  myName: "", // private call my name
  userName: "", // private call receiver name
  voiceOpen: true,
  videoOpen: true,
  videoChat: false,
  callReachToReceiver: false,
  timer: { h: 0, m: 0, s: 0 },
  startTimer: false,
  interVal: null,
  receiver: false,
  peersForGroupCall: [],
  callerName: "", // group call caller name
};

const privateCall = (state = initialState, action) => {
  switch (action.type) {
    case VIDEO_CHAT:
      return {
        ...state,
        videoChat: action.payload,
      };
    case OPEN_PRIVATE_CALL:
      return {
        ...state,
        openPrivateCall: action.payload,
      };
    case OPEN_GROUP_CALL:
      return {
        ...state,
        openGroupCall: action.payload,
      };
    case SET_PEERS_FOR_GROUP_CALL:
      return {
        ...state,
        peersForGroupCall: action.payload,
      };
    case ACCEPTOR_SET_PEERS_FOR_GROUP_CALL:
      return {
        ...state,
        peersForGroupCall: [...state.peersForGroupCall, action.payload],
      };
    case MY_ID:
      return {
        ...state,
        myId: action.payload,
      };
    case USER_ID:
      return {
        ...state,
        idToCall: action.payload,
      };
    case READ_STREAM:
      return {
        ...state,
        stream: action.payload,
      };
    case RECEIVING_CALL:
      return {
        ...state,
        receivingCall: action.payload,
      };
    case RECEIVING_GROUP_CALL:
      return {
        ...state,
        receivingGroupCall: action.payload,
      };
    case CALLER:
      return {
        ...state,
        caller: action.payload,
      };
    case CALLER_SIGNAL:
      return {
        ...state,
        callerSignal: action.payload,
      };
    case CALL_ACCEPTED:
      return {
        ...state,
        callAccepted: action.payload,
      };
    case CALL_ENDED:
      return {
        ...state,
        callEnded: action.payload,
      };
    case GET_MY_NAME:
      return {
        ...state,
        myName: action.payload,
      };
    case GET_USER_NAME:
      return {
        ...state,
        userName: action.payload,
      };
    case VOICE_OPEN:
      return {
        ...state,
        voiceOpen: action.payload,
      };
    case VIDEO_OPEN:
      return {
        ...state,
        videoOpen: action.payload,
      };
    case CALL_REACH_TO_RECEIVER:
      return {
        ...state,
        callReachToReceiver: action.payload,
      };
    case CALL_TIMER:
      return {
        ...state,
        timer: action.payload,
      };
    case START_TIMER:
      return {
        ...state,
        startTimer: action.payload,
      };
    case SET_INTERVAL:
      return {
        ...state,
        interVal: action.payload,
      };
    case SET_RECEIVER:
      return {
        ...state,
        receiver: action.payload,
      };
    case SET_CALLER_NAME:
      return {
        state,
        callerName: action.payload,
      };
    default:
      return state;
  }
};

export default privateCall;
