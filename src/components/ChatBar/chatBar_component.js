import "./ChatBar.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PeopleIcon from "@material-ui/icons/People";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { Avatar, Button, CardActionArea, IconButton } from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import {
  addIdToCreateGroup,
  createGroupForFirst,
  deleteIdFromSelectedId,
  handleGroupInfo,
  handleReceiverInfo,
  handleSearchForFriend,
  openFriendListTab,
  openGroupListTab,
  openGroupMakingTab,
  openSearchToMakeFriendTab,
} from "./chatBar_logic";
import { Spinner } from "react-bootstrap";
import {
  setFinalStepToCreateGroup,
  setGroupName,
} from "../../app/actions/userAction";
import { useState } from "react";

export const ChatBarHeader = ({
  userPhotoURL,
  dispatch,
  chatList,
  openGroupList,
}) => {
  return (
    <div className="chatBar__header">
      <div className="text__center">
        <h3 className="text-center text-light">Barta</h3>
      </div>
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <div className="avatar">
          <IconButton style={{ position: "relative" }}>
            <Avatar src={userPhotoURL} />
            <div className="onLine" />
          </IconButton>
        </div>
        <div className="more__options">
          <IconButton>
            <MoreVertIcon className="text-light" size="small" />
          </IconButton>
        </div>
      </div>
      <div className="add__friend mt-2 d-flex justify-content-around align-items-center flex-wrap">
        <div title="Friend list">
          <CardActionArea
            className={chatList && "listTab__open"}
            style={{ padding: "0.6rem", borderRadius: "50%" }}
            onClick={() => openFriendListTab(dispatch)}
          >
            <PersonOutlineIcon className="text-light" size="small" />
          </CardActionArea>
        </div>
        <div title="Group list">
          <CardActionArea
            className={openGroupList && "listTab__open"}
            style={{ padding: "0.6rem", borderRadius: "50%" }}
            onClick={() => openGroupListTab(dispatch)}
          >
            <PeopleIcon className="text-light" size="small" />
          </CardActionArea>
        </div>
      </div>
    </div>
  );
};

export const ChatList = ({
  friendList,
  history,
  dispatch,
  spinnerForChatList,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="friendList__container">
      <div className="find__friend mt-3 sticky-top">
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Find Friend"
        />
      </div>
      <div className="friend__list mt-2">
        {spinnerForChatList ? (
          <div className="chatBar__progress">
            <CircularProgress style={{ color: "rgb(18, 3, 45)" }} />
          </div>
        ) : (
          friendList
            ?.filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.displayName.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return val;
              }
            })
            ?.map((friend) => (
              <CardActionArea
                key={friend?._id}
                onClick={() => handleReceiverInfo(friend, history)}
                className="px-3 d-flex justify-content-start align-items-center text-light"
              >
                <div style={{ position: "relative" }} className="mr-3">
                  <Avatar src={friend?.photoURL} />
                  <div
                    className={
                      friend?.status === "active" ? "onLine" : "d-none"
                    }
                  />
                </div>
                <h6 style={{ letterSpacing: "1px" }} className="m-4">
                  {friend?.displayName}
                </h6>
              </CardActionArea>
            ))
        )}
      </div>
      <div title="Make new friend" className="make__newFriend__button">
        <CardActionArea
          style={{
            padding: "0.6rem",
            borderRadius: "50%",
            backgroundColor: "rgb(7, 17, 63)",
          }}
          onClick={() => openSearchToMakeFriendTab(dispatch)}
        >
          <PersonAddIcon className="text-light" size="small" />
        </CardActionArea>
      </div>
    </div>
  );
};

export const GroupList = ({
  groups,
  history,
  dispatch,
  spinnerForGroupList,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="friendList__container">
      <div className="find__friend mt-3 sticky-top">
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Find Group"
        />
      </div>
      <div className="friend__list mt-2">
        {spinnerForGroupList ? (
          <div className="chatBar__progress">
            <CircularProgress style={{ color: "rgb(18, 3, 45)" }} />
          </div>
        ) : groups.length === 0 ? (
          <h3 className="group_not_available">Create new Group</h3>
        ) : (
          groups
            ?.filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.groupName.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return val;
              }
            })
            ?.map((group) => (
              <CardActionArea
                key={group?._id}
                onClick={() => handleGroupInfo(group?.groupName, history)}
                className="px-3 d-flex justify-content-start align-items-center text-light"
              >
                <div style={{ position: "relative" }} className="mr-3">
                  <Avatar src={group?.photoURL} />
                  <div
                    className={group?.status === "active" ? "onLine" : "d-none"}
                  />
                </div>
                <h6 style={{ letterSpacing: "1px" }} className="m-4">
                  {group?.groupName?.split("◉_◉")[0]}
                </h6>
              </CardActionArea>
            ))
        )}
      </div>
      <div title="Make new Group" className="make__newFriend__button">
        <CardActionArea
          style={{
            padding: "0.6rem",
            borderRadius: "50%",
            backgroundColor: "rgb(7, 17, 63)",
          }}
          onClick={() => openGroupMakingTab(dispatch)}
        >
          <GroupAddIcon className="text-light" size="small" />
        </CardActionArea>
      </div>
    </div>
  );
};

