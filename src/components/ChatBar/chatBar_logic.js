import {
  getAllUserInfo,
  getFriendInfoFromSocket,
} from "../../app/actions/userAction";

let email = "";
export const friendListUpdate = (socket, dispatch) => {
  socket.once("add-friend-list", (friendEmail) => {
    if (friendEmail?.email !== email) {
      email = friendEmail?.email;
      dispatch(getFriendInfoFromSocket(friendEmail?.email));
    }
  });
};

let friendEmail = "";
export const updateFriendStatus = (socket, friendList, dispatch) => {
  socket.once("user-status", (user) => {
    if (friendList[0]) {
      if (user?.email && user.email !== friendEmail) {
        friendEmail = user?.email;
        isUserOnline(user, friendList, dispatch);
      }
    }
    setTimeout(() => {
      friendEmail = "";
    }, 50);
  });
};

const isUserOnline = (user, friendList, dispatch) => {
  for (let i in friendList) {
    if (friendList[i].email === user?.email) {
      friendList[i].status = user?.status;
      if (user?.status === "inactive") {
        friendList[i].goOfLine = new Date().toUTCString();
      } else {
        friendList[i].goOfLine = "";
      }
      break;
    }
  }
  dispatch(updateFriendStatus(friendList));
};

export const handleSearchForFriend = (e, userEmail, dispatch) => {
  e.preventDefault();
  dispatch(getAllUserInfo(e.target.value, userEmail));
};

export const handleReceiverInfo = (receiver, history) => {
  sessionStorage.setItem(
    "barta/receiver",
    JSON.stringify({ email: receiver.email })
  );
  history.push(`/chat/${receiver._id}`);
};
