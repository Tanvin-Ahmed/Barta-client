import axios from "axios";
import {
  CHAT_ERROR,
  CHAT_UPLOAD_PERCENTAGE,
  GET_ONE_ONE_CHAT,
  GET_ONE_ONE_CHAT_FROM_SOCKET,
  IS_TYPE,
  SCREEN_SIZE,
} from "../types";

export const postOneOneChat = (chat) => {
  return (dispatch) => {
    const options = {
      onUploadProgress: ({ loaded, total }) => {
        let percent = Math.floor((loaded * 100) / total);

        if (percent < 100) {
          dispatch({
            type: CHAT_UPLOAD_PERCENTAGE,
            payload: percent,
          });
        }
      },
    };

    axios
      .post("http://localhost:5000/chatMessage/postOneOneChat", chat, options)
      .then((data) => {
        console.log("Data loaded successfully");
        dispatch({
          type: CHAT_UPLOAD_PERCENTAGE,
          payload: 100,
        });
        setTimeout(() => {
          dispatch({
            type: CHAT_UPLOAD_PERCENTAGE,
            payload: 0,
          });
        }, 50);
      })
      .catch((err) => {
        dispatch({
          type: CHAT_ERROR,
          payload: err.message,
        });
      });
  };
};

export const getOneOneChat = (roomId) => {
  return (dispatch) => {
    axios(`http://localhost:5000/chatMessage/getOneOneChat/${roomId}`)
      .then((chats) => {
        dispatch({
          type: GET_ONE_ONE_CHAT,
          payload: chats.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: CHAT_ERROR,
          payload: err.message,
        });
      });
  };
};

export const getOneOneChatFromSocket = (message) => {
  return {
    type: GET_ONE_ONE_CHAT_FROM_SOCKET,
    payload: message,
  };
};

export const getScreenSize = (size) => {
  return {
    type: SCREEN_SIZE,
    payload: size,
  };
};

export const isTyping = (typing) => {
  return {
    type: IS_TYPE,
    payload: typing,
  };
};
