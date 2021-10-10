import {
  GET_MESSAGES_FROM_DB,
  CHAT_ERROR,
  CHAT_UPLOAD_PERCENTAGE,
  GET_NEW_MESSAGE_FROM_SOCKET,
  SCREEN_SIZE,
  IS_TYPE,
  SELECTED_FILES,
  OPEN_OPTIONS_FOR_CHAT,
  REACT_TAB_TOGGLE,
  UPDATE_CHAT_REACT,
  DELETE_CHAT_MESSAGE,
  SET_ROOM_ID,
  REFETCH_MESSAGE,
  GET_MESSAGE_SPINNER,
  GET_OLD_MESSAGES_FROM_DB,
} from "../types";

const initialState = {
  chatMessages: [],
  error: "",
  uploadPercentage: 0,
  getMessageSpinner: false,
  largeScreen: true,
  typing: false,
  chosenFiles: [],
  isOpenOptions: {},
  reactTabIsOpen: false,
  roomId: "",
  reFetchMessage: false,
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES_FROM_DB:
      return {
        ...state,
        chatMessages: action.payload,
      };
    case GET_OLD_MESSAGES_FROM_DB:
      return {
        ...state,
        chatMessages: [...action.payload, ...state.chatMessages],
      };
    case GET_MESSAGE_SPINNER:
      return {
        ...state,
        getMessageSpinner: action.payload,
      };
    case REFETCH_MESSAGE:
      return {
        ...state,
        reFetchMessage: action.payload,
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

    case GET_NEW_MESSAGE_FROM_SOCKET:
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };

    case UPDATE_CHAT_REACT:
      return {
        ...state,
        chatMessages: action.payload,
      };

    case DELETE_CHAT_MESSAGE:
      return {
        ...state,
        chatMessages: action.payload,
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
