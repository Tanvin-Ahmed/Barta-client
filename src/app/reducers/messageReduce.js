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
  OPEN_OPTIONS_FOR_CHAT,
  REACT_TAB_TOGGLE,
  UPDATE_CHAT_REACT,
  DELETE_CHAT_MESSAGE,
  SET_ROOM_ID,
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
  isOpenOptions: {},
  reactTabIsOpen: false,
  roomId: "",
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

    case UPDATE_CHAT_REACT:
      return {
        ...state,
        oneOneMessage: action.payload,
      };

    case DELETE_CHAT_MESSAGE:
      return {
        ...state,
        oneOneMessage: action.payload,
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

    case OPEN_OPTIONS_FOR_CHAT:
      return {
        ...state,
        isOpenOptions: action.payload,
      };

    case REACT_TAB_TOGGLE:
      return {
        ...state,
        reactTabIsOpen: action.payload,
      };

    case SET_ROOM_ID:
      return {
        ...state,
        roomId: action.payload,
      };

    default:
      return state;
  }
};

export default messageReducer;
