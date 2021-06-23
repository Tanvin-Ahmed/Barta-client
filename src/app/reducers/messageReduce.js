import {
  GET_ONE_ONE_CHAT,
  GET_GROUP_CHAT,
  CHAT_ERROR,
  CHAT_UPLOAD_PERCENTAGE,
  GET_ONE_ONE_CHAT_FROM_SOCKET,
  SCREEN_SIZE,
  IS_TYPE,
  CLICK_UPLOAD_OPTION,
  SELECTED_FILES,
} from "../types";

const initialState = {
  oneOneMessage: [],
  groupMessage: [],
  error: "",
  uploadPercentage: 0,
  largeScreen: true,
  typing: false,
  clickUploadOption: false,
  chosenFiles: [],
};

const messageReducer = (state = initialState, action) => {
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

    case SCREEN_SIZE:
      return {
        ...state,
        largeScreen: action.payload,
      };

    case IS_TYPE:
      return {
        ...state,
        typing: action.payload,
      };

    case CLICK_UPLOAD_OPTION:
      return {
        ...state,
        clickUploadOption: action.payload,
      };

    case SELECTED_FILES:
      return {
        ...state,
        chosenFiles: action.payload,
      };

    default:
      return state;
  }
};

export default messageReducer;
