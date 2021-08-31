import axios from "axios";
import {
  CHAT_ERROR,
  CHAT_UPLOAD_PERCENTAGE,
  CLICK_UPLOAD_OPTION,
  DELETE_CHAT_MESSAGE,
  GET_GROUP_CHAT,
  GET_MESSAGE_SPINNER,
  GET_ONE_ONE_CHAT,
  GET_ONE_ONE_CHAT_FROM_SOCKET,
  IS_TYPE,
  OPEN_OPTIONS_FOR_CHAT,
  REACT_TAB_TOGGLE,
  REFETCH_MESSAGE,
  SCREEN_SIZE,
  SELECTED_FILES,
  SET_ROOM_ID,
  UPDATE_CHAT_REACT,
} from "../types";
import FileServer from "file-saver";

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
      .then(() => {
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
      .then(() => {
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

export const getOneOneChat = (data) => {
  return (dispatch) => {
    dispatch({
      type: GET_ONE_ONE_CHAT,
      payload: [],
    });
    dispatch({
      type: GET_MESSAGE_SPINNER,
      payload: true,
    });
    axios
      .post(`http://localhost:5000/chatMessage/getOneOneChat/${data?.roomId}`, {
        pageNum: data?.pageNum,
      })
      .then((data) => {
        dispatch({
          type: GET_MESSAGE_SPINNER,
          payload: false,
        });
        // data
        const chat = data?.data?.reverse();
        dispatch({
          type: GET_ONE_ONE_CHAT,
          payload: chat,
        });

        if (chat?.length === 9) {
          dispatch({
            type: REFETCH_MESSAGE,
            payload: true,
          });
        } else {
          dispatch({
            type: REFETCH_MESSAGE,
            payload: false,
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: GET_MESSAGE_SPINNER,
          payload: false,
        });
        dispatch({
          type: CHAT_ERROR,
          payload: err.message,
        });
      });
  };
};

export const stopReFetchMessage = () => {
  return {
    type: REFETCH_MESSAGE,
    payload: false,
  };
};

export const download = (filename) => {
  axios({
    method: "GET",
    url: `http://localhost:5000/chatMessage/file/${filename}`,
    responseType: "blob",
  })
    .then((response) => {
      console.log(response.data);
      FileServer.saveAs(response.data, filename);
    })
    .catch((err) => alert("file is not saved, please try again."));
};

export const updateChatMessage = (react) => {
  axios
    .put("http://localhost:5000/chatMessage/updateChatMessage", react)
    .then(() => console.log("update message successfully"))
    .catch(() => alert("react not set, please try again"));
};

export const updatePreReact = (react) => {
  axios
    .put("http://localhost:5000/chatMessage/updateOnlyReact", react)
    .then(() => console.log("update message successfully"))
    .catch(() => alert("react not set, please try again"));
};

export const deleteReact = (react) => {
  axios
    .put("http://localhost:5000/chatMessage/removeReact", react)
    .then(() => console.log("update message successfully"))
    .catch(() => alert("react not remove, please try again"));
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
      let updatedMessage = {};
      if (update?.react?.length >= 0) {
        updatedMessage = {
          ...message,
          ...update,
        };
      } else {
        const key = Object.keys(update.react)[0];
        const indexOfReact = parseInt(key.split(".")[1]);
        message.react[indexOfReact].react = update.react[key];
        updatedMessage = { ...message };
      }
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

export const setRoomId = (id) => {
  return {
    type: SET_ROOM_ID,
    payload: id,
  };
};

// group message
export const getGroupMessage = (data) => {
  return (dispatch) => {
    // const options = {
    //   onDownloadProgress: ({ loaded, total }) => {
    //     let percent = Math.floor((loaded * 100) / total);
    //     if (percent < 100) {
    //       dispatch({
    //         type: GET_MESSAGE_PROGRESS,
    //         payload: percent,
    //       });
    //     }
    //   },
    // };
    dispatch({
      type: GET_ONE_ONE_CHAT,
      payload: [],
    });
    dispatch({
      type: GET_MESSAGE_SPINNER,
      payload: true,
    });
    axios
      .post(
        `http://localhost:5000/groupChat/messages/${data?.roomId}`,
        {
          pageNum: data?.pageNum,
        }
        // options
      )
      .then((data) => {
        // progress
        dispatch({
          type: GET_MESSAGE_SPINNER,
          payload: false,
        });
        // data
        const chat = data?.data?.reverse();
        dispatch({
          type: GET_ONE_ONE_CHAT,
          payload: chat,
        });

        if (chat?.length === 9) {
          dispatch({
            type: REFETCH_MESSAGE,
            payload: true,
          });
        } else {
          dispatch({
            type: REFETCH_MESSAGE,
            payload: false,
          });
          // }
        }
      })
      .catch((err) => {
        dispatch({
          type: CHAT_ERROR,
          payload: err.message,
        });
        dispatch({
          type: GET_MESSAGE_SPINNER,
          payload: false,
        });
      });
  };
};
