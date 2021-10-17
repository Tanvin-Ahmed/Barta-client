import React, { useEffect } from "react";
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
  BottomNavigationBar,
} from "./chatBar_component";
import {
  clearGroupCreateSuccessfullyStatus,
  clearSelectedIdsForGroup,
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
    largeScreen,
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
    largeScreen: state.messageReducer.largeScreen,
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
    <>
      <section className="chat__bar">
        <ChatBarHeader
          userPhotoURL={userInfo?.photoURL}
          photoId={userInfo?.photoId}
          name={userInfo?.displayName}
        />
        <div className="list__body">
          {friendListOpen && !makeGroup && !openGroupList && (
            <>
              <ChatList
                friendList={friendList}
                history={history}
                spinnerForChatList={spinnerForChatList}
                friendNotAvailable={friendNotAvailable}
                largeScreen={largeScreen}
                userInfo={userInfo}
              />
            </>
          )}
          {!friendListOpen && !makeGroup && openGroupList && (
            <>
              <GroupList
                groups={groups}
                history={history}
                spinnerForGroupList={spinnerForGroupList}
                largeScreen={largeScreen}
                userInfo={userInfo}
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
    </>
  );
};

export default ChatBar;
