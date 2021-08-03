import "./ChatBar.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PeopleIcon from "@material-ui/icons/People";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { Avatar, CardActionArea, IconButton } from "@material-ui/core";
import { updateChatList } from "../../app/actions/userAction";
import { handleReceiverInfo, handleSearchForFriend } from "./chatBar_logic";
import { Spinner } from "react-bootstrap";

export const ChatBarHeader = ({ userPhotoURL, dispatch }) => {
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
        <div>
          <CardActionArea
            onClick={() => dispatch(updateChatList(true))}
            style={{ padding: "0.2rem 2rem" }}
          >
            <PeopleIcon className="text-light" size="small" />
          </CardActionArea>
        </div>
        <div>
          <CardActionArea
            onClick={() => dispatch(updateChatList(false))}
            style={{ padding: "0.2rem 2rem" }}
          >
            <PersonAddIcon className="text-light" size="small" />
          </CardActionArea>
        </div>
        <div>
          <CardActionArea style={{ padding: "0.2rem 2rem" }}>
            <GroupAddIcon className="text-light" size="small" />
          </CardActionArea>
        </div>
      </div>
    </div>
  );
};

export const ChatList = ({ friendList, history }) => {
  return (
    <>
      <div className="find__friend mt-3 sticky-top">
        <input type="text" className="form-control" placeholder="Find Friend" />
      </div>
      <div className="friend__list mt-2">
        {friendList?.reverse().map((friend) => (
          <CardActionArea
            key={friend?._id}
            onClick={() => handleReceiverInfo(friend, history)}
            className="px-3 d-flex justify-content-start align-items-center text-light"
          >
            <div style={{ position: "relative" }} className="mr-3">
              <Avatar src={friend?.photoURL} />
              <div
                className={friend?.status === "active" ? "onLine" : "d-none"}
              />
            </div>
            <h6 style={{ letterSpacing: "1px" }} className="m-4">
              {friend?.displayName}
            </h6>
          </CardActionArea>
        ))}
      </div>
    </>
  );
};

export const SearchFriend = ({
  userEmail,
  users,
  loading,
  history,
  dispatch,
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
      <div className="users__list mt-2">
        {loading ? (
          <div className="loadingSpinner">
            <Spinner animation="grow" variant="warning" />
          </div>
        ) : (
          users !== [] &&
          users?.map((otherUser) => {
            if (otherUser.email !== userEmail) {
              return (
                <CardActionArea
                  key={otherUser._id}
                  onClick={() => handleReceiverInfo(otherUser, history)}
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
