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
import {
  deleteChosenFiles,
  fileUpload,
  handleDeleteMessage,
  handleIsType,
  handleReactions,
  options,
  toggleReactTab,
} from "./one_one_chat_logic";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import { download, isClickUploadOption } from "../../app/actions/messageAction";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DeleteIcon from "@material-ui/icons/Delete";
import AddReactionIcon from "@material-ui/icons/AddReaction";
import ReplayIcon from "@material-ui/icons/Replay";
import { SRLWrapper } from "simple-react-lightbox";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

export const ChatHeader = ({
  receiverInfo,
  addChatList,
  largeScreen,
  // private video call
  callUser,
}) => {
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
            {largeScreen
              ? receiverInfo.displayName
              : receiverInfo.displayName?.split(" ")[0]}
          </h6>
          {addChatList && receiverInfo?.status === "inactive" && (
            <small className="text-muted p-0 m-0">
              active <TimeAgo datetime={receiverInfo?.goOffLine} />
            </small>
          )}
        </div>
      </div>
      <div className="chat__options">
        <IconButton onClick={() => callUser(false)} className="icon">
          <CallIcon />
        </IconButton>
        <IconButton onClick={() => callUser(true)} className="icon">
          <VideoCallIcon />
        </IconButton>
        <IconButton className="icon">
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

const Options = ({ dispatch, reactTabIsOpen, message }) => {
  return (
    <div className="position-relative">
      <div className="d-flex justify-content-center align-items-center">
        <IconButton
          onClick={() => handleDeleteMessage(dispatch, message)}
          className="icon mx-1"
        >
          <DeleteIcon />
        </IconButton>
        <IconButton className="icon mx-1">
          <ReplayIcon />
        </IconButton>
        <IconButton
          onClick={() => toggleReactTab(dispatch, !reactTabIsOpen)}
          className="icon mx-1"
        >
          <AddReactionIcon />
        </IconButton>
      </div>
      {reactTabIsOpen && (
        <div className="react-options d-flex justify-content-center align-items-center">
          <p
            onClick={() => handleReactions(dispatch, message?._id, "🧡")}
            className="mx-1 p-1 chose"
          >
            🧡
          </p>
          <p
            onClick={() => handleReactions(dispatch, message?._id, "😢")}
            className="mx-1 p-1 chose"
          >
            😢
          </p>
          <p
            onClick={() => handleReactions(dispatch, message?._id, "😠")}
            className="mx-1 p-1 chose"
          >
            😠
          </p>
          <p
            onClick={() => handleReactions(dispatch, message?._id, "🙄")}
            className="mx-1 p-1 chose"
          >
            🙄
          </p>
          <p
            onClick={() => handleReactions(dispatch, message?._id, "😦")}
            className="mx-1 p-1 chose"
          >
            😦
          </p>
          <p
            onClick={() => handleReactions(dispatch, message?._id, "👍")}
            className="mx-1 p-1 chose"
          >
            👍
          </p>
        </div>
      )}
    </div>
  );
};

const ROOT_CSS = css({
  height: "70%",
  width: "100%",
});

const option = {
  buttons: {
    showDownloadButton: false,
  },
};

export const ChatBody = ({
  chatMessage,
  senderInfo,
  receiverInfo,
  typing,
  dispatch,
  isOpenOptions,
  reactTabIsOpen,
}) => {
  return (
    <ScrollToBottom className={`${ROOT_CSS} chat__body`}>
      {chatMessage?.map((message) => (
        <div
          key={message?._id}
          style={{ width: "100%" }}
          className={
            message?.sender === senderInfo.email
              ? "d-flex d-flex justify-content-end align-items-center flex-wrap"
              : "d-flex flex-row-reverse d-flex justify-content-end align-items-center flex-wrap"
          }
          onMouseOver={() => options(dispatch, true, message?._id)}
          onMouseLeave={() => options(dispatch, false, message?._id)}
        >
          {isOpenOptions?.bool && isOpenOptions?.id === message?._id && (
            <Options
              dispatch={dispatch}
              reactTabIsOpen={reactTabIsOpen}
              message={message}
            />
          )}
          <div
            key={message._id}
            className={
              message?.sender === senderInfo.email
                ? "chat__text myChat"
                : "chat__text"
            }
          >
            <p className="name">
              {message?.sender === senderInfo?.email
                ? `${senderInfo?.displayName?.split(" ")[0]}`
                : `${receiverInfo?.displayName?.split(" ")[0]}`}
            </p>
            <div>
              {message?.message}
              {message?.files?.length > 0 ? (
                <SRLWrapper options={option}>
                  {message.files?.map((file, index) => {
                    if (file.contentType.split("/")[0] === "image") {
                      return (
                        <a
                          href={`http://localhost:5000/chatMessage/file/${file?.filename}`}
                        >
                          <img
                            key={file.fileId}
                            className="chat__img"
                            src={`http://localhost:5000/chatMessage/file/${file?.filename}`}
                            alt={`${index + 1}`}
                          />
                        </a>
                      );
                    } else if (file.contentType.split("/")[0] === "video") {
                      return (
                        <div className="d-flex justify-content-center align-items-center">
                          <IconButton
                            onClick={() => download(file.filename)}
                            className="icon download__icon"
                          >
                            <ArrowDownwardIcon />
                          </IconButton>
                          <video
                            key={file.fileId}
                            className="chat__img"
                            src={`http://localhost:5000/chatMessage/file/${file?.filename}`}
                            controls
                            controlsList="nodownload"
                          ></video>
                        </div>
                      );
                    } else if (
                      file.contentType.split("/")[0] === "application"
                    ) {
                      return (
                        <div
                          key={file.fileId}
                          className="d-flex justify-content-center align-items-center show__document"
                        >
                          <IconButton
                            onClick={() => download(file.filename)}
                            className="icon download__icon"
                          >
                            <ArrowDownwardIcon />
                          </IconButton>
                          <div className="document__title">{file.filename}</div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </SRLWrapper>
              ) : null}
              <p className="time">
                {new Date(message?.timeStamp).toLocaleString()}
              </p>
            </div>
            <div className={message?.react ? "reaction" : "d-none"}>
              {message?.react}
            </div>
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

export const ShowFileBeforeUpload = ({ chosenFiles, dispatch }) => {
  return (
    <div className="show__file">
      {chosenFiles.map((file, index) => {
        if (file.file?.type?.split("/")[0] === "image") {
          return (
            <div key={index} style={{ position: "relative" }}>
              <img className="show__img" src={file?.url} alt="" />
              <HighlightOffIcon
                onClick={() => deleteChosenFiles(chosenFiles, index, dispatch)}
                className="times"
              />
            </div>
          );
        } else if (file.file?.type?.split("/")[0] === "video") {
          return (
            <div key={index} style={{ position: "relative" }}>
              <video className="show__img" src={file?.url} />
              <HighlightOffIcon
                onClick={() => deleteChosenFiles(chosenFiles, index, dispatch)}
                className="times"
              />
            </div>
          );
        } else if (file.file?.type?.split("/")[0] === "application") {
          return (
            <div
              key={index}
              className="show__files"
              style={{ position: "relative" }}
            >
              <small style={{ fontWeight: "bold" }}>{file?.name}</small>
              <HighlightOffIcon
                className="delete__icon"
                onClick={() => deleteChosenFiles(chosenFiles, index, dispatch)}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export const UploadFile = ({ dispatch }) => {
  return (
    <div className="upload__file">
      <div>
        <IconButton onChange={(e) => fileUpload(e, dispatch)} className="icon">
          <input type="file" name="file" accept="image/*" id="image" multiple />
          <label htmlFor="image">
            <InsertPhotoIcon />
          </label>
        </IconButton>
      </div>
      <div>
        <IconButton onChange={(e) => fileUpload(e, dispatch)} className="icon">
          <input type="file" name="file" accept="video/*" id="video" />
          <label htmlFor="video">
            <VideoLibraryIcon />
          </label>
        </IconButton>
      </div>
      <div>
        <IconButton onChange={(e) => fileUpload(e, dispatch)} className="icon">
          <input type="file" name="file" accept="file/*" id="file" multiple />
          <label htmlFor="file">
            <AttachFileIcon />
          </label>
        </IconButton>
      </div>
    </div>
  );
};

export const ChatFooter = ({
  largeScreen,
  socket,
  senderEmail,
  inputText,
  setInputText,
  handleOnEnter,
  dispatch,
  clickUploadOption,
  chosenFiles,
}) => {
  return (
    <div className="chat__footer">
      {!inputText.trim() && (
        <IconButton
          onClick={() => dispatch(isClickUploadOption(!clickUploadOption))}
          className="icon"
        >
          <AddCircleIcon />
        </IconButton>
      )}
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
          {(inputText.trim() || chosenFiles) && (
            <IconButton onClick={handleOnEnter} className="icon">
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
          {(inputText.trim() || chosenFiles) && (
            <IconButton onClick={handleOnEnter} className="icon">
              <SendIcon />
            </IconButton>
          )}
        </>
      )}
    </div>
  );
};
