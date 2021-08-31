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
  FINAL_STEP_TO_CREATE_GROUP,
  SET_GROUP_NAME,
  GROUP_CREATED_SUCCESSFULLY,
  GROUP_CREATING_SPINNER,
  CLEAR_SELECTED_ID_FOR_GROUP,
  CLEAR_GROUP_CREATED_SUCCESSFULLY_STATUS,
  GO_TO_GROUP_LIST,
  SET_GROUP_LIST_FROM_DATABASE,
  GET_GROUP_INFO_FROM_SOCKET,
  GET_GROUP_INFO,
  SET_SPINNER_FOR_CHAT_LIST,
  SET_SPINNER_FOR_GROUP_LIST,
} from "../types";

const initialState = {
  userInfo: {},
  allUserInfo: [],
  chatList: [],
  spinnerForChatList: false,
  receiverInfo: {},
  error: "",
  success: "",
  loading: false,
  addChatList: true,
  // for group
  openGroupList: false,
  groups: [],
  spinnerForGroupList: false,
  makeGroup: false,
  finalStepToCreateGroup: false,
  groupName: "",
  selectedIdsForGroup: [],
  groupCreated: false,
  groupCreatingSpinner: false,
  groupInfo: {},
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
    case SET_SPINNER_FOR_CHAT_LIST:
      return {
        ...state,
        spinnerForChatList: action.payload,
      };
    case GET_FRIEND_INFO:
      return {
        ...state,
        chatList: action.payload,
      };
    case GET_FRIEND_INFO_FROM_SOCKET:
      return {
        ...state,
        chatList: [action.payload, ...state.chatList],
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
    case GO_TO_GROUP_LIST:
      return {
        ...state,
        openGroupList: action.payload,
      };
    case SET_SPINNER_FOR_GROUP_LIST:
      return {
        ...state,
        spinnerForGroupList: action.payload,
      };
    case SET_GROUP_LIST_FROM_DATABASE:
      return {
        ...state,
        groups: action.payload,
      };
    case GET_GROUP_INFO_FROM_SOCKET:
      return {
        ...state,
        groups: [action.payload, ...state.groups],
      };
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
    case CLEAR_SELECTED_ID_FOR_GROUP:
      return {
        ...state,
        selectedIdsForGroup: action.payload,
      };
    case UPDATED_SELECTED_ID_LIST:
      return {
        ...state,
        selectedIdsForGroup: action.payload,
      };
    case FINAL_STEP_TO_CREATE_GROUP:
      return {
        ...state,
        finalStepToCreateGroup: action.payload,
      };
    case SET_GROUP_NAME:
      return {
        ...state,
        groupName: action.payload,
      };
    case GROUP_CREATED_SUCCESSFULLY:
      return {
        ...state,
        groupCreated: action.payload,
      };
    case CLEAR_GROUP_CREATED_SUCCESSFULLY_STATUS:
      return {
        ...state,
        groupCreated: action.payload,
      };
    case GROUP_CREATING_SPINNER:
      return {
        ...state,
        groupCreatingSpinner: action.payload,
      };
    case GET_GROUP_INFO:
      return {
        ...state,
        groupInfo: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
