import React, { useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./WebcamCapture.css";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { setWebcamCapture, setCamera } from "../../../app/actions/webcamAction";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Webcam from "react-webcam";
import { useLocation, useHistory } from "react-router";
import { useSelector } from "react-redux";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";

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
	const { frontCamera } = useSelector(state => ({
		frontCamera: state.webcamReducer.frontCamera,
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

	const handleWebcam = () => {
		history.goBack();
	};

	const capture = useCallback(() => {
		const imageSrc = webcamRef.current.getScreenshot();
		dispatch(setWebcamCapture(imageSrc));
		history.push(`${pathname}/preview`);
	}, [webcamRef, dispatch, history]);

	const switchCamera = () => {
		dispatch(setCamera(!frontCamera));
	};

	return (
		<section className="webCamCapture">
			<Webcam
				audio={false}
				height={videoConstraints.height}
				width={videoConstraints.width}
				ref={webcamRef}
				screenshotFormat="image/jpeg"
				videoConstraints={videoConstraints}
			/>
			<IconButton
				fontSize="small"
				style={{ background: "rgb(236, 32, 83)" }}
				onClick={handleWebcam}
				className="close__webcam"
			>
				<CloseIcon style={{ color: "white" }} fontSize="small" />
			</IconButton>
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
			{cameraInfoRef.current.length > 1 && (
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
