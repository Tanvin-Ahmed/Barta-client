import {
  createGroup,
  getAllUserInfo,
  setFinalStepToCreateGroup,
  setOpenGroupList,
  setOpenGroupMakingTab,
  setSelectedIdInfo,
  setFriendListTapOpen,
  updatedSelectedIdList,
  updateFriendStatus,
} from "../../app/actions/userAction";

export const openFriendListTab = (dispatch) => {
  dispatch(setFriendListTapOpen(true));
  dispatch(setOpenGroupMakingTab(false));
  dispatch(setOpenGroupList(false));
};

export const openSearchToMakeFriendTab = (dispatch) => {
  dispatch(setFriendListTapOpen(false));
  dispatch(setOpenGroupMakingTab(false));
};

export const openGroupMakingTab = (dispatch) => {
  dispatch(setFriendListTapOpen(false));
  dispatch(setOpenGroupMakingTab(true));
  dispatch(setOpenGroupList(false));
};

export const openGroupListTab = (dispatch) => {
  dispatch(setFriendListTapOpen(false));
  dispatch(setOpenGroupMakingTab(false));
  dispatch(setOpenGroupList(true));
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
  sessionStorage.removeItem("barta/groupName");
  sessionStorage.setItem(
    "barta/receiver",
    JSON.stringify({ email: receiver.email })
  );
  history.push(`/chat/${receiver._id}`);
};

export const handleGroupInfo = (group, history) => {
  sessionStorage.removeItem("barta/receiver");
  sessionStorage.setItem(
    "barta/groupName",
    JSON.stringify({ groupName: group?.groupName })
  );
  history.push(`/chat/${group._id}`);
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
        email: otherUser.email,
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

export const createGroupForFirst = (
  selectedIdInfo,
  userInfo,
  groupName,
  dispatch
) => {
  if (groupName.trim() === "") return alert("Group name is required");

  const GroupPeopleInfo = [userInfo, ...selectedIdInfo];
  let selectedUsersEmail = [];
  for (let i = 0; i < GroupPeopleInfo.length; i++) {
    const user = GroupPeopleInfo[i];
    selectedUsersEmail.push(user.email);
  }

  dispatch(createGroup(selectedUsersEmail, groupName));
  dispatch(setFinalStepToCreateGroup(false));
};
