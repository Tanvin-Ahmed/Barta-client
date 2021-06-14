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
} from "../types";

export const getUserInfo = () => {
  return async (dispatch) => {
    let userData = await localStorage.getItem("barta/user");
    userData = JSON?.parse(userData);

    dispatch({
      type: GET_USER_INFO,
      payload: userData,
    });
  };
};

export const getFriendInfo = (userEmail) => {
  return (dispatch) => {
    axios(`http://localhost:5000/user/account/${userEmail}`)
      .then((data) => {
        dispatch({
          type: GET_FRIEND_INFO,
          payload: data.data,
        });
      })
      .catch((error) => {
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
    axios
      .post("http://localhost:5000/user/account", user)
      .then((data) => {
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
  console.log(id);
  return (dispatch) => {
    axios(`http://localhost:5000/user/account/receiverInfo/${id}`)
      .then((data) => {
        console.log(data.data);
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
