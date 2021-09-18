import { IconButton } from "@material-ui/core";
import React from "react";
import "./NotificationModalForGroupCall.css";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";
import CloseIcon from "@material-ui/icons/Close";
import { acceptGroupCall } from "../../PrivateCallSystem/callLogic";
import { useDispatch, useSelector } from "react-redux";
import { setRemoveGroupCallModal } from "../../../../app/actions/groupCallAction";

const NotificationModalForGroupCall = ({
  socket,
  roomIdOfReceivingGroupCall,
  groupPeersRef,
  myStream,
  setRemoveGroupCallModal,
}) => {
  const dispatch = useDispatch();
  const { userInfo, videoChat, callerName } = useSelector((state) => ({
    userInfo: state.userReducer.userInfo,
    videoChat: state.privateCall.videoChat,
    callerName: state.groupCallReducer.callerName,
  }));

  /////// ACCEPT CALL ///////
  const acceptCall = () => {
    acceptGroupCall(
      dispatch,
      socket,
      roomIdOfReceivingGroupCall,
      userInfo,
      groupPeersRef,
      myStream,
      videoChat
    );
  };

  //////// REMOVE NOTIFICATION /////////
  const removeNotification = () => {
    setRemoveGroupCallModal(true);
  };

  return (
    <>
      <section className="groupCall__notification p-2 bg-primary d-flex flex-column justify-content-around">
        <div className="container text-center">
          <div className="text-light">
            <span style={{ fontWeight: "700" }}>{callerName}</span> <br />{" "}
            <small>make a group call from</small> <br />
            <span style={{ fontWeight: "700" }}>
              {roomIdOfReceivingGroupCall?.split("◉_◉")[0]}
            </span>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <IconButton
            className="delete_button m-2"
            variant="contained"
            size="small"
            onClick={removeNotification}
            title="Deny"
          >
            <CloseIcon style={{ color: "red" }} />
          </IconButton>
          <IconButton
            className="receive_button m-2"
            variant="contained"
            size="small"
            onClick={acceptCall}
            title="Accept"
          >
            <PhoneInTalkIcon style={{ color: "dodgerblue" }} />
          </IconButton>
        </div>
      </section>
      <div className="groupCall__notification__view" />
    </>
  );
};

export default NotificationModalForGroupCall;
