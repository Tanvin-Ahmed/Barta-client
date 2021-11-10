import axios from "axios";
import {
  CHAT_ERROR,
  CHAT_UPLOAD_PERCENTAGE,
  DELETE_CHAT_MESSAGE,
  GET_MESSAGE_SPINNER,
  GET_MESSAGES_FROM_DB,
  GET_NEW_MESSAGE_FROM_SOCKET,
  IS_TYPE,
  OPEN_OPTIONS_FOR_CHAT,
  REACT_TAB_TOGGLE,
  REFETCH_MESSAGE,
  SCREEN_SIZE,
  SELECTED_FILES,
  SET_ROOM_ID,
  UPDATE_CHAT_REACT,
  GET_OLD_MESSAGES_FROM_DB,
  GET_FRIEND_INFO,
  SET_GROUP_LIST_FROM_DATABASE,
  SET_WEBCAM_OPEN,
} from "../types";
import FileServer from "file-saver";
import path from "path";
import jwt_decode from "jwt-decode";

export const sendMessageInDatabase = (chat) => {
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
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
      },
    };

    let URL;
    if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
      URL = "http://localhost:5000/groupChat/messages/post";
    } else {
      URL = "http://localhost:5000/chatMessage/postOneOneChat";
    }

    axios
      .post(URL, chat, options)
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
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
      },
    };

    let destination;
    if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
      destination = "groupChat";
    } else {
      destination = "chatMessage";
    }

    axios
      .post(`http://localhost:5000/${destination}/upload`, chosenFiles, options)
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
        if (err.response.status === 400) {
          const msg = err.response.data;
          alert(msg);
        } else if (err.response.status === 500) {
          alert("file not uploaded, please try again");
        }
        dispatch({
          type: CHAT_ERROR,
          payload: err.message,
        });
      });
  };
};

export const getMessagesFromDatabase = (data, oldMessage = false) => {
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
    if (!oldMessage) {
      dispatch({
        type: GET_MESSAGES_FROM_DB,
        payload: [],
      });
    }
    dispatch({
      type: GET_MESSAGE_SPINNER,
      payload: true,
    });

    let URL;
    if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
      URL = `http://localhost:5000/groupChat/messages/${data?.roomId}`;
    } else {
      URL = `http://localhost:5000/chatMessage/getOneOneChat/${data?.roomId}`;
    }

    axios
      .post(
        URL,
        {
          pageNum: data?.pageNum,
        },
        {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
          },
        }
        // options
      )
      .then((data) => {
        dispatch({
          type: GET_MESSAGE_SPINNER,
          payload: false,
        });
        // data
        const chat = data?.data?.reverse();
        if (oldMessage) {
          dispatch({
            type: GET_OLD_MESSAGES_FROM_DB,
            payload: chat,
          });
        } else {
          dispatch({
            type: GET_MESSAGES_FROM_DB,
            payload: chat,
          });
        }

        if (chat?.length === 35) {
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
        const { email } = jwt_decode(
          JSON.parse(localStorage.getItem("accessToken"))
        );
        let needUpdateStatus = data.data.map(({ _id, status, sender }) => {
          if (status === "unseen" && sender !== email) {
            return _id;
          }
          return null;
        });
        needUpdateStatus = needUpdateStatus.filter((id) => id);
        if (needUpdateStatus.length > 0) {
          updateMessageStatus(needUpdateStatus);
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
  let destination;
  if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
    destination = "groupChat";
  } else {
    destination = "chatMessage";
  }
  axios({
    method: "GET",
    url: `http://localhost:5000/${destination}/file/${filename}`,
    responseType: "blob",
  })
    .then(({ data }) => {
      FileServer.saveAs(
        data,
        filename?.split("_")?.join(" ")?.split("◉ ◉")[0] +
          path.extname(filename)
      );
    })
    .catch((err) => alert(err.message));
};

export const updateChatMessage = (react) => {
  let destination;
  if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
    destination = "groupChat";
  } else {
    destination = "chatMessage";
  }
  axios
    .put(`http://localhost:5000/${destination}/updateChatMessage`, react, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
      },
    })
    .then(() => console.log("update message successfully"))
    .catch(() => alert("react not set, please try again"));
};

export const updatePreReact = (react) => {
  let destination;
  if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
    destination = "groupChat";
  } else {
    destination = "chatMessage";
  }
  axios
    .put(`http://localhost:5000/${destination}/updateOnlyReact`, react, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
      },
    })
    .then(() => console.log("update message successfully"))
    .catch(() => alert("react not set, please try again"));
};

export const deleteReact = (react) => {
  let destination;
  if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
    destination = "groupChat";
  } else {
    destination = "chatMessage";
  }
  axios
    .put(`http://localhost:5000/${destination}/removeReact`, react, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
      },
    })
    .then(() => console.log("update message successfully"))
    .catch(() => alert("react not remove, please try again"));
};

const deleteChatMessage = (id) => {
  let destination;
  if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
    destination = "groupChat";
  } else {
    destination = "chatMessage";
  }
  axios
    .delete(`http://localhost:5000/${destination}/deleteChatMessage/${id}`, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
      },
    })
    .then(() => console.log("deleted successfully"))
    .catch(() => alert("failed to delete, please try again"));
};

