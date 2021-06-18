import "./Chat.css";
import TimeAgo from "timeago-react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CallIcon from "@material-ui/icons/Call";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import { Avatar, IconButton } from "@material-ui/core";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";
import InputEmoji from "react-input-emoji";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import { handleIsType } from "./one_one_chat_logic";

export const ChatHeader = ({ receiverInfo, addChatList }) => {
  return (
    <div className="chat__header">
      <div className="header__info">
        <Avatar src={receiverInfo?.photoURL} />
        {addChatList && (
          <div
            className={receiverInfo?.status === "active" ? "online" : "d-none"}
          />
        )}
        <div className="p-2">
          <h6
            style={{ fontWeight: "bold", letterSpacing: "1px" }}
            className="p-0 m-0"
          >
            {receiverInfo.displayName}
          </h6>
          {addChatList && receiverInfo?.status === "inactive" && (
            <small className="text-muted p-0 m-0">
              active <TimeAgo datetime={receiverInfo?.goOffLine} />
            </small>
          )}
        </div>
      </div>
      <div className="chat__options">
        <IconButton>
          <CallIcon />
        </IconButton>
        <IconButton>
          <VideoCallIcon />
        </IconButton>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </div>
    </div>
  );
};

export const UploadProgressBar = ({ uploadPercentage }) => {
  return (
    <div className="upload__progressBar">
      <div style={{ width: `${uploadPercentage}%` }} className="bar"></div>
    </div>
  );
};

const ROOT_CSS = css({
  height: "70%",
  width: "100%",
});

export const ChatBody = ({ chatMessage, senderInfo, receiverInfo, typing }) => {
  return (
    <ScrollToBottom className={`${ROOT_CSS} chat__body`}>
      {chatMessage.map((message) => (
        <div
          key={message._id}
          className={
            message?.sender === senderInfo.email
              ? "chat__text myChat"
              : "chat__text"
          }
        >
          <p className="name">
            {message?.sender === senderInfo.email
              ? `${senderInfo.displayName?.split(" ")[0]}`
              : `${receiverInfo.displayName?.split(" ")[0]}`}
          </p>
          <div>
            {message?.message}
            <p className="time">
              {new Date(message?.timeStamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
      {typing && (
        <div className="chat__text">
          <p className="text-muted">typing...</p>
        </div>
      )}
    </ScrollToBottom>
  );
};

export const ChatFooter = ({
  largeScreen,
  socket,
  senderEmail,
  inputText,
  setInputText,
  handleOnEnter,
}) => {
  return (
    <div className="chat__footer">
      <IconButton>
        <AttachFileIcon />
      </IconButton>
      {largeScreen ? (
        <>
          <div
            style={{ flex: 1 }}
            onFocus={(e) => handleIsType(e, socket, senderEmail)}
            onBlur={(e) => handleIsType(e, socket, senderEmail)}
          >
            <InputEmoji
              value={inputText}
              onChange={setInputText}
              cleanOnEnter
              onEnter={handleOnEnter}
              placeholder="Type a message"
            />
          </div>
          {inputText.trim() && (
            <IconButton onClick={handleOnEnter} id="sendIcon">
              <SendIcon />
            </IconButton>
          )}
        </>
      ) : (
        <>
          <div
            style={{ flex: 1 }}
            onFocus={(e) => handleIsType(e, socket, senderEmail)}
            onBlur={(e) => handleIsType(e, socket, senderEmail)}
          >
            <InputEmoji
              value={inputText}
              onChange={setInputText}
              placeholder="Type a message"
            />
          </div>
          {inputText.trim() && (
            <IconButton onClick={handleOnEnter} id="sendIcon">
              <SendIcon />
            </IconButton>
          )}
        </>
      )}
    </div>
  );
};
