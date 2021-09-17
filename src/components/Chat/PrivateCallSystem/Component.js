import React from "react";
import { IconButton } from "@material-ui/core";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import CloseIcon from "@material-ui/icons/Close";
import "./PrivateCall.css";
import MicIcon from "@material-ui/icons/Mic";
import VideocamIcon from "@material-ui/icons/Videocam";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";
import { handleAudioMute, handleVideoMute } from "./callLogic";

export const Buttons = ({
  videoOpen,
  voiceOpen,
  receivingCall,
  callAccepted,
  stream,
  dispatch,
  answerCall,
  leaveCall,
  videoChat,
}) => {
  return (
    <div className="button__group d-flex justify-content-center align-items-center">
      {/* voice mute */}
      <IconButton
        className="audio__video_mute_button m-2"
        variant="contained"
        size="small"
        onClick={() => handleAudioMute(stream, voiceOpen, dispatch)}
      >
        {voiceOpen ? (
          <MicIcon style={{ color: "gray" }} />
        ) : (
          <MicOffIcon style={{ color: "gray" }} />
        )}
      </IconButton>
      {/* video mute */}
      {videoChat ? (
        <IconButton
          className="audio__video_mute_button m-2"
          variant="contained"
          size="small"
          onClick={() => handleVideoMute(stream, videoOpen, dispatch)}
        >
          {videoOpen ? (
            <VideocamIcon style={{ color: "gray" }} />
          ) : (
            <VideocamOffIcon style={{ color: "gray" }} />
          )}
        </IconButton>
      ) : null}
      {/* call end */}
      {receivingCall && !callAccepted ? (
        <div className="d-flex justify-content-center align-items-center">
          <IconButton
            className="delete_button m-2"
            variant="contained"
            size="small"
            onClick={leaveCall}
          >
            <CloseIcon style={{ color: "red" }} />
          </IconButton>
          <IconButton
            className="receive_button m-2"
            variant="contained"
            size="small"
            onClick={answerCall}
          >
            <PhoneInTalkIcon style={{ color: "dodgerblue" }} />
          </IconButton>
        </div>
      ) : (
        <IconButton
          className="delete_button m-2"
          variant="contained"
          size="small"
          onClick={leaveCall}
        >
          <CloseIcon style={{ color: "red" }} />
        </IconButton>
      )}
    </div>
  );
};
