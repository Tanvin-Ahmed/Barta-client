import "./Chat.css";
import TimeAgo from "timeago-react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CallIcon from "@material-ui/icons/Call";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import { Avatar, CardActionArea, IconButton } from "@material-ui/core";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import CircularProgress from "@material-ui/core/CircularProgress";
import Picker from "emoji-picker-react";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {
  deleteChosenFiles,
  fileUpload,
  handleIsType,
  handleReactions,
  options,
  toggleReactTab,
} from "./one_one_chat_logic";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import { deleteChat, download } from "../../../app/actions/messageAction";
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
import path from "path";
import { useState, useEffect } from "react";
import { Menu, MenuItem } from "@mui/material";

const CallButtons = ({ callUser }) => {
  return (
    <>
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
    </>
  );
};

export const ChatHeader = ({
  receiverInfo,
  addChatList,
  largeScreen,
  // private video call
  callUser,
  // group chat
  groupInfo,
  showCallButtons,
  acceptCall,
  // settings
  history,
}) => {
  return (
    <div className="chat__header">
      <div className="header__info">
        <Avatar
          src={
            receiverInfo?.displayName
              ? receiverInfo?.photoURL
                ? receiverInfo.photoURL
                : `http://localhost:5000/user/account/get-profile-img/${receiverInfo?.photoId}`
              : groupInfo?.photoId &&
                `http://localhost:5000/groupAccount/get-profile-img/${groupInfo?.photoId}`
          }
        />
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
        {JSON.parse(sessionStorage.getItem("barta/groupName"))?.groupName ? (
          showCallButtons ? (
            <CallButtons callUser={callUser} />
          ) : (
            <button onClick={acceptCall} type="button" className="join__button">
              Join
            </button>
          )
        ) : (
          <CallButtons callUser={callUser} />
        )}
        <IconButton
          title="Settings"
          variant="contained"
          size="small"
          className="icon text-light"
          onClick={() => history.push("/chat-settings")}
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
    <div>
      <div
        className={
          message?.sender === sender
            ? "chatOptions__show"
            : "chatOptions__show_receiver"
        }
      >
        {message?.sender === sender && (
          <IconButton
            variant="contained"
            size="small"
            onClick={() => deleteChat(message)}
            className="icon"
          >
            <DeleteIcon className="icon__button text-light" />
          </IconButton>
        )}
        <IconButton variant="contained" size="small" className="icon">
          <ReplayIcon className="icon__button text-light" />
        </IconButton>
        <IconButton
          variant="contained"
          size="small"
          onClick={() => toggleReactTab(dispatch, !reactTabIsOpen)}
          className="icon"
        >
          <AddReactionIcon className="icon__button text-light" />
        </IconButton>
      </div>
      {reactTabIsOpen && (
        <div className="react__tab">
          <div
            onClick={() => toggleReactTab(dispatch, !reactTabIsOpen)}
            className="back__drop"
          />
          <div className="react_options">
            <p
              onClick={() => handleReactions(dispatch, message, sender, "🧡")}
              className="chose"
            >
              🧡
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "😍")}
              className="chose"
            >
              😍
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "😘")}
              className="chose"
            >
              😘
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "🥰")}
              className="chose"
            >
              🥰
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "🤗")}
              className="chose"
            >
              🤗
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "😢")}
              className="chose"
            >
              😢
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "🤣")}
              className="chose"
            >
              🤣
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "😍")}
              className="chose"
            >
              😅
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "🥰")}
              className="chose"
            >
              🙂
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "😠")}
              className="chose"
            >
              😠
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "😭")}
              className="chose"
            >
              😭
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "🙄")}
              className="chose"
            >
              🙄
            </p>
            <p
              onClick={() =>
                handleReactions(dispatch, message?._id, sender, "😦")
              }
              className="chose"
            >
              😦
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "😋")}
              className="chose"
            >
              😋
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "😪")}
              className="chose"
            >
              😪
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "🥰")}
              className="chose"
            >
              🤪
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "😴")}
              className="chose"
            >
              😴
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "🤔")}
              className="chose"
            >
              🤔
            </p>
            <p
              onClick={() => handleReactions(dispatch, message, sender, "👍")}
              className="chose"
            >
              👍
            </p>
          </div>
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
  getOldMessage,
  reFetchMessage,
}) => {
  return (
    <>
      <ScrollToBottom className={`${ROOT_CSS} chat__body`}>
        {getMessageSpinner && (
          <div className="chatBody__spinner">
            <div className="chatBody__spinner_container">
              <CircularProgress style={{ color: "rgb(18, 3, 45)" }} />
            </div>
          </div>
        )}
        {chatMessage.length === 0 && !getMessageSpinner && (
          <p className="message__notAvailable">NO MESSAGE AVAILABLE!</p>
        )}
        <>
          <div className="d-flex justify-content-center align-items-center">
            {reFetchMessage && (
              <CardActionArea
                title="get old message"
                className="oldMessageLoad__btn"
                onClick={getOldMessage}
              >
                <ReplayIcon size="small" className="text-light" />
              </CardActionArea>
            )}
          </div>
          {chatMessage.length > 0 &&
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
                    <div
                      dangerouslySetInnerHTML={{ __html: message?.message }}
                    ></div>

                    {message.receiver && (
                      <>
                        <div className="d-flex justify-content-center align-items-center">
                          {message?.callDuration?.duration ? (
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
                        {message?.callDuration?.duration && (
                          <small>
                            <Timer timer={message?.callDuration} />
                          </small>
                        )}
                      </>
                    )}
                    <div className="d-flex justify-content-center align-items-center flex-wrap">
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
                            } else if (
                              file.contentType.split("/")[0] === "video"
                            ) {
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
                                  className={`d-flex align-items-center show__document ${
                                    message?.sender === senderInfo.email &&
                                    "show_user_document"
                                  }`}
                                >
                                  <IconButton
                                    variant="contained"
                                    size="small"
                                    onClick={() => download(file.filename)}
                                    className="icon download__icon text-light mr-3"
                                  >
                                    <ArrowDownwardIcon />
                                  </IconButton>
                                  <div className="document__title">
                                    {file.filename
                                      ?.split("_")
                                      ?.join(" ")
                                      ?.split("◉_◉")[0] +
                                      path.extname(file.filename)}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </SRLWrapper>
                      ) : null}
                    </div>
                    <p className="time d-flex justify-content-between align-items-center">
                      {new Date(message?.timeStamp).toLocaleString()}
                      {message?.sender === senderInfo?.email ? (
                        message?.status === "unseen" ? (
                          <CheckIcon
                            sx={{
                              color: "#ccc",
                              height: "1rem",
                              width: "1rem",
                            }}
                          />
                        ) : (
                          <DoneAllIcon
                            sx={{
                              color: "#ccc",
                              height: "1rem",
                              width: "1rem",
                            }}
                          />
                        )
                      ) : null}
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
            ))}
        </>
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

