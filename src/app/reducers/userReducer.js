import {
  OPEN_FRIEND_LIST_TAB,
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
  SET_FIND_FRIEND_ERROR,
  SET_LOGIN_SPINNER,
  SET_VERIFY_JWT_TOKEN_SPINNER,
  REMOVE_USER_INFO,
  SET_ACCESS_TOKEN,
  SET_PROFILE_UPDATE_SPINNER,
  SET_ADD_MEMBER_SPINNER,
  SET_ADD_MEMBER_COMPLETE_ICON,
  SET_ADD_MEMBER_ERROR_ICON,
  SET_DELETE_ACCOUNT_FOREVER,
  SET_USER_INFO_SPINNER,
} from "../types";

const initialState = {
  accessToken: "",
  tokenVerifySpinner: false,
  loginSpinner: false,
  userInfo: {},
  userInfoSpinner: false,
  allUserInfo: [],
  friendNotAvailable: "",
  chatList: []?.filter(
    (item, index, self) => index === self.findIndex((t) => t._id === item._id)
  ),
  spinnerForChatList: false,
  receiverInfo: {},
  error: "",
  success: "",
  loading: false,
  friendListOpen: true,
  profileUpdateSpinner: false,
  // for group
  openGroupList: false,
  groups: []?.filter(
    (item, index, self) => index === self.findIndex((t) => t._id === item._id)
  ),
  spinnerForGroupList: false,
  makeGroup: false,
  finalStepToCreateGroup: false,
  groupName: "",
  selectedIdsForGroup: [],
  groupCreated: false,
  groupCreatingSpinner: false,
  groupInfo: {},
  addMemberSpinner: false,
  completeAddMemberIcon: false,
  errorToUploadMemberIcon: false,
  deleteAccountAlert: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload,
      };
    case SET_VERIFY_JWT_TOKEN_SPINNER:
      return {
        ...state,
        tokenVerifySpinner: action.payload,
      };
    case SET_LOGIN_SPINNER:
      return {
        ...state,
        loginSpinner: action.payload,
      };
    case GET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case REMOVE_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case SET_USER_INFO_SPINNER:
      return {
        ...state,
        userInfoSpinner: action.payload,
      };
    case LOADING_USER_INFO:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_PROFILE_UPDATE_SPINNER:
      return {
        ...state,
        profileUpdateSpinner: action.payload,
      };
    case GET_ALL_USER_INFO:
      return {
        ...state,
        allUserInfo: action.payload,
      };
    case SET_FIND_FRIEND_ERROR:
      return {
        ...state,
        friendNotAvailable: action.payload,
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
    case OPEN_FRIEND_LIST_TAB:
      return {
        ...state,
        friendListOpen: action.payload,
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
    case SET_ADD_MEMBER_SPINNER:
      return {
        ...state,
        addMemberSpinner: action.payload,
      };
    case SET_ADD_MEMBER_COMPLETE_ICON:
      return {
        ...state,
        completeAddMemberIcon: action.payload,
      };
    case SET_ADD_MEMBER_ERROR_ICON:
      return {
        ...state,
        errorToUploadMemberIcon: action.payload,
      };
    case SET_DELETE_ACCOUNT_FOREVER:
      return {
        ...state,
        deleteAccountAlert: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
