import {
  ADD_CHAT_LIST,
  ERROR_USER_INFO,
  GET_ALL_USER_INFO,
  GET_FRIEND_INFO,
  LOADING_USER_INFO,
  POST_USER_INFO,
} from "../types";

const initialState = {
  allUserInfo: [],
  chatList: [],
  error: "",
  success: "",
  loading: false,
  addChatList: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_USER_INFO:
      return {
        ...state,
        loading: action.payload,
      };
    case GET_ALL_USER_INFO:
      return {
        ...state,
        allUserInfo: action.payload,
      };
    case GET_FRIEND_INFO:
      return {
        ...state,
        chatList: action.payload,
      };
    case POST_USER_INFO:
      return {
        ...state,
        success: action.payload,
      };
    case ERROR_USER_INFO:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_CHAT_LIST:
      return {
        ...state,
        addChatList: action.payload,
      };
    default:
      return state;
  }
};