export const ChatFooter = ({
  largeScreen,
  socket,
  senderEmail,
  inputText,
  setInputText,
  text,
  onEmojiClick,
  handleOnEnter,
  chosenFiles,
  dispatch,
}) => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const value = message.split(" ").join("&nbsp;").split("\n").join("<br/>");
    setInputText(value);
  }, [message, setInputText]);

  return (
    <div
      className={
        openEmoji ? "chat__footer_withEmoji" : "chat__footer_withoutEmoji"
      }
    >
      <div className="chat__footer_container">
        {largeScreen ? (
          <>
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ flex: 1 }}
              onFocus={(e) => handleIsType(e, socket, senderEmail)}
              onBlur={(e) => handleIsType(e, socket, senderEmail)}
            >
              {!inputText.trim() && <FilePicker dispatch={dispatch} />}
              <textarea
                cols="30"
                rows="2"
                ref={text}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onFocus={() => setOpenEmoji(false)}
                placeholder="Type a message"
              ></textarea>
              <IconButton
                onClick={() => setOpenEmoji(!openEmoji)}
                className="icon"
              >
                <InsertEmoticonIcon
                  style={{ color: "white" }}
                  className="icon__button"
                />
              </IconButton>
              {(inputText.trim() || chosenFiles) && (
                <IconButton
                  onClick={() => {
                    handleOnEnter();
                    setMessage("");
                  }}
                  onKeyUp={(e) => {
                    if (e.code === "Enter") {
                      handleOnEnter();
                      setMessage("");
                    }
                  }}
                  className="icon"
                >
                  <SendIcon className="icon__button text-light" />
                </IconButton>
              )}
            </div>
          </>
        ) : (
          <>
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ flex: 1 }}
              onFocus={(e) => handleIsType(e, socket, senderEmail)}
              onBlur={(e) => handleIsType(e, socket, senderEmail)}
            >
              {!inputText.trim() && <FilePicker dispatch={dispatch} />}
              <textarea
                cols="30"
                rows="2"
                ref={text}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setMessage(e.target.value);
                }}
                onFocus={() => setOpenEmoji(false)}
                placeholder="Type a message"
              ></textarea>
              <IconButton
                onClick={() => setOpenEmoji(!openEmoji)}
                className="icon"
              >
                <InsertEmoticonIcon
                  style={{ color: "white" }}
                  className="icon__button"
                />
              </IconButton>
              {(inputText.trim() || chosenFiles) && (
                <IconButton
                  onClick={() => {
                    handleOnEnter();
                    setMessage("");
                  }}
                  className="icon send__icon"
                >
                  <SendIcon className="text-light" />
                </IconButton>
              )}
            </div>
          </>
        )}
      </div>
      {openEmoji && (
        <Picker style={{ width: "100%" }} onEmojiClick={onEmojiClick} />
      )}
    </div>
  );
};

const FilePicker = ({ dispatch }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        className="icon"
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <AddCircleIcon className="icon__button text-light add__button" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onChange={(e) => {
            fileUpload(e, dispatch);
            handleClose();
          }}
        >
          <input type="file" name="file" accept="image/*" id="image" multiple />
          <label
            htmlFor="image"
            style={{ color: "rgb(144, 89, 233)", cursor: "pointer" }}
          >
            Image <InsertPhotoIcon size="small" />
          </label>
        </MenuItem>
        <MenuItem
          onChange={(e) => {
            fileUpload(e, dispatch);
            handleClose();
          }}
        >
          <input type="file" name="file" accept="video/*" id="video" />
          <label
            htmlFor="video"
            style={{ color: "rgb(144, 89, 233)", cursor: "pointer" }}
          >
            Video <VideoLibraryIcon size="small" />
          </label>
        </MenuItem>
        <MenuItem
          onChange={(e) => {
            fileUpload(e, dispatch);
            handleClose();
          }}
        >
          <input type="file" name="file" accept="file/*" id="file" multiple />
          <label
            htmlFor="file"
            style={{ color: "rgb(144, 89, 233)", cursor: "pointer" }}
          >
            File <AttachFileIcon size="small" />
          </label>
        </MenuItem>
      </Menu>
    </div>
  );
};