export const SearchFriend = ({
  userEmail,
  users,
  loading,
  history,
  dispatch,
  makeGroup,
  selectedIdsForGroup,
  groupCreated,
  groupCreatingSpinner,
}) => {
  return (
    <>
      <div className="find__users mt-2 sticky-top">
        <input
          onChange={(e) => handleSearchForFriend(e, userEmail, dispatch)}
          type="text"
          className="form-control"
          placeholder="Add new Friend"
        />
      </div>
      <div className="my-1" />
      {makeGroup && selectedIdsForGroup.length > 0 && (
        <div className="selectedId__section rounded">
          <div className="selectedId__container">
            {selectedIdsForGroup?.map((selectedId) => (
              <div key={selectedId.id} className="selected_id">
                <HighlightOffIcon
                  onClick={() =>
                    deleteIdFromSelectedId(
                      dispatch,
                      selectedId?.id,
                      selectedIdsForGroup
                    )
                  }
                  className="times_for_selectedId"
                  size="small"
                />
                <Avatar src={selectedId?.photoURL} />
              </div>
            ))}
          </div>
          {selectedIdsForGroup.length >= 2 && (
            <div className="d-flex justify-content-center align-items-center">
              <Button
                onClick={() => dispatch(setFinalStepToCreateGroup(true))}
                style={{ background: "#fff", color: "rgb(69, 139, 219)" }}
                variant="contained"
                size="small"
              >
                <span style={{ fontWeight: "bold" }}>
                  {groupCreated ? "Created" : "Create"}
                </span>{" "}
                &nbsp;
                {!groupCreatingSpinner && !groupCreated && (
                  <AddCircleOutlineIcon size={12} />
                )}
                &nbsp;
                {groupCreatingSpinner && <CircularProgress size={12} />}
                {groupCreated && <CheckCircleOutlineIcon size={10} />}
              </Button>
            </div>
          )}
        </div>
      )}
      <div className="users__list mt-2">
        {loading ? (
          <div className="loadingSpinner">
            <Spinner animation="grow" variant="warning" />
          </div>
        ) : (
          users.length > 0 &&
          users?.map((otherUser) => {
            if (otherUser.email !== userEmail) {
              return (
                <CardActionArea
                  key={otherUser._id}
                  onClick={() => {
                    !makeGroup
                      ? handleReceiverInfo(otherUser, history)
                      : addIdToCreateGroup(
                          dispatch,
                          otherUser,
                          selectedIdsForGroup
                        );
                  }}
                  className="px-3 d-flex justify-content-start align-items-center text-light"
                >
                  <div className="mr-3">
                    <Avatar src={otherUser?.photoURL} />
                  </div>
                  <h6 className="m-4">{otherUser?.displayName}</h6>
                </CardActionArea>
              );
            }
            return null;
          })
        )}
      </div>
    </>
  );
};

export const FinalProcessToCreateGroup = ({
  dispatch,
  selectedIdsForGroup,
  userInfo,
  groupName,
}) => {
  return (
    <div>
      <div className="find__users mt-2 sticky-top">
        <input
          onChange={(e) => dispatch(setGroupName(e.target.value))}
          className="form-control"
          type="text"
          placeholder="Group Name is required"
          required
        />
      </div>
      <div className="users__list mt-2">
        <div className="selectedId__container">
          {selectedIdsForGroup?.map((selectedId) => (
            <div key={selectedId.id} className="selected_id">
              <HighlightOffIcon
                onClick={() =>
                  deleteIdFromSelectedId(
                    dispatch,
                    selectedId?.id,
                    selectedIdsForGroup
                  )
                }
                className="times_for_selectedId"
                size="small"
              />
              <Avatar src={selectedId?.photoURL} />
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <Button
            onClick={() => dispatch(setFinalStepToCreateGroup(false))}
            style={{
              background: "#fff",
              color: "rgb(29, 29, 29)",
              margin: "0 0.5rem",
            }}
            variant="contained"
            size="small"
          >
            <ArrowBackIcon style={{ fontSize: "16px" }} /> &nbsp;
            <span style={{ fontWeight: "bold" }}>Back</span>
          </Button>
          <Button
            onClick={() =>
              createGroupForFirst(
                selectedIdsForGroup,
                userInfo,
                groupName,
                dispatch
              )
            }
            style={{
              margin: "0 0.5rem",
            }}
            variant="contained"
            size="small"
          >
            <span style={{ fontWeight: "bold" }}>Create</span> &nbsp;
            <AddCircleOutlineIcon style={{ fontSize: "16px" }} />
          </Button>
        </div>
      </div>
    </div>
  );
};
