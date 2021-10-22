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

const ChatSettings = () => {
  const history = useHistory();
  const [information, setInformation] = useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [lading, setLoading] = useState(false);

  const { receiverInfo, groupInfo, userInfo } = useSelector((state) => ({
    receiverInfo: state.userReducer.receiverInfo,
    groupInfo: state.userReducer.groupInfo,
    userInfo: state.userReducer.userInfo,
  }));

  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem("barta/groupName"))?.groupName) {
      setInformation(groupInfo);
    } else {
      setInformation(receiverInfo);
    }
  }, [groupInfo, receiverInfo]);

  return (
    <section className="chat__settings p-3">
      <div className="d-flex justify-content-center align-items-center flex-column mb-2">
        <Avatar
          src={
            information?.photoURL
              ? information.photoURL
              : JSON.parse(sessionStorage.getItem("barta/groupName"))?.groupName
              ? `http://localhost:5000/groupAccount/get-profile-img/${information?.photoId}`
              : `http://localhost:5000/user/account/get-profile-img/${information?.photoId}`
          }
          style={{ height: "10rem", width: "10rem" }}
        />
        <h4>
          {information?.displayName || information?.groupName?.split("◉_◉")[0]}
        </h4>
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
          {JSON.parse(sessionStorage.getItem("barta/groupName"))?.groupName ? (
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
        {JSON.parse(sessionStorage.getItem("barta/groupName"))?.groupName && (
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
    </section>
  );
};

export default ChatSettings;
