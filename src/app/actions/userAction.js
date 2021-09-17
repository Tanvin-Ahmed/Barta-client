import axios from "axios";
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

export const getUserInfo = () => {
  return async (dispatch) => {
    let userData = await localStorage.getItem("barta/user");
    userData = JSON.parse(userData);

    dispatch({
      type: GET_USER_INFO,
      payload: userData,
    });
  };
};

export const getFriendInfo = (userEmail) => {
  return (dispatch) => {
    dispatch({
      type: SET_SPINNER_FOR_CHAT_LIST,
      payload: true,
    });
    axios(`http://localhost:5000/user/account/${userEmail}`)
      .then((data) => {
        dispatch({
          type: SET_SPINNER_FOR_CHAT_LIST,
          payload: false,
        });
        dispatch({
          type: GET_FRIEND_INFO,
          payload: data.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: SET_SPINNER_FOR_CHAT_LIST,
          payload: false,
        });
        dispatch({
          type: ERROR_USER_INFO,
          payload: error.message,
        });
      });
  };
};

export const updateFriendStatus = (friendList) => {
  return {
    type: UPDATE_FRIEND_STATUS,
    payload: friendList,
  };
};

export const getFriendInfoFromSocket = (friendEmail) => {
  return (dispatch) => {
    axios(
      `http://localhost:5000/user/account/getFriendDetailsByEmail/${friendEmail}`
    ).then((data) => {
      dispatch({
        type: GET_FRIEND_INFO_FROM_SOCKET,
        payload: data.data,
      });
    });
  };
};

export const postFriendInfo = (roomId, friendData) => {
  const room = roomId.split("_");
  const emails = [`${room[0]}@gmail.com`, `${room[1]}@gmail.com`];

  const friendInfo = friendData.friendInfo;

  return (dispatch) => {
    for (let j = 0; j < emails.length; j++) {
      const email = emails[j];

      for (let k = 0; k < friendInfo.length; k++) {
        const friend = friendInfo[k];

        if (email !== friend.email) {
          const friendInfo = {
            friendOf: friend.friendOf,
            email: friend.email,
          };

          axios
            .put(
              `http://localhost:5000/user/account/updateChatList/${email}`,
              friendInfo
            )
            .then((data) => {
              dispatch({
                type: POST_USER_INFO,
                payload: data.data,
              });
            })
            .catch((error) => {
              dispatch({
                type: ERROR_USER_INFO,
                payload: error.message,
              });
            });
        }
      }
    }
  };
};

export const getAllUserInfo = (searchString) => {
  if (searchString.trim()) {
    return (dispatch) => {
      dispatch({
        type: LOADING_USER_INFO,
        payload: true,
      });
      axios(`http://localhost:5000/user/account/allAccount/${searchString}`)
        .then((data) => {
          dispatch({
            type: GET_ALL_USER_INFO,
            payload: data.data[0] ? data.data : [],
          });
          dispatch({
            type: LOADING_USER_INFO,
            payload: false,
          });
        })
        .catch((error) => {
          dispatch({
            type: ERROR_USER_INFO,
            payload: error.message,
          });
          dispatch({
            type: LOADING_USER_INFO,
            payload: false,
          });
        });
    };
  } else {
    return (dispatch) => {
      dispatch({
        type: GET_ALL_USER_INFO,
        payload: [],
      });
      dispatch({
        type: LOADING_USER_INFO,
        payload: false,
      });
    };
  }
};

export const postMyInfo = (user) => {
  return (dispatch) => {
    getUserInfo();
    axios
      .post("http://localhost:5000/user/account", user)
      .then((data) => {
        localStorage.setItem(
          "barta/user",
          JSON.stringify({
            _id: data.data._id,
            email: data.data.email,
            displayName: data.data.displayName,
            photoURL: data.data.photoURL,
            status: "active",
          })
        );
        dispatch({
          type: POST_USER_INFO,
          payload: data.data.insertCount > 0,
        });
      })
      .catch((error) => {
        dispatch({
          type: ERROR_USER_INFO,
          payload: error,
        });
      });
  };
};

export const updateChatList = (bool) => {
  return {
    type: ADD_CHAT_LIST,
    payload: bool,
  };
};

export const getReceiverInfo = (id) => {
  return (dispatch) => {
    dispatch({
      type: GET_GROUP_INFO,
      payload: {},
    });
    axios(`http://localhost:5000/user/account/receiverInfo/${id}`)
      .then((data) => {
        dispatch({
          type: GET_RECEIVER_INFO,
          payload: data.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: ERROR_USER_INFO,
          payload: err.message,
        });
      });
  };
};

