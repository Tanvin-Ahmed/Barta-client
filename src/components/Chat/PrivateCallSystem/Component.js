import React from "react";
import { IconButton } from "@material-ui/core";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import CloseIcon from "@material-ui/icons/Close";
import "./PrivateCall.css";
import MicIcon from "@material-ui/icons/Mic";
import VideocamIcon from "@material-ui/icons/Videocam";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";

export const Buttons = ({
  videoOpen,
  voiceOpen,
  receivingCall,
  callAccepted,
  handleAudioMute,
  handleVideoMute,
  answerCall,
  leaveCall,
  videoChat,
}) => {
  return (
    <div className="button__group d-flex justify-content-center align-items-center">
      {/* voice mute */}
      {voiceOpen ? (
        <IconButton
          className="audio__video_mute_button m-2"
          variant="contained"
          size="small"
          onClick={handleAudioMute}
        >
          <MicIcon style={{ color: "gray" }} />
        </IconButton>
      ) : (
        <IconButton
          className="audio__video_mute_button m-2"
          variant="contained"
          size="small"
          onClick={handleAudioMute}
        >
          <MicOffIcon style={{ color: "gray" }} />
        </IconButton>
      )}
      {/* video mute */}
      {videoOpen
        ? videoChat && (
            <IconButton
              className="audio__video_mute_button m-2"
              variant="contained"
              size="small"
              onClick={handleVideoMute}
            >
              <VideocamIcon style={{ color: "gray" }} />
            </IconButton>
          )
        : videoChat && (
            <IconButton
              className="audio__video_mute_button m-2"
              variant="contained"
              size="small"
              onClick={handleVideoMute}
            >
              <VideocamOffIcon style={{ color: "gray" }} />
            </IconButton>
          )}
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
