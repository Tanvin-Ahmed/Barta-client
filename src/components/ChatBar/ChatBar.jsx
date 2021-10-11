import React, { useEffect, useRef } from "react";
import "./ChatBar.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { isUserOnline } from "./chatBar_logic";
import {
  ChatBarHeader,
  ChatList,
  FinalProcessToCreateGroup,
  GroupList,
  SearchFriend,
  MakeNewFriendButton,
  MakeNewGroupButton,
  BottomNavigationBar,
} from "./chatBar_component";
import {
  clearGroupCreateSuccessfullyStatus,
  clearSelectedIdsForGroup,
  getFriendInfo,
  getFriendInfoFromSocket,
  getGroupIdForChatBar,
  setGroupsInfoFromDatabase,
} from "../../app/actions/userAction";
import { callReached } from "../Chat/PrivateCallSystem/callLogic";

const ChatBar = ({ socket }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    friendNotAvailable,
    users,
    friendList,
    error,
    loading,
    spinnerForChatList,
    friendListOpen,
    userInfo,
    accessToken,
    userStatusToReceiveOtherCall,
    openGroupList,
    spinnerForGroupList,
    groups,
    makeGroup,
    selectedIdsForGroup,
    finalStepToCreateGroup,
    groupName,
    groupCreated,
    groupCreatingSpinner,
  } = useSelector((state) => ({
    friendNotAvailable: state.userReducer.friendNotAvailable,
    users: state.userReducer.allUserInfo,
    friendList: state.userReducer.chatList,
    error: state.userReducer.error,
    loading: state.userReducer.loading,
    spinnerForChatList: state.userReducer.spinnerForChatList,
    friendListOpen: state.userReducer.friendListOpen,
    userInfo: state.userReducer.userInfo,
    accessToken: state.userReducer.accessToken,
    // private call
    userStatusToReceiveOtherCall:
      state.privateCall.userStatusToReceiveOtherCall,
    // group making tab
    openGroupList: state.userReducer.openGroupList,
    spinnerForGroupList: state.userReducer.spinnerForGroupList,
    groups: state.userReducer.groups,
    makeGroup: state.userReducer.makeGroup,
    selectedIdsForGroup: state.userReducer.selectedIdsForGroup,
    finalStepToCreateGroup: state.userReducer.finalStepToCreateGroup,
    groupName: state.userReducer.groupName,
    groupCreated: state.userReducer.groupCreated,
    groupCreatingSpinner: state.userReducer.groupCreatingSpinner,
  }));

  //////////////// Show Friend List or Group List /////////////
  const fetchGroupList = useRef(true);
  const fetchFriendList = useRef(true);
  useEffect(() => {
    const getData = () => {
      if (navigator.onLine) {
        friendListOpen &&
          fetchFriendList.current &&
          dispatch(getFriendInfo(userInfo?.email));
        openGroupList &&
          fetchGroupList.current &&
          dispatch(setGroupsInfoFromDatabase(userInfo?.email));

        if (friendListOpen) fetchFriendList.current = false;
        if (openGroupList) fetchGroupList.current = false;
      }
    };
    const conditionOfNetwork = () => {
      fetchFriendList.current = true;
      fetchGroupList.current = true;
      accessToken && getData();
    };
    const webpageLoad = () => {
      window.addEventListener("online", conditionOfNetwork);
      window.addEventListener("offline", conditionOfNetwork);
    };
    window.addEventListener("load", webpageLoad);
    accessToken && getData();

    return () => {
      window.removeEventListener("load", webpageLoad);
      window.removeEventListener("online", conditionOfNetwork);
      window.removeEventListener("offline", conditionOfNetwork);
    };
  }, [userInfo?.email, dispatch, friendListOpen, openGroupList, accessToken]);

  //////////////// Friend List Update ///////////////
  useEffect(() => {
    if (socket === null) return;
    socket.on("add-friend-list", (friendEmail) => {
      dispatch(getFriendInfoFromSocket(friendEmail));
    });
    return () => socket.off("add-friend-list");
  }, [socket, dispatch]);

  //////////////// Group List Update ///////////////
  useEffect(() => {
    if (socket === null) return;
    socket.on("add-group-list", (groupInfo) => {
      if (groupInfo.member === userInfo?.email?.split("@")[0]) {
        dispatch(getGroupIdForChatBar(groupInfo.groupId, "chatBar"));
      }
    });
    return () => socket.off("add-group-list");
  }, [socket, dispatch, userInfo]);

  //////////////// Update friend Status ///////////////////
  useEffect(() => {
    if (socket === null && !friendList.length) return;
    socket.on("user-status", (user) => {
      isUserOnline(user, friendList, dispatch);
    });
    return () => socket.off("user-status");
  }, [socket, dispatch, friendList]);

  ///////////////////// User Notify Private Call //////////////////
  useEffect(() => {
    if (socket === null) return;
    socket.on("callUser", (data) => {
      if (data.userToCall === userInfo.email) {
        callReached(
          data,
          dispatch,
          socket,
          history,
          userStatusToReceiveOtherCall
        );
      }
    });
    return () => socket.off("callUser");
  }, [
    dispatch,
    socket,
    userInfo,
    friendList,
    history,
    userStatusToReceiveOtherCall,
  ]);

  ///////// CLEAR ALL THING TO CREATING GROUP AFTER CREATED GROUP /////////
  useEffect(() => {
    let setTime;
    if (groupCreated) {
      setTime = setTimeout(() => {
        dispatch(clearSelectedIdsForGroup());
        dispatch(clearGroupCreateSuccessfullyStatus());
      }, 150);
    } else {
      clearTimeout(setTime);
    }
  }, [groupCreated, dispatch]);

  return (
    <section className="chat__bar">
      <ChatBarHeader
        userPhotoURL={userInfo?.photoURL}
        photoId={userInfo?.photoId}
      />
      <div className="list__body">
        {friendListOpen && !makeGroup && !openGroupList && (
          <>
            <ChatList
              friendList={friendList}
              history={history}
              spinnerForChatList={spinnerForChatList}
              friendNotAvailable={friendNotAvailable}
            />
          </>
        )}
        {!friendListOpen && !makeGroup && openGroupList && (
          <>
            <GroupList
              groups={groups}
              history={history}
              spinnerForGroupList={spinnerForGroupList}
            />
          </>
        )}
        {((!friendListOpen && !makeGroup && !openGroupList) ||
          (!friendListOpen && makeGroup && !finalStepToCreateGroup)) && (
          <SearchFriend
            userEmail={userInfo?.email}
            users={users}
            loading={loading}
            history={history}
            dispatch={dispatch}
            makeGroup={makeGroup}
            selectedIdsForGroup={selectedIdsForGroup}
            groupCreated={groupCreated}
            groupCreatingSpinner={groupCreatingSpinner}
          />
        )}
        {!friendListOpen && makeGroup && finalStepToCreateGroup && (
          <FinalProcessToCreateGroup
            dispatch={dispatch}
            selectedIdsForGroup={selectedIdsForGroup}
            userInfo={userInfo}
            groupName={groupName}
          />
        )}
      </div>
      <BottomNavigationBar dispatch={dispatch} />
    </section>
  );
};

export default ChatBar;
