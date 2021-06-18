import {
  getOneOneChatFromSocket,
  getScreenSize,
  isTyping,
  postOneOneChat,
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

export const getRoomId = () => {
  const sender = JSON.parse(localStorage.getItem("barta/user"))?.email?.split(
    "@"
  );
  const receiver = JSON.parse(
    sessionStorage.getItem("barta/receiver")
  )?.email?.split("@");
  const ascendingSort = [sender[0], receiver[0]].sort();
  return `${ascendingSort[0]}_${ascendingSort[1]}`;
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
  socket.on("displayTyping", (typingCondition) => {
    if (typingCondition?.email === receiverEmail) {
      dispatch(isTyping(typingCondition?.type));
    }
  });
};

let lastMessage = {};
export const getOneOneChatMessageFromSocket = (socket, dispatch) => {
  socket.on("one_one_chatMessage", (message) => {
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
  socket.on("user-status", (friendStatus) => {
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

export const handleOneOneChat = (
  roomId,
  addChatList,
  setInputText,
  inputText,
  senderEmail,
  receiverEmail,
  dispatch
) => {
  const chat = {
    id: roomId,
    sender: senderEmail,
    message: inputText,
    timeStamp: new Date().toUTCString(),
  };
  dispatch(postOneOneChat(chat));

  setInputText("");
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