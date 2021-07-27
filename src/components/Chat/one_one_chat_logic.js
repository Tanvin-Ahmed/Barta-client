import {
  deleteChat,
  deleteMessage,
  deleteReact,
  getChosenFiles,
  getOneOneChatFromSocket,
  getScreenSize,
  isTyping,
  openOptions,
  postOneOneChat,
  reactTabToggle,
  setRoomId,
  updateChatMessage,
  updatePreReact,
  updateReactInChat,
  uploadFiles,
} from "../../app/actions/messageAction";
import {
  getReceiverInfo,
  postFriendInfo,
  updateChatList,
  updateChatStatus,
} from "../../app/actions/userAction";

export const screen = (dispatch) => {
  console.log(window.innerWidth);
  if (window.innerWidth > 768) {
    dispatch(getScreenSize(true));
  } else {
    dispatch(getScreenSize(false));
  }
};

export const getUsersData = async (dispatch, id) => {
  await dispatch(getReceiverInfo(id));
};

export const getRoomId = (dispatch) => {
  const sender = JSON.parse(localStorage.getItem("barta/user"))?.email?.split(
    "@"
  );
  const receiver = JSON.parse(
    sessionStorage.getItem("barta/receiver")
  )?.email?.split("@");
  const ascendingSort = [sender[0], receiver[0]].sort();
  const roomId = `${ascendingSort[0]}_${ascendingSort[1]}`;
  dispatch(setRoomId(roomId));
  return roomId;
};

export const handleIsType = (e, socket, senderEmail) => {
  if (e._reactName === "onFocus") {
    console.log("typing :", true);
    socket.emit("typing", {
      email: senderEmail,
      type: true,
    });
  } else if (e._reactName === "onBlur") {
    console.log("typing :", false);
    socket.emit("typing", {
      email: senderEmail,
      type: false,
    });
  }
};

export const handleIsFriendTyping = (socket, receiverEmail, dispatch) => {
  socket.once("displayTyping", (typingCondition) => {
    if (typingCondition?.email === receiverEmail) {
      dispatch(isTyping(typingCondition?.type));
    }
  });
};

let lastMessage = {};
export const getOneOneChatMessageFromSocket = (socket, dispatch) => {
  socket.once("one_one_chatMessage", (message) => {
    if (
      message.sender !== lastMessage?.sender ||
      (message.sender === lastMessage?.sender &&
        message.timeStamp !== lastMessage?.timeStamp)
    ) {
      lastMessage = {
        sender: message.sender,
        timeStamp: message.timeStamp,
      };
      dispatch(getOneOneChatFromSocket(message));
    }
  });
};

export const receiverStatusFromSocket = (socket, receiverInfo, dispatch) => {
  socket.once("user-status", (friendStatus) => {
    if (receiverInfo?.email && friendStatus?.email === receiverInfo?.email) {
      receiverInfo.status = friendStatus?.status;
      if (friendStatus?.status === "active") {
        receiverInfo.goOffLine = "";
      } else {
        receiverInfo.goOffLine = new Date().toUTCString();
      }
      dispatch(updateChatStatus(receiverInfo));
    }
  });
};

export const updateReact = (socket, dispatch, chatMessage) => {
  socket.once("update-react", (update) => {
    if (chatMessage.length > 0 || chatMessage[0]) {
      dispatch(updateReactInChat(chatMessage, update));
    }
  });
};

let deletedId = "";
export const deleteChatMessage = (socket, dispatch, chatMessage) => {
  socket.once("delete-chatMessage", (deletedItem) => {
    if (deletedId !== deletedItem._id) {
      deletedId = deletedItem._id;
      if (chatMessage.length > 0 || chatMessage[0])
        dispatch(deleteMessage(chatMessage, deletedItem._id));
    }
  });
};

export const handleOneOneChat = (
  roomId,
  addChatList,
  setInputText,
  inputText,
  senderEmail,
  receiverEmail,
  dispatch,
  chosenFiles
) => {
  if (chosenFiles[0]) {
    const data = new FormData();
    data.append("id", roomId);
    data.append("sender", senderEmail);

    for (let i = 0; i < chosenFiles.length; i++) {
      const element = chosenFiles[i]?.file;
      data.append("file", element);
    }
    data.append("timeStamp", new Date().toUTCString());

    // console.log(data);
    dispatch(uploadFiles(data));
    dispatch(getChosenFiles([]));
  } else {
    const chat = {
      id: roomId,
      sender: senderEmail,
      message: inputText,
      react: [],
      timeStamp: new Date().toUTCString(),
    };
    dispatch(postOneOneChat(chat));

    setInputText("");
  }
  !addChatList &&
    dispatch(
      postFriendInfo(roomId, {
        friendInfo: [
          {
            email: senderEmail,
            friendOf: receiverEmail?.split("@")[0],
          },
          {
            email: receiverEmail,
            friendOf: senderEmail?.split("@")[0],
          },
        ],
      })
    ) &&
    dispatch(updateChatList(true));
};

export const fileUpload = (e, dispatch) => {
  const newFiles = e.target.files;

  const files = [];
  for (let i = 0; i < newFiles.length; i++) {
    const element = newFiles[i];
    files.push({
      name: element.name,
      url: URL.createObjectURL(element),
      file: element,
    });
  }
  dispatch(getChosenFiles(files));
};

export const deleteChosenFiles = (chosenFiles, index, dispatch) => {
  chosenFiles.splice(index, 1);
  dispatch(getChosenFiles(chosenFiles));
};

export const options = (dispatch, bool, id) => {
  const open = {
    id,
    bool,
  };
  dispatch(openOptions(open));
};

export const toggleReactTab = (dispatch, toggle) => {
  dispatch(reactTabToggle(toggle));
};

export const handleReactions = (dispatch, message, sender, react) => {
  const preReact = message?.react?.find((r) => r.sender === sender);
  if (preReact) {
    if (preReact.react === react) {
      deleteReact({ id: message._id, sender });
    } else {
      updatePreReact({ id: message._id, sender, react });
    }
  } else {
    updateChatMessage({ id: message._id, reactInfo: { sender, react } });
  }
  toggleReactTab(dispatch, false);
};

export const handleDeleteMessage = (dispatch, message) => {
  dispatch(deleteChat(message));
};
