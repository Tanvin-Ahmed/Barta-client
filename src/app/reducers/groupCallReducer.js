import {
  ACCEPTOR_SET_PEERS_FOR_GROUP_CALL,
  OPEN_GROUP_CALL,
  SET_ACCEPTED_GROUP_CALL,
  SET_CALLER_NAME,
  SET_PEERS_FOR_GROUP_CALL,
  SET_SHOW_BUTTON,
} from "../types";

const initialState = {
  openGroupCall: false,
  peersForGroupCall: [],
  callerName: "",
  showCallButtons: true,
  acceptedGroupCall: false,
};

const groupCallReducer = (state = initialState, action) => {
  switch (action.type) {
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
    case SET_CALLER_NAME:
      return {
        state,
        callerName: action.payload,
      };
    case SET_SHOW_BUTTON:
      return {
        ...state,
        showCallButtons: action.payload,
      };
    case SET_ACCEPTED_GROUP_CALL:
      return {
        ...state,
        acceptedGroupCall: action.payload,
      };
    default:
      return state;
  }
};

export default groupCallReducer;
