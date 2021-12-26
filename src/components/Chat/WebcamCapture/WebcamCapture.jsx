import React, { useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./WebcamCapture.css";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
	setWebcamCapture,
	setCamera,
	setCameraMood,
	setOpenCameraMoodOption,
	setCapturingVideo,
	setRecordedChunks,
	setVideoBlob,
	setVideoUrl,
} from "../../../app/actions/webcamAction";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Webcam from "react-webcam";
import { useLocation, useHistory } from "react-router";
import { useSelector } from "react-redux";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import StopIcon from "@mui/icons-material/Stop";
import { start, end } from "../PrivateCallSystem/timer";
import Timer from "../PrivateCallSystem/Timer.jsx";
import { setCallTimer } from "../../../app/actions/privateCallAction";

const videoConstraints = {
	height: "100%",
	width: "100%",
	facingMode: "user",
};

const WebcamCapture = () => {
	const dispatch = useDispatch();
	const { pathname } = useLocation();
	const webcamRef = useRef(null);
	const history = useHistory();
	const cameraInfoRef = useRef([]);
	const mediaRecorderRef = useRef(null);
	const {
		frontCamera,
		cameraMood,
		openCameraMoodOption,
		capturingVideo,
		recordedChunks,
		timer,
		interVal,
	} = useSelector(state => ({
		frontCamera: state.webcamReducer.frontCamera,
		cameraMood: state.webcamReducer.cameraMood,
		openCameraMoodOption: state.webcamReducer.openCameraMoodOption,
		capturingVideo: state.webcamReducer.capturingVideo,
		recordedChunks: state.webcamReducer.recordedChunks,
		timer: state.privateCall.timer,
		interVal: state.privateCall.interVal,
	}));

	useEffect(() => {
		dispatch(setWebcamCapture(null));
	}, [dispatch]);

	//get total camera of device
	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then(devices => {
			for (let i = 0; i < devices.length; i++) {
				const deviceInfo = devices[i];
				if (deviceInfo.kind === "videoinput") {
					cameraInfoRef.current.push(deviceInfo.deviceId);
				}
			}
		});
	}, []);

	// set webcam condition to open
	useEffect(() => {
		if (cameraInfoRef.current.length > 1) {
			if (frontCamera) {
				videoConstraints.facingMode = "user";
			} else {
				videoConstraints.facingMode = "environment";
			}
		}
	}, [cameraInfoRef, frontCamera]);

	useEffect(() => {
		dispatch(setRecordedChunks([]));
		dispatch(setCapturingVideo(false));
		dispatch(setCameraMood("image"));
		dispatch(setOpenCameraMoodOption(false));
		dispatch(
			setCallTimer({
				s: 0,
				m: 0,
				h: 0,
			})
		);
		dispatch(setVideoUrl(""));
		dispatch(setVideoBlob(null));
	}, [dispatch]);

	const handleWebcam = () => {
		if (recordedChunks?.length) {
			dispatch(setRecordedChunks([]));
			dispatch(setCapturingVideo(false));
		}
		dispatch(setCameraMood("image"));
		dispatch(setOpenCameraMoodOption(false));
		history.goBack();
	};

	// photo capture
	const capture = useCallback(() => {
		const imageSrc = webcamRef.current.getScreenshot();
		dispatch(setWebcamCapture(imageSrc));
		history.push(`${pathname}/preview`);
	}, [dispatch, history, pathname]);

	const switchCamera = useCallback(() => {
		dispatch(setCamera(!frontCamera));
	}, [dispatch, frontCamera]);

	const handleOpenCameraMoodOption = () => {
		dispatch(setOpenCameraMoodOption(true));
		setTimeout(() => dispatch(setOpenCameraMoodOption(false)), 10000);
	};

	// video record
	const handleDataAvailable = useCallback(
		({ data }) => {
			if (data?.size > 0) {
				dispatch(setRecordedChunks(recordedChunks.concat(data)));
			}
		},
		[dispatch, recordedChunks]
	);

	const handleStartCaptureVideo = useCallback(() => {
		dispatch(setCapturingVideo(true));
		mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
			mimeType: "video/webm",
		});
		mediaRecorderRef.current.addEventListener(
			"dataavailable",
			handleDataAvailable
		);
		mediaRecorderRef.current.start();
		start(timer, dispatch);
	}, [dispatch, webcamRef, mediaRecorderRef, handleDataAvailable, timer]);

	const handleStopeCaptureVideo = useCallback(() => {
		dispatch(setCapturingVideo(false));
		mediaRecorderRef.current.stop();
		end(interVal);
	}, [dispatch, mediaRecorderRef, interVal]);

	const saveForPreview = useCallback(() => {
		if (recordedChunks?.length) {
			const blob = new Blob(recordedChunks, {
				type: "video/webm",
			});
			const url = URL.createObjectURL(blob);
			dispatch(setVideoBlob(blob));
			dispatch(setVideoUrl(url));
			history.push(`${pathname}/videoPreview`);
		}
	}, [recordedChunks, dispatch, history, pathname]);

	// mute webcam video tag
	useEffect(() => {
		document.getElementsByTagName("video")[0].muted = true;
	}, []);

	return (
		<section className="webCamCapture">
			<div
				className="optionShowLayer"
				onMouseMove={handleOpenCameraMoodOption}
			/>
			<Webcam
				audio={true}
				height={videoConstraints.height}
				width={videoConstraints.width}
				ref={webcamRef}
				screenshotFormat="image/jpeg"
				videoConstraints={videoConstraints}
			/>
			{(recordedChunks.length > 0 || capturingVideo) && (
				<div className="timer">
					<Timer timer={timer} />
				</div>
			)}
			{openCameraMoodOption && (
				<div className="webcamSwitchBtnGroup">
					<button
						type="button"
						className="imageBtn mx-2"
						onClick={() => dispatch(setCameraMood("image"))}
					>
						<small>Photo</small>
					</button>
					<button
						type="button"
						className="videoBtn mx-2"
						onClick={() => dispatch(setCameraMood("video"))}
					>
						<small>Video</small>
					</button>
				</div>
			)}
			<IconButton
				fontSize="small"
				style={{ background: "rgb(236, 32, 83)" }}
				onClick={handleWebcam}
				className="close__webcam"
			>
				<CloseIcon style={{ color: "white" }} fontSize="small" />
			</IconButton>
			{cameraMood === "image" ? (
				<IconButton
					onClick={capture}
					className="capture__image"
					style={{ background: "rgb(0, 140, 255)" }}
				>
					<RadioButtonUncheckedIcon
						className="webcam__button"
						fontSize="large"
						style={{ color: "white", cursor: "pointer" }}
					/>
				</IconButton>
			) : (
				<>
					{capturingVideo ? (
						<IconButton
							onClick={handleStopeCaptureVideo}
							className="capture__image"
							style={{ background: "rgb(255, 0, 34)" }}
						>
							<PauseCircleOutlineIcon
								className="webcam__button"
								fontSize="large"
								style={{ color: "white", cursor: "pointer" }}
							/>
						</IconButton>
					) : (
						<>
							<IconButton
								onClick={handleStartCaptureVideo}
								className="capture__image"
								style={{ background: "rgb(255, 0, 34)" }}
							>
								<RadioButtonUncheckedIcon
									className="webcam__button"
									fontSize="large"
									style={{ color: "white", cursor: "pointer" }}
								/>
							</IconButton>
							{recordedChunks?.length > 0 && (
								<IconButton
									onClick={saveForPreview}
									className="stop_icon"
									style={{ background: "rgb(255, 0, 34)" }}
								>
									<StopIcon
										className="webcam__button"
										fontSize="small"
										style={{ color: "white", cursor: "pointer" }}
									/>
								</IconButton>
							)}
						</>
					)}
				</>
			)}
			{cameraInfoRef.current.length > 1 && recordedChunks.length === 0 && (
				<IconButton onClick={switchCamera} className="switch__camera">
					<CameraswitchIcon
						className="webcam__button"
						fontSize="large"
						style={{ color: "white", cursor: "pointer" }}
					/>
				</IconButton>
			)}
		</section>
	);
};

export default WebcamCapture;
