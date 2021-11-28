import React from "react";
import "./ImagePreview.css";
import SendIcon from "@mui/icons-material/Send";
import { setWebcamCapture } from "../../../app/actions/webcamAction";
import { uploadFiles, setMessage } from "../../../app/actions/messageAction";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useHistory, useParams } from "react-router";

const ImagePreview = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { id } = useParams();

	const { image, roomId, userInfo } = useSelector(state => ({
		image: state.webcamReducer.image,
		roomId: state.messageReducer.roomId,
		userInfo: state.userReducer.userInfo,
	}));

	const _base64ToArrayBuffer = base64 => {
		var binary_string = window.atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	};

	const handleSendImage = () => {
		fetch(image)
			.then(res => res.blob())
			.then(blob => {
				const imgData = new FormData();
				imgData.append("file", blob);
				imgData.append("id", roomId);
				imgData.append("sender", userInfo?.email);
				imgData.append("status", "unseen");
				imgData.append("timeStamp", new Date().toUTCString());
				dispatch(uploadFiles(imgData));
				dispatch(setWebcamCapture(null));
			})
			.catch(error => {
				console.log(error.message);
			});

		const message = {
			url: image,
			contentType: "image/jpeg",
			name: `${Date.now()}.jpeg`,
			sender: userInfo?.email,
		};

		dispatch(setMessage(message));
		history.push(`/chat/${id}`);
	};
	return (
		<section className="ImagePreview">
			<img className="image__view" src={image} alt="" />
			<IconButton
				fontSize="small"
				style={{ background: "rgb(236, 32, 83)" }}
				onClick={() => {
					dispatch(setWebcamCapture(null));
					history.goBack();
				}}
				className="close__webcam"
			>
				<CloseIcon style={{ color: "white" }} fontSize="small" />
			</IconButton>

			<IconButton
				fontSize="small"
				style={{ background: "dodgerblue" }}
				onClick={handleSendImage}
				className="send__image"
			>
				<SendIcon style={{ color: "white" }} fontSize="small" />
			</IconButton>
		</section>
	);
};

export default ImagePreview;
