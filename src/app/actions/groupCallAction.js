import {
  ACCEPTOR_SET_PEERS_FOR_GROUP_CALL,
  OPEN_GROUP_CALL,
  SET_CALLER_NAME,
  SET_PEERS_FOR_GROUP_CALL,
  SET_SHOW_BUTTON,
} from "../types";

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

export const setCallerName = (name) => {
  return {
    type: SET_CALLER_NAME,
    payload: name,
  };
};

export const setShowCallButtons = (bool) => {
  return {
    type: SET_SHOW_BUTTON,
    payload: bool,
  };
};
