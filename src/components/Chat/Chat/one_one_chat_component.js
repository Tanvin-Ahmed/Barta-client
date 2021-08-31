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
import CircularProgress from "@material-ui/core/CircularProgress";
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
import {
  download,
  isClickUploadOption,
} from "../../../app/actions/messageAction";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DeleteIcon from "@material-ui/icons/Delete";
import AddReactionIcon from "@material-ui/icons/AddReaction";
import ReplayIcon from "@material-ui/icons/Replay";
import { SRLWrapper } from "simple-react-lightbox";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import CallMadeIcon from "@material-ui/icons/CallMade";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import CallMissedOutgoingIcon from "@material-ui/icons/CallMissedOutgoing";
import CallMissedIcon from "@material-ui/icons/CallMissed";
import Timer from "../PrivateCallSystem/Timer.jsx";

export const ChatHeader = ({
  receiverInfo,
  addChatList,
  largeScreen,
  // private video call
  callUser,
  // group chat
  groupInfo,
}) => {
  return (
    <div className="chat__header">
      <div className="header__info">
        <Avatar src={receiverInfo?.photoURL || groupInfo?.photoURL} />
        {addChatList && (
          <div
            className={
              receiverInfo?.status
                ? receiverInfo?.status === "active"
                  ? "online"
                  : "d-none"
                : groupInfo?.status === "active"
                ? "online"
                : "d-none"
            }
          />
        )}
        <div className="p-2">
          <h6
            style={{ fontWeight: "bold", letterSpacing: "1px", color: "white" }}
            className="p-0 m-0"
          >
            {largeScreen
              ? receiverInfo?.displayName ||
                groupInfo?.groupName?.split("◉_◉")[0]
              : receiverInfo?.displayName?.split(" ")[0] ||
                groupInfo?.groupName?.split("◉_◉")[0]?.split(" ")[0]}
          </h6>
          {addChatList && receiverInfo?.status === "inactive" && (
            <small style={{ color: "rgb(231, 231, 231)" }} className="p-0 m-0">
              active <TimeAgo datetime={receiverInfo?.goOffLine} />
            </small>
          )}
        </div>
      </div>
      <div className="chat__options">
        <IconButton
          variant="contained"
          size="small"
          onClick={() => callUser(false)}
          className="icon text-light"
        >
          <CallIcon className="icon__button" />
        </IconButton>
        <IconButton
          variant="contained"
          size="small"
          onClick={() => callUser(true)}
          className="icon text-light"
        >
          <VideoCallIcon className="icon__button" />
        </IconButton>
        <IconButton
          variant="contained"
          size="small"
          className="icon text-light"
        >
          <MoreVertIcon className="icon__button" />
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

const Options = ({ dispatch, reactTabIsOpen, message, sender }) => {
  return (
    <div className="position-relative">
      <div
        className={
          message?.sender === sender
            ? "d-flex justify-content-center align-items-center"
            : "d-flex flex-row-reverse justify-content-center align-items-center"
        }
      >
        {message?.sender === sender && (
          <IconButton
            variant="contained"
            size="small"
            onClick={() => handleDeleteMessage(dispatch, message)}
            className="icon mx-1"
          >
            <DeleteIcon className="icon__button text-light" />
          </IconButton>
        )}
        <IconButton variant="contained" size="small" className="icon mx-1">
          <ReplayIcon className="icon__button text-light" />
        </IconButton>
        <IconButton
          variant="contained"
          size="small"
          onClick={() => toggleReactTab(dispatch, !reactTabIsOpen)}
          className="icon mx-1"
        >
          <AddReactionIcon className="icon__button text-light" />
        </IconButton>
      </div>
      {reactTabIsOpen && (
        <div
          className={`${
            message?.sender === sender ? "" : "react_options_receiver"
          } react_options d-flex justify-content-center align-items-center`}
        >
          <p
            onClick={() => handleReactions(dispatch, message, sender, "🧡")}
            className="mx-1 p-1 chose"
          >
            🧡
          </p>
          <p
            onClick={() => handleReactions(dispatch, message, sender, "😢")}
            className="mx-1 p-1 chose"
          >
            😢
          </p>
          <p
            onClick={() => handleReactions(dispatch, message, sender, "😠")}
            className="mx-1 p-1 chose"
          >
            😠
          </p>
          <p
            onClick={() => handleReactions(dispatch, message, sender, "🙄")}
            className="mx-1 p-1 chose"
          >
            🙄
          </p>
          <p
            onClick={() =>
              handleReactions(dispatch, message?._id, sender, "😦")
            }
            className="mx-1 p-1 chose"
          >
            😦
          </p>
          <p
            onClick={() => handleReactions(dispatch, message, sender, "👍")}
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
  getMessageSpinner,
}) => {
  return (
    <>
      <ScrollToBottom className={`${ROOT_CSS} chat__body`}>
        {getMessageSpinner ? (
          <div className="chatBody__spinner">
            <CircularProgress style={{ color: "rgb(18, 3, 45)" }} />
          </div>
        ) : chatMessage.length === 0 ? (
          <p className="message__notAvailable">NO MESSAGE AVAILABLE!</p>
        ) : (
          chatMessage?.map((message) => (
            <div
              key={message?._id}
              style={{ width: "100%" }}
              className={
                message?.sender === senderInfo.email
                  ? "d-flex d-flex justify-content-end align-items-center"
                  : "d-flex flex-row-reverse justify-content-end align-items-center"
              }
              onMouseOver={() => options(dispatch, true, message?._id)}
              onMouseLeave={() => options(dispatch, false, message?._id)}
            >
              {isOpenOptions?.bool && isOpenOptions?.id === message?._id && (
                <Options
                  dispatch={dispatch}
                  reactTabIsOpen={reactTabIsOpen}
                  message={message}
                  sender={senderInfo?.email}
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
                  {message.receiver && (
                    <>
                      <div className="d-flex justify-content-center align-items-center">
                        {message?.callDuration?.s > 0 ? (
                          message?.sender === senderInfo.email ? (
                            <CallMadeIcon
                              className="mr-2"
                              variant="contained"
                              size="small"
                              style={{ color: "blue" }}
                            />
                          ) : (
                            <CallReceivedIcon
                              className="mr-2"
                              variant="contained"
                              size="small"
                              style={{ color: "green" }}
                            />
                          )
                        ) : message?.sender === senderInfo.email ? (
                          <CallMissedOutgoingIcon
                            className="mr-2"
                            variant="contained"
                            size="small"
                            style={{ color: "red" }}
                          />
                        ) : (
                          <CallMissedIcon
                            className="mr-2"
                            variant="contained"
                            size="small"
                            style={{ color: "red" }}
                          />
                        )}
                        <h6>{message?.callDescription}</h6>
                      </div>
                      {message?.callDuration?.s > 0 && (
                        <small>
                          <Timer timer={message?.callDuration} />
                        </small>
                      )}
                    </>
                  )}
                  {message?.files?.length > 0 ? (
                    <SRLWrapper options={option}>
                      {message.files?.map((file, index) => {
                        if (file.contentType.split("/")[0] === "image") {
                          return (
                            <a
                              key={index}
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
                            <div
                              key={index}
                              className="d-flex justify-content-center align-items-center"
                            >
                              <IconButton
                                variant="contained"
                                size="small"
                                onClick={() => download(file.filename)}
                                className="icon download__icon text-light"
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
                              key={index}
                              className={`d-flex justify-content-between align-items-center show__document ${
                                message?.sender === senderInfo.email &&
                                "show_user_document"
                              }`}
                            >
                              <IconButton
                                variant="contained"
                                size="small"
                                onClick={() => download(file.filename)}
                                className="icon download__icon text-light"
                              >
                                <ArrowDownwardIcon />
                              </IconButton>
                              <div className="document__title">
                                {file.filename}
                              </div>
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
                <div className="tooltip__hover">
                  {message?.react?.length > 0 && (
                    <div
                      className={
                        message?.sender === senderInfo.email
                          ? "reaction"
                          : "reaction reaction__receiver"
                      }
                    >
                      {message?.react[0]?.react === message?.react[1]?.react
                        ? message?.react[0]?.react
                        : message?.react?.map((r, index) => {
                            return <div key={index}>{r?.react}</div>;
                          })}
                      {message?.react?.length > 0 && (
                        <>{message?.react?.length}</>
                      )}
                      <div className="message__tooltip">
                        {message?.react?.map((r, i) => (
                          <div
                            key={i}
                            className="d-flex justify-content-between align-items-center react__display"
                          >
                            <div
                              style={{ fontWeight: "bold", width: "100%" }}
                              className="m-1"
                            >
                              {r.sender}
                            </div>
                            <div>{r.react}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {typing && (
          <div className="typing__container">
            <div className="typing">typing...</div>
          </div>
        )}
      </ScrollToBottom>
    </>
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
              <small
                style={{
                  fontWeight: "400",
                  color: "#fff",
                  letterSpacing: "1px",
                }}
              >
                {file?.name}
              </small>
              <HighlightOffIcon
                className="delete__icon"
                onClick={() => deleteChosenFiles(chosenFiles, index, dispatch)}
              />
            </div>
          );
        }
        return null;
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
            <InsertPhotoIcon size="small" className="text-light" />
          </label>
        </IconButton>
      </div>
      <div>
        <IconButton onChange={(e) => fileUpload(e, dispatch)} className="icon">
          <input type="file" name="file" accept="video/*" id="video" />
          <label htmlFor="video">
            <VideoLibraryIcon size="small" className="text-light" />
          </label>
        </IconButton>
      </div>
      <div>
        <IconButton onChange={(e) => fileUpload(e, dispatch)} className="icon">
          <input type="file" name="file" accept="file/*" id="file" multiple />
          <label htmlFor="file">
            <AttachFileIcon size="small" className="text-light" />
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
          <AddCircleIcon className="icon__button text-light" />
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
              style={{ color: "white" }}
            />
          </div>
          {(inputText.trim() || chosenFiles) && (
            <IconButton onClick={handleOnEnter} className="icon">
              <SendIcon className="icon__button text-light" />
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
              <SendIcon className="text-light" />
            </IconButton>
          )}
        </>
      )}
    </div>
  );
};
