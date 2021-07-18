import React from "react";
import { IconButton } from "@material-ui/core";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import CloseIcon from "@material-ui/icons/Close";
import "./PrivateVideoCall.css";
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
      {videoOpen ? (
        <IconButton
          className="audio__video_mute_button m-2"
          variant="contained"
          size="small"
          onClick={handleVideoMute}
        >
          <VideocamIcon style={{ color: "gray" }} />
        </IconButton>
      ) : (
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
        <IconButton
          className="receive_button m-2"
          variant="contained"
          size="small"
          onClick={answerCall}
        >
          <PhoneInTalkIcon style={{ color: "dodgerblue" }} />
        </IconButton>
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

// <div className="button__group d-flex justify-content-center align-items-center flex-wrap">
//   {/* voice mute */}
//   {voiceOpen ? (
//     <Button
//       variant="contained"
//       color="default"
//       size="large"
//       startIcon={<MicIcon />}
//       className="m-2"
//       onClick={handleAudioMute}
//     ></Button>
//   ) : (
//     <Button
//       variant="contained"
//       color="default"
//       size="large"
//       startIcon={<MicOffIcon />}
//       className="m-2"
//       onClick={handleAudioMute}
//     ></Button>
//   )}
//   {/* video mute */}
//   {videoOpen ? (
//     <Button
//       variant="contained"
//       color="default"
//       size="large"
//       startIcon={<VideocamIcon />}
//       className="m-2"
//       onClick={handleVideoMute}
//     ></Button>
//   ) : (
//     <Button
//       variant="contained"
//       color="default"
//       size="large"
//       startIcon={<VideocamOffIcon />}
//       className="m-2"
//       onClick={handleVideoMute}
//     ></Button>
//   )}
//   {/* call end */}
//   {receivingCall && !callAccepted ? (
//     <Button
//       variant="contained"
//       color="primary"
//       size="large"
//       startIcon={<PhoneInTalkIcon />}
//       className="m-2"
//       onClick={answerCall}
//     ></Button>
//   ) : (
//     <Button
//       variant="contained"
//       color="secondary"
//       size="large"
//       startIcon={<CloseIcon />}
//       className="m-2"
//       onClick={leaveCall}
//     ></Button>
//   )}
// </div>
