import {
  getAllUserInfo,
  setOpenGroupMakingTab,
  setSelectedIdInfo,
  updateChatList,
  updatedSelectedIdList,
  updateFriendStatus,
} from "../../app/actions/userAction";

export const openFriendListTab = (dispatch) => {
  dispatch(updateChatList(true));
  dispatch(setOpenGroupMakingTab(false));
};

export const openSearchToMakeFriendTab = (dispatch) => {
  dispatch(updateChatList(false));
  dispatch(setOpenGroupMakingTab(false));
};

export const openGroupMakingTab = (dispatch) => {
  dispatch(updateChatList(false));
  dispatch(setOpenGroupMakingTab(true));
};

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

// group making tab
export const addIdToCreateGroup = (
  dispatch,
  otherUser,
  selectedIdsForGroup
) => {
  let selected;

  if (selectedIdsForGroup.length > 0) {
    selected = selectedIdsForGroup?.find(
      (selectedUser) => selectedUser?.id === otherUser._id
    );
  }
  if (!selected) {
    dispatch(
      setSelectedIdInfo({
        id: otherUser._id,
        photoURL: otherUser?.photoURL,
      })
    );
  }
};

export const deleteIdFromSelectedId = (dispatch, id, selectedIdsForGroup) => {
  const updatedSelectedId = selectedIdsForGroup?.filter(
    (selectedId) => selectedId.id !== id
  );
  dispatch(updatedSelectedIdList(updatedSelectedId));
};
