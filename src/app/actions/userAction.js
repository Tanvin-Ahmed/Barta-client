import axios from "axios";
import {
  ADD_CHAT_LIST,
  ERROR_USER_INFO,
  GET_ALL_USER_INFO,
  GET_FRIEND_INFO,
  LOADING_USER_INFO,
  POST_USER_INFO,
} from "../types";

export const getFriendInfo = (userEmail) => {
  return (dispatch) => {
    axios(`http://localhost:5000/user/account/${userEmail}`)
      .then((data) => {
        dispatch({
          type: GET_FRIEND_INFO,
          payload: data.data?.chatList,
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
            email: friend.email,
            displayName: friend.displayName,
            photoURL: friend.photoURL,
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

export const getAllUserInfo = (searchString, userEmail) => {
  return (dispatch) => {
    dispatch({
      type: LOADING_USER_INFO,
      payload: true,
    });
    axios(`http://localhost:5000/user/account/allAccount/${searchString}`)
      .then((data) => {
        dispatch({
          type: GET_ALL_USER_INFO,
          payload: data.data,
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
          payload: error.message,
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
