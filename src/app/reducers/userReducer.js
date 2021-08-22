import {
  ADD_CHAT_LIST,
  ERROR_USER_INFO,
  GET_ALL_USER_INFO,
  GET_FRIEND_INFO,
  GET_FRIEND_INFO_FROM_SOCKET,
  LOADING_USER_INFO,
  POST_USER_INFO,
  GET_USER_INFO,
  GET_RECEIVER_INFO,
  UPDATE_FRIEND_STATUS,
  UPDATE_CHAT_STATUS,
  OPEN_GROUP_MAKING_SECTION,
  SELECTED_PEOPLE_TO_CREATE_GROUP,
  UPDATED_SELECTED_ID_LIST,
} from "../types";

const initialState = {
  userInfo: {},
  allUserInfo: [],
  chatList: [],
  receiverInfo: {},
  error: "",
  success: "",
  loading: false,
  addChatList: true,
  makeGroup: false,
  selectedIdsForGroup: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
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
    case GET_FRIEND_INFO_FROM_SOCKET:
      return {
        ...state,
        chatList: [...state.chatList, action.payload],
      };
    case UPDATE_FRIEND_STATUS:
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
    case GET_RECEIVER_INFO:
      return {
        ...state,
        receiverInfo: action.payload,
      };
    case UPDATE_CHAT_STATUS:
      return {
        ...state,
        receiverInfo: action.payload,
      };

    // group making tab
    case OPEN_GROUP_MAKING_SECTION:
      return {
        ...state,
        makeGroup: action.payload,
      };
    case SELECTED_PEOPLE_TO_CREATE_GROUP:
      return {
        ...state,
        selectedIdsForGroup: [...state.selectedIdsForGroup, action.payload],
      };
    case UPDATED_SELECTED_ID_LIST:
      return {
        ...state,
        selectedIdsForGroup: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
