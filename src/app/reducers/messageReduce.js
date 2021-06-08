import {
  GET_ONE_ONE_CHAT,
  GET_GROUP_CHAT,
  CHAT_ERROR,
  CHAT_UPLOAD_PERCENTAGE,
  GET_ONE_ONE_CHAT_FROM_SOCKET,
} from "../types";

const initialState = {
  oneOneMessage: [],
  groupMessage: [],
  error: "",
  uploadPercentage: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ONE_ONE_CHAT:
      return {
        ...state,
        oneOneMessage: action.payload,
      };
    case GET_GROUP_CHAT:
      return {
        ...state,
        groupMessage: action.payload,
      };
    case CHAT_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case CHAT_UPLOAD_PERCENTAGE:
      return {
        ...state,
        uploadPercentage: action.payload,
      };

    case GET_ONE_ONE_CHAT_FROM_SOCKET:
      return {
        ...state,
        oneOneMessage: [...state.oneOneMessage, action.payload],
      };
    default:
      return state;
  }
};
