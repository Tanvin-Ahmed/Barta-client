import { IconButton } from "@mui/material";
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uploadFiles, setMessage } from "../../../app/actions/messageAction";
import CloseIcon from "@mui/icons-material/Close";
import {
	setRecordedChunks,
	setVideoBlob,
	setVideoUrl,
} from "../../../app/actions/webcamAction";
import "./VideoPreview.css";
import SendIcon from "@mui/icons-material/Send";
import { useHistory } from "react-router";
import { setCallTimer } from "../../../app/actions/privateCallAction";

const VideoPreview = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { videoBlob, roomId, userInfo, videoUrl } = useSelector(state => ({
		videoBlob: state.webcamReducer.videoBlob,
		roomId: state.messageReducer.roomId,
		userInfo: state.userReducer.userInfo,
		videoUrl: state.webcamReducer.videoUrl,
	}));

	const sendVideoInDB = useCallback(() => {
		const videoData = new FormData();
		videoData.append("file", videoBlob);
		videoData.append("id", roomId);
		videoData.append("sender", userInfo?.email);
		videoData.append("status", "unseen");
		videoData.append("timeStamp", new Date().toUTCString());
		dispatch(uploadFiles(videoData));

		const message = {
			url: URL.createObjectURL(videoBlob),
			contentType: "video/webm",
			name: `${Date.now()}.webm`,
			sender: userInfo?.email,
		};
		dispatch(setMessage(message));
		dispatch(setRecordedChunks([]));
		dispatch(setVideoBlob(null));
		history.push(`/chat/${roomId}`);
	}, [videoBlob, dispatch, roomId, userInfo, history]);

	const handleClose = useCallback(() => {
		dispatch(
			setCallTimer({
				s: 0,
				m: 0,
				h: 0,
			})
		);
		dispatch(setVideoUrl(""));
		dispatch(setVideoBlob(null));
		history.goBack();
	}, [dispatch, history]);

	return (
		<section className="videoPreview">
			<video
				className="view_video"
				src={videoUrl}
				playsInline
				autoPlay
				controls
			></video>
			<div className="button_group">
				<IconButton
					fontSize="small"
					className="close_btn"
					style={{ background: "rgb(236, 32, 83)" }}
					onClick={handleClose}
				>
					<CloseIcon style={{ color: "white" }} fontSize="small" />
				</IconButton>
				<IconButton
					fontSize="small"
					className="send_btn"
					style={{ background: "dodgerblue" }}
					onClick={sendVideoInDB}
				>
					<SendIcon style={{ color: "white" }} fontSize="small" />
				</IconButton>
			</div>
		</section>
	);
};

export default VideoPreview;
