import {
  getAllUserInfo,
  updateFriendStatus,
} from "../../app/actions/userAction";

export const isUserOnline = (user, friendList, dispatch) => {
  for (let i in friendList) {
    if (friendList[i].email === user?.email) {
      friendList[i].status = user?.status;
      if (user?.status === "inactive") {
        friendList[i].goOfLine = new Date().toUTCString();
      } else {
        friendList[i].goOfLine = "";
      }
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
