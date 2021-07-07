import axios from "axios";
import {
  CHAT_ERROR,
  CHAT_UPLOAD_PERCENTAGE,
  CLICK_UPLOAD_OPTION,
  DELETE_CHAT_MESSAGE,
  GET_ONE_ONE_CHAT,
  GET_ONE_ONE_CHAT_FROM_SOCKET,
  IS_TYPE,
  OPEN_OPTIONS_FOR_CHAT,
  REACT_TAB_TOGGLE,
  SCREEN_SIZE,
  SELECTED_FILES,
  UPDATE_CHAT_REACT,
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

export const uploadFiles = (chosenFiles) => {
  // socket.emit("upload-files", chosenFiles);
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
      .post("http://localhost:5000/chatMessage/upload", chosenFiles, options)
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

export const updateChatMessage = (react) => {
  return (dispatch) => {
    axios
      .put("http://localhost:5000/chatMessage/updateChatMessage", react)
      .then(() => console.log("update message successfully"))
      .catch(() => alert("react not set, please try again"));
  };
};

const deleteChatMessage = (id) => {
  axios
    .delete(`http://localhost:5000/chatMessage/deleteChatMessage/${id}`)
    .then(() => console.log("deleted successfully"))
    .catch(() => alert("failed to delete, please try again"));
};

export const deleteChat = (message) => {
  return (dispatch) => {
    if (message?.files?.length > 0) {
      for (let i = 0; i < message?.files.length; i++) {
        const id = message?.files[i].fileId;
        axios
          .delete(`http://localhost:5000/chatMessage/file/delete/${id}`)
          .then(() => {
            console.log("delete file successfully");
            if (i === message?.files?.length - 1) {
              deleteChatMessage(message._id);
            }
          })
          .catch(() => alert("file not deleted, please try again"));
      }
    } else {
      deleteChatMessage(message?._id);
    }
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

export const isClickUploadOption = (payload) => {
  return {
    type: CLICK_UPLOAD_OPTION,
    payload,
  };
};

export const getChosenFiles = (payload) => {
  return {
    type: SELECTED_FILES,
    payload,
  };
};

export const openOptions = (payload) => {
  return {
    type: OPEN_OPTIONS_FOR_CHAT,
    payload,
  };
};

export const reactTabToggle = (payload) => {
  return {
    type: REACT_TAB_TOGGLE,
    payload,
  };
};

export const updateReactInChat = (chatMessage, update) => {
  return (dispatch) => {
    const message = chatMessage.find((message) => message?._id === update._id);
    if (message) {
      const updatedMessage = {
        ...message,
        ...update,
      };
      const index = chatMessage.findIndex(
        (message) => message?._id === update._id
      );
      chatMessage.splice(index, 1, updatedMessage);

      dispatch({
        type: UPDATE_CHAT_REACT,
        payload: chatMessage,
      });
    }
  };
};

export const deleteMessage = (chatMessage, deletedItemId) => {
  return (dispatch) => {
    const message = chatMessage.find(
      (message) => message._id === deletedItemId
    );
    if (message) {
      const index = chatMessage.findIndex(
        (message) => message._id === deletedItemId
      );
      chatMessage.splice(index, 1);
      dispatch({
        type: DELETE_CHAT_MESSAGE,
        payload: chatMessage,
      });
    }
  };
};
