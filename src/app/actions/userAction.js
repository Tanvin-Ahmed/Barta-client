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
  SET_FIND_FRIEND_ERROR,
  SET_LOGIN_SPINNER,
  SET_VERIFY_JWT_TOKEN_SPINNER,
  REMOVE_USER_INFO,
  SET_ACCESS_TOKEN,
  SET_PROFILE_UPDATE_SPINNER,
  SET_ADD_MEMBER_SPINNER,
  SET_ADD_MEMBER_COMPLETE_ICON,
  SET_ADD_MEMBER_ERROR_ICON,
} from "../types";
import jwt_decode from "jwt-decode";

let accessToken = "";

const getUserInfoFromDB = (id, token) => {
  return (dispatch) => {
    axios(
      `https://barta-the-real-time-chat-app.herokuapp.com/user/account/userInfo/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(({ data }) => {
        dispatch({
          type: GET_USER_INFO,
          payload: data,
        });
      })
      .catch((err) => {
        alert(err?.response?.data);
      });
  };
};

export const getJWTFromServer = (token) => {
  return (dispatch) => {
    const { _id, displayName, email, status } = jwt_decode(token);
    localStorage.removeItem("accessToken");
    axios
      .post(
        "https://barta-the-real-time-chat-app.herokuapp.com/jwt/get-new-jwt",
        {
          _id,
          displayName,
          email,
          status,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then(({ data }) => {
        accessToken = data;
        localStorage.setItem("accessToken", JSON.stringify(data));
        dispatch({
          type: SET_ACCESS_TOKEN,
          payload: data,
        });
        dispatch({
          type: SET_VERIFY_JWT_TOKEN_SPINNER,
          payload: false,
        });
      })
      .catch((err) => {
        console.log(err.response);
        dispatch({
          type: SET_VERIFY_JWT_TOKEN_SPINNER,
          payload: false,
        });
        alert("Authentication failed");
      });
  };
};

export const getUserInfo = (firstTime = "") => {
  return (dispatch) => {
    dispatch({
      type: SET_VERIFY_JWT_TOKEN_SPINNER,
      payload: true,
    });
    const token = JSON.parse(localStorage.getItem("accessToken"));
    if (!token) {
      dispatch({
        type: SET_VERIFY_JWT_TOKEN_SPINNER,
        payload: false,
      });
      return;
    }
    const { _id, displayName, email, status, exp } = jwt_decode(token);

    if (exp * 1000 <= new Date().getTime()) {
      localStorage.removeItem("accessToken");
    } else {
      accessToken = token;
      dispatch({
        type: SET_ACCESS_TOKEN,
        payload: token,
      });
      dispatch(getJWTFromServer(token));
      firstTime && dispatch(getUserInfoFromDB(_id, token));
      const userData = { _id, displayName, email, status };
      dispatch({
        type: GET_USER_INFO,
        payload: userData,
      });
    }
  };
};

export const removeUserInfo = () => {
  return {
    type: REMOVE_USER_INFO,
    payload: {},
  };
};

export const getFriendInfo = (userEmail) => {
  return async (dispatch) => {
    dispatch({
      type: SET_SPINNER_FOR_CHAT_LIST,
      payload: true,
    });
    axios(
      `https://barta-the-real-time-chat-app.herokuapp.com/user/account/${userEmail}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
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
        if (error.response?.status === 400) {
          dispatch({
            type: SET_FIND_FRIEND_ERROR,
            payload: error.response?.data,
          });
        }
        if (error.response?.status === 401) {
          dispatch({
            type: SET_FIND_FRIEND_ERROR,
            payload: error.response?.data,
          });
        }
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
      `https://barta-the-real-time-chat-app.herokuapp.com/user/account/getFriendDetailsByEmail/${friendEmail}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
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
              `https://barta-the-real-time-chat-app.herokuapp.com/user/account/updateChatList/${email}`,
              friendInfo,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
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
      axios(
        `https://barta-the-real-time-chat-app.herokuapp.com/user/account/allAccount/${searchString}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
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

export const sendSignInRequest = (user, history, from) => {
  return (dispatch) => {
    dispatch({
      type: SET_LOGIN_SPINNER,
      payload: true,
    });
    axios
      .post(
        "https://barta-the-real-time-chat-app.herokuapp.com/user/account/sign-in",
        user
      )
      .then(({ data }) => {
        dispatch({
          type: SET_LOGIN_SPINNER,
          payload: false,
        });
        accessToken = data.token;
        localStorage.setItem("accessToken", JSON.stringify(data.token));
        dispatch({
          type: GET_USER_INFO,
          payload: data.accountInfo,
        });
        dispatch({
          type: SET_ACCESS_TOKEN,
          payload: data.token,
        });
        history.replace(from);
      })
      .catch(() => {
        dispatch({
          type: SET_LOGIN_SPINNER,
          payload: false,
        });
        alert("Sign In failed");
      });
  };
};

export const sendLoginRequest = (user, history, from) => {
  return (dispatch) => {
    dispatch({
      type: SET_LOGIN_SPINNER,
      payload: true,
    });
    axios
      .post(
        "https://barta-the-real-time-chat-app.herokuapp.com/user/account/login",
        user
      )
      .then(({ data }) => {
        dispatch({
          type: SET_LOGIN_SPINNER,
          payload: false,
        });
        accessToken = data.token;
        localStorage.setItem("accessToken", JSON.stringify(data.token));
        dispatch({
          type: GET_USER_INFO,
          payload: data.accountInfo,
        });
        dispatch({
          type: SET_ACCESS_TOKEN,
          payload: data.token,
        });
        history.replace(from);
      })
      .catch(() => {
        dispatch({
          type: SET_LOGIN_SPINNER,
          payload: false,
        });
        alert("Login Failed");
      });
  };
};

export const profileUpdate = (pic, info) => {
  return (dispatch) => {
    if (!pic && !info) return;
    // for (var pair of data.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    dispatch({
      type: SET_PROFILE_UPDATE_SPINNER,
      payload: true,
    });

    let destination = "";
    const updateGroupProfile = JSON.parse(
      sessionStorage.getItem("barta/groupName")
    )?.groupName;
    if (updateGroupProfile) {
      destination = "groupAccount";
    } else {
      destination = "user/account";
    }

    if (pic) {
      axios
        .put(
          `https://barta-the-real-time-chat-app.herokuapp.com/${destination}/update-profile-pic`,
          pic,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then(() => {
          dispatch({
            type: SET_PROFILE_UPDATE_SPINNER,
            payload: false,
          });
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            alert(err.response?.data);
          }
          console.log(err.response);
        });
    }

    info &&
      axios
        .put(
          `https://barta-the-real-time-chat-app.herokuapp.com/${destination}/update-profile-info`,
          info,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then(() => {
          !pic &&
            dispatch({
              type: SET_PROFILE_UPDATE_SPINNER,
              payload: false,
            });
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            alert(err.response?.data);
          }
          dispatch({
            type: SET_PROFILE_UPDATE_SPINNER,
            payload: false,
          });
          console.log(err.response);
        });
  };
};

