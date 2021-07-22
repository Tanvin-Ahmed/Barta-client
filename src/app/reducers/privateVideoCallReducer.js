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
  VIDEO_CHAT,
  VIDEO_OPEN,
  VOICE_OPEN,
} from "../types";

const initialState = {
  openPrivateVideoCall: false,
  myId: "",
  idToCall: "",
  stream: null,
  receivingCall: false,
  caller: "",
  callerSignal: null,
  callAccepted: false,
  callEnded: false,
  myName: "",
  userName: "",
  voiceOpen: true,
  videoOpen: true,
  videoChat: false,
};

const privateVideoCall = (state = initialState, action) => {
  switch (action.type) {
    case VIDEO_CHAT:
      return {
        ...state,
        videoChat: action.payload,
      };
    case OPEN_PRIVATE_VIDEO_CALL:
      return {
        ...state,
        openPrivateVideoCall: action.payload,
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
    default:
      return state;
  }
};

export default privateVideoCall;