export const deleteChat = (message) => {
  let destination;
  if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
    destination = "groupChat";
  } else {
    destination = "chatMessage";
  }
  if (message?.files?.length > 0) {
    for (let i = 0; i < message?.files.length; i++) {
      const id = message?.files[i].fileId;
      axios
        .delete(`http://localhost:5000/${destination}/file/delete/${id}`, {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
          },
        })
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

export const getNewMessageFromSocket = (message) => {
  return {
    type: GET_NEW_MESSAGE_FROM_SOCKET,
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
    const message = chatMessage.find((message) => message?._id === update?._id);
    if (message) {
      let updatedMessage = {};
      if (update?.react?.length >= 0) {
        updatedMessage = {
          ...message,
          ...update,
        };
      } else {
        const key = Object.keys(update?.react)[0];
        const indexOfReact = parseInt(key?.split(".")[1]);
        message.react[indexOfReact].react = update?.react[key];
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

export const updateMessageStatus = (ids) => {
  let destination;
  if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
    destination = "groupChat";
  } else {
    destination = "chatMessage";
  }
  axios
    .post(`http://localhost:5000/${destination}/unseen-message-to-seen`, ids, {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
    })
    .catch((err) => console.log(err.response));
};

export const messageWithUpdatedStatus = (data, chatMessage) => {
  return (dispatch) => {
    const index = chatMessage.findIndex(({ _id }) => _id === data?._id);
    if (index !== -1) {
      const msg = chatMessage.find(({ _id }) => _id === data?._id);
      const newMessage = { ...msg, status: data?.status };
      chatMessage.splice(index, 1, newMessage);
      dispatch({
        type: GET_MESSAGES_FROM_DB,
        payload: chatMessage,
      });
    }
  };
};

export const setMessage = (message) => {
  return {
    type: GET_NEW_MESSAGE_FROM_SOCKET,
    payload: message,
  };
};

export const setSendedMessage = (chatMessage, sendedMessage) => {
  return (dispatch) => {
    const index = chatMessage.findIndex(
      ({ timeStamp }) => timeStamp === sendedMessage.timeStamp
    );
    chatMessage.splice(index, 1, sendedMessage);
    dispatch({
      type: GET_MESSAGES_FROM_DB,
      payload: chatMessage,
    });
  };
};

export const updateChatBarMessage = (
  newMessage,
  chatList,
  userEmail,
  groups
) => {
  return (dispatch) => {
    groups.forEach((group) => {
      if (group?._id === newMessage?.id) {
        group.lastMessage = newMessage;
        return dispatch({
          type: SET_GROUP_LIST_FROM_DATABASE,
          payload: groups,
        });
      }
    });
    // friend list
    chatList.forEach((friend) => {
      const arr = [
        userEmail?.split("@")[0],
        friend?.email?.split("@")[0],
      ].sort();
      const roomId = `${arr[0]}_${arr[1]}`;

      if (newMessage?.id === roomId) {
        friend.lastMessage = newMessage;
        return dispatch({
          type: GET_FRIEND_INFO,
          payload: chatList,
        });
      }
    });
  };
};

export const deleteMessageFromChatBar = (id, chatList, groups) => {
  return (dispatch) => {
    groups.forEach((group) => {
      if (group?.lastMessage?._id === id) {
        axios(
          `http://localhost:5000/groupChat/get-lastMessage-for-chatBar/${group?._id}`,
          {
            headers: {
              Authorization:
                "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
            },
          }
        ).then(({ data }) => {
          group.lastMessage = data;
          dispatch({
            type: SET_GROUP_LIST_FROM_DATABASE,
            payload: groups,
          });
        });
        return;
      }
    });

    chatList.forEach((friend) => {
      if (friend.lastMessage?._id === id) {
        axios(
          `http://localhost:5000/chatMessage/get-lastMessage-for-chatBar/${friend?.lastMessage?.id}`,
          {
            headers: {
              Authorization:
                "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
            },
          }
        ).then(({ data }) => {
          friend.lastMessage = data;
          dispatch({
            type: GET_FRIEND_INFO,
            payload: chatList,
          });
        });
        return;
      }
    });
  };
};

export const deleteConversation = (roomId, setLoading, setMessage) => {
  setLoading(true);
  setMessage({});
  let destination = "";
  if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
    destination = "groupChat";
  } else {
    destination = "chatMessage";
  }
  axios
    .delete(
      `http://localhost:5000/${destination}/delete-conversation/${roomId}`,
      {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
        },
      }
    )
    .then(() => {
      setLoading(false);
      setMessage({
        message: "Delete Conversation successfully!!",
        status: "ok",
      });
    })
    .catch(() => {
      setLoading(false);
      setMessage({
        message: "Something went wrong, please try again!",
        status: "error",
      });
    });
};

export const setWebcamOpen = (bool) => {
  return {
    type: SET_WEBCAM_OPEN,
    payload: bool,
  };
};