export const updateProfileDataFromSocket = (data, userInfo, chatList) => {
  return (dispatch) => {
    if (userInfo?._id === data._id) {
      const updatedProfileData = { ...userInfo, ...data.updateFiled };
      dispatch({
        type: GET_USER_INFO,
        payload: updatedProfileData,
      });
    } else {
      const isFriend = chatList?.find((f) => f?._id === data._id);
      if (isFriend) {
        const index = chatList?.findIndex((f) => f?._id === data._id);
        const updatedData = { ...isFriend, ...data.updateFiled };
        chatList.splice(index, 1, updatedData);
      }
    }
  };
};

export const postMyInfo = (user) => {
  return (dispatch) => {
    getUserInfo();
    axios
      .post(
        "https://barta-the-real-time-chat-app.herokuapp.com/user/account",
        user,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
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
    axios(
      `https://barta-the-real-time-chat-app.herokuapp.com/user/account/receiverInfo/${id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
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
    axios(
      `https://barta-the-real-time-chat-app.herokuapp.com/user/account/groupList/${userEmail}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
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

const addGroupNameInGroupMemberProfile = (selectedUserEmail, groupId) => {
  for (let i = 0; i < selectedUserEmail.length; i++) {
    const email = selectedUserEmail[i];
    axios
      .put(
        `https://barta-the-real-time-chat-app.herokuapp.com/user/account/updateGroupList/${email}`,
        {
          member: email?.split("@")[0],
          groupId,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
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
      .post(
        "https://barta-the-real-time-chat-app.herokuapp.com/groupAccount/newGroup",
        groupInfo,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((res) => {
        addGroupNameInGroupMemberProfile(selectedUserEmail, res?.data?._id);
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

export const getGroupIdForChatBar = (id, reason = "") => {
  return (dispatch) => {
    if (!reason) {
      dispatch({
        type: GET_RECEIVER_INFO,
        payload: {},
      });
    }

    axios(
      `https://barta-the-real-time-chat-app.herokuapp.com/groupAccount/groupInfo/${id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    ).then((data) => {
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
    });
  };
};

export const leaveFromGroup = (info) => {
  axios
    .put(
      "https://barta-the-real-time-chat-app.herokuapp.com/groupAccount/remove-group-member",
      info,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
    .catch(() => alert("Something is wrong. Please try again"));
};

export const addMemberInGroup = (data = {}) => {
  if (!data?._id) return;
  return (dispatch) => {
    dispatch({
      type: SET_ADD_MEMBER_ERROR_ICON,
      payload: false,
    });
    dispatch({
      type: SET_ADD_MEMBER_SPINNER,
      payload: true,
    });
    axios
      .put(
        "https://barta-the-real-time-chat-app.herokuapp.com/groupAccount/add-new-member",
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(() => {
        dispatch({
          type: SET_ADD_MEMBER_SPINNER,
          payload: false,
        });

        dispatch({
          type: SET_ADD_MEMBER_COMPLETE_ICON,
          payload: true,
        });

        setTimeout(() => {
          dispatch({
            type: SET_ADD_MEMBER_COMPLETE_ICON,
            payload: false,
          });
        }, 100);
      })
      .catch(() => {
        dispatch({
          type: SET_ADD_MEMBER_SPINNER,
          payload: false,
        });
        dispatch({
          type: SET_ADD_MEMBER_ERROR_ICON,
          payload: true,
        });
        setTimeout(() => {
          dispatch({
            type: SET_ADD_MEMBER_ERROR_ICON,
            payload: false,
          });
        }, 150);
        alert("Something is wrong. Please try again");
      });
  };
};

export const updateGroupListData = (data, groups, groupData, groupInfo) => {
  return (dispatch) => {
    const updatedGroup = { ...groupData, ...data.updatedData };
    const index = groups.findIndex((g) => g._id === data._id);
    groups.splice(index, 1, updatedGroup);

    dispatch({
      type: SET_GROUP_LIST_FROM_DATABASE,
      payload: groups,
    });

    if (!groupInfo?._id) return;
    if (groupInfo?._id !== data._id) return;
    const newData = { ...groupInfo, ...data.updatedData };
    dispatch({
      type: GET_GROUP_INFO,
      payload: newData,
    });
  };
};
