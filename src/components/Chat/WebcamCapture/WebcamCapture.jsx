import React, { useRef, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './WebcamCapture.css';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { setWebcamCapture } from '../../../app/actions/webcamAction';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Webcam from 'react-webcam';
import { useLocation, useHistory } from 'react-router';

const videoConstraints = {
	height: '100%',
	width: '100%',
	facingMode: 'user'
};

const WebcamCapture = () => {
	const dispatch = useDispatch();
	const { pathname } = useLocation();
	const webcamRef = useRef(null);
	const history = useHistory();

	useEffect(
		() => {
			dispatch(setWebcamCapture(null));
		},
		[ dispatch ]
	);

	const handleWebcam = () => {
		history.goBack();
	};

	const capture = useCallback(
		() => {
			const imageSrc = webcamRef.current.getScreenshot();
			dispatch(setWebcamCapture(imageSrc));
			history.push(`${pathname}/preview`);
		},
		[ webcamRef, dispatch, history ]
	);

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
				style={{ background: 'rgb(236, 32, 83)' }}
				onClick={handleWebcam}
				className="close__webcam"
			>
				<CloseIcon style={{ color: 'white' }} fontSize="small" />
			</IconButton>
			<IconButton onClick={capture} className="capture__image" style={{ background: 'rgb(0, 140, 255)' }}>
				<RadioButtonUncheckedIcon
					className="webcam__button"
					fontSize="large"
					style={{ color: 'white', cursor: 'pointer' }}
				/>
			</IconButton>
		</section>
	);
};

export default WebcamCapture;