export const updateChatStatus = (updateStatus) => {
  return {
    type: UPDATE_CHAT_STATUS,
    payload: updateStatus,
  };
};

///////////////////// group making tap /////////////////////
export const setOpenGroupList = (bool) => {
  return {
    type: GO_TO_GROUP_LIST,
    payload: bool,
  };
};

export const setGroupsInfoFromDatabase = (userEmail) => {
  return (dispatch) => {
    dispatch({
      type: SET_SPINNER_FOR_GROUP_LIST,
      payload: true,
    });
    axios(`http://localhost:5000/user/account/groupList/${userEmail}`)
      .then((data) => {
        dispatch({
          type: SET_SPINNER_FOR_GROUP_LIST,
          payload: false,
        });
        dispatch({
          type: SET_GROUP_LIST_FROM_DATABASE,
          payload: data.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: SET_SPINNER_FOR_GROUP_LIST,
          payload: false,
        });
        dispatch({
          type: ERROR_USER_INFO,
          payload: error.message,
        });
      });
  };
};

export const setOpenGroupMakingTab = (bool) => {
  return {
    type: OPEN_GROUP_MAKING_SECTION,
    payload: bool,
  };
};

export const setSelectedIdInfo = (info) => {
  return {
    type: SELECTED_PEOPLE_TO_CREATE_GROUP,
    payload: info,
  };
};

export const updatedSelectedIdList = (list) => {
  return {
    type: UPDATED_SELECTED_ID_LIST,
    payload: list,
  };
};

export const setFinalStepToCreateGroup = (bool) => {
  return {
    type: FINAL_STEP_TO_CREATE_GROUP,
    payload: bool,
  };
};

export const setGroupName = (name) => {
  return {
    type: SET_GROUP_NAME,
    payload: name,
  };
};

export const clearSelectedIdsForGroup = () => {
  return {
    type: CLEAR_SELECTED_ID_FOR_GROUP,
    payload: [],
  };
};

export const clearGroupCreateSuccessfullyStatus = () => {
  return {
    type: CLEAR_GROUP_CREATED_SUCCESSFULLY_STATUS,
    payload: false,
  };
};

const addGroupNameInGroupMemberProfile = (selectedUserEmail, groupName) => {
  for (let i = 0; i < selectedUserEmail.length; i++) {
    const email = selectedUserEmail[i];
    axios
      .put(`http://localhost:5000/user/account/updateGroupList/${email}`, {
        member: email?.split("@")[0],
        groupName,
      })
      .then(() => console.log("updated group list"))
      .catch(() => console.log("group list not updated"));
  }
};

export const createGroup = (selectedUserEmail, groupName) => {
  return (dispatch) => {
    dispatch({
      type: GROUP_CREATING_SPINNER,
      payload: true,
    });
    const groupInfo = {
      groupName: `${groupName}◉_◉${Date.now()}`,
      photoURL: "",
      members: selectedUserEmail,
      status: "active",
      timeStamp: new Date().toUTCString(),
    };
    axios
      .post("http://localhost:5000/groupAccount/newGroup", groupInfo)
      .then((res) => {
        addGroupNameInGroupMemberProfile(
          selectedUserEmail,
          res?.data?.groupName
        );
        dispatch({
          type: GROUP_CREATING_SPINNER,
          payload: false,
        });
        dispatch({
          type: GROUP_CREATED_SUCCESSFULLY,
          payload: true,
        });
      })
      .catch((err) => {
        dispatch({
          type: GROUP_CREATING_SPINNER,
          payload: false,
        });
        dispatch({
          type: GROUP_CREATED_SUCCESSFULLY,
          payload: false,
        });
        alert("Group not created, please try again.");
      });
  };
};

export const getGroupIdForChatBar = (groupName, reason) => {
  return (dispatch) => {
    if (!reason) {
      dispatch({
        type: GET_RECEIVER_INFO,
        payload: {},
      });
    }

    axios(`http://localhost:5000/groupAccount/groupInfo/${groupName}`).then(
      (data) => {
        if (reason === "chatBar") {
          dispatch({
            type: GET_GROUP_INFO_FROM_SOCKET,
            payload: data.data,
          });
        } else {
          dispatch({
            type: GET_GROUP_INFO,
            payload: data.data,
          });
        }
      }
    );
  };
};
