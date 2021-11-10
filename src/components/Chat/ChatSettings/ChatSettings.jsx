import { Avatar, Badge, CardActionArea, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./ChatSettings.css";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ImageIcon from "@mui/icons-material/Image";
import { useHistory } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { leaveFromGroup } from "../../../app/actions/userAction";
import CircularProgress from "@mui/material/CircularProgress";
import AddMemberModal from "../AddMemberModal/AddMemberModal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import { deleteConversation } from "../../../app/actions/messageAction";

const ChatSettings = () => {
  const history = useHistory();
  const [information, setInformation] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [lading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [roomIdToDelete, setRoomIdToDelete] = useState("");

  const { receiverInfo, groupInfo, userInfo } = useSelector((state) => ({
    receiverInfo: state.userReducer.receiverInfo,
    groupInfo: state.userReducer.groupInfo,
    userInfo: state.userReducer.userInfo,
  }));

  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
      setInformation(groupInfo);
      setRoomIdToDelete(groupInfo?._id);
    } else {
      setInformation(receiverInfo);
      let roomId = [
        userInfo?.email?.split("@")[0],
        receiverInfo?.email?.split("@")[0],
      ].sort();
      roomId = `${roomId[0]}_${roomId[1]}`;
      setRoomIdToDelete(roomId);
    }
  }, [groupInfo, receiverInfo, userInfo]);

  return (
    <section className="chat__settings p-3">
      <div className="d-flex justify-content-center align-items-center flex-column mb-2">
        <Avatar
          src={
            information?.photoURL
              ? information.photoURL
              : JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId
              ? `http://localhost:5000/groupAccount/get-profile-img/${information?.photoId}`
              : `http://localhost:5000/user/account/get-profile-img/${information?.photoId}`
          }
          style={{ height: "10rem", width: "10rem" }}
        />
        <h4>{information?.displayName || information?.groupName}</h4>
        <div className="d-flex justify-content-around align-items-center">
          <Tooltip title="Audio call">
            <IconButton>
              <CallIcon style={{ color: "white" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video call">
            <IconButton>
              <VideoCallIcon style={{ color: "white" }} />
            </IconButton>
          </Tooltip>
          {JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId ? (
            <>
              <Tooltip title="Edit profile">
                <IconButton
                  onClick={() => history.push("/update-account/groupAccount")}
                >
                  <EditIcon style={{ color: "white" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add people">
                <IconButton onClick={() => setIsOpen(true)}>
                  <PersonAddIcon style={{ color: "white" }} />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Show friend profile">
              <IconButton
                onClick={() => history.push("/view-profile/receiverInfo")}
              >
                <AccountCircleIcon style={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Mute">
            <IconButton>
              <NotificationsNoneIcon style={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="mt-4">
        <CardActionArea className="py-2 px-2 my-1">
          <div className="d-flex justify-content-between align-items-center">
            <h6>View image & video</h6>
            <ImageIcon style={{ color: "white" }} />
          </div>
        </CardActionArea>
        <CardActionArea className="py-2 px-2 my-1">
          <div className="d-flex justify-content-between align-items-center">
            <h6>Search conversation</h6>
            <SearchIcon style={{ color: "white" }} />
          </div>
        </CardActionArea>
        <CardActionArea
          onClick={() => setDeleteModal(true)}
          className="py-2 px-2 my-1"
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6>Delete conversation</h6>
            <DeleteForeverIcon style={{ color: "rgb(255, 29, 78)" }} />
          </div>
        </CardActionArea>
        {JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId && (
          <>
            <CardActionArea className="py-2 px-2 my-1">
              <div className="d-flex justify-content-between align-items-center">
                <h6>Show members</h6>
                <Badge
                  badgeContent={groupInfo?.members?.length}
                  color="primary"
                >
                  <PeopleAltIcon style={{ color: "white" }} />
                </Badge>
              </div>
            </CardActionArea>
            <CardActionArea
              className="py-2 px-2 my-1"
              onClick={() =>
                leaveFromGroup(
                  { _id: groupInfo?._id, email: userInfo?.email },
                  setLoading,
                  history
                )
              }
            >
              <div className="d-flex justify-content-between align-items-center">
                <h6>Leave group</h6>
                {lading && (
                  <CircularProgress
                    style={{
                      color: "white",
                      height: "1rem",
                      width: "1rem",
                    }}
                  />
                )}
                <LogoutIcon style={{ color: "white" }} />
              </div>
            </CardActionArea>
          </>
        )}
      </div>
      {modalIsOpen && (
        <AddMemberModal
          setIsOpen={setIsOpen}
          groupMembers={groupInfo?.members}
        />
      )}
      {deleteModal && (
        <RemoveChatModal
          setDeleteModal={setDeleteModal}
          roomIdToDelete={roomIdToDelete}
        />
      )}
    </section>
  );
};

export default ChatSettings;

const RemoveChatModal = ({ setDeleteModal, roomIdToDelete }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({});
  const handleDeleteMessages = () => {
    if (roomIdToDelete.trim()) {
      deleteConversation(roomIdToDelete, setLoading, setMessage);
    }
  };
  return (
    <section
      onClick={() => !loading && setDeleteModal(false)}
      className="remove_chat_modal"
    >
      <div className="container">
        <h5 className="text-center text-danger">Remove conversation</h5>
        <small className="d-block text-center text-light">
          There is no recover option for this conversation. Even all chats
          remove from your friend conversation also.
        </small>
        <small className="d-block text-center text-danger mb-3">
          Are you sure!!??
        </small>
        <div className="d-flex justify-content-around align-items-center">
          <button
            onClick={() => !loading && setDeleteModal(false)}
            type="button"
            className="cancel__button"
          >
            <CloseIcon style={{ color: "white" }} /> Cancel
          </button>
          <button
            onClick={handleDeleteMessages}
            type="submit"
            className="submit__button"
          >
            <DeleteForeverIcon style={{ color: "white" }} /> Delete
          </button>
        </div>
        {loading && (
          <div className="d-flex justify-content-center align-items-center my-2">
            <CircularProgress style={{ color: "rgb(255, 29, 78)" }} />
          </div>
        )}
        {message?.status ? (
          message?.status === "ok" ? (
            <small className="d-block text-light text-center my-2">
              {message?.message}
            </small>
          ) : (
            <span className="d-block text-center text-warning my-2">
              {message?.message}
            </span>
          )
        ) : null}
      </div>
    </section>
  );
};
