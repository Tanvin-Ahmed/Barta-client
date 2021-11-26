import React from 'react';
import './ImagePreview.css';
import SendIcon from '@mui/icons-material/Send';
import { setWebcamCapture } from '../../../app/actions/webcamAction';
import { uploadFiles, setMessage } from '../../../app/actions/messageAction';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from 'react-router';

const ImagePreview = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { image, roomId, userInfo } = useSelector((state) => ({
		image: state.webcamReducer.image,
		roomId: state.messageReducer.roomId,
		userInfo: state.userReducer.userInfo
	}));

    	const handleSendImage = () => {
		const imgData = new FormData();
		imgData.append('file', image);
		imgData.append('id', roomId);
		imgData.append("sender", userInfo?.email);
		imgData.append('status', 'unseen');
		imgData.append('timeStamp', new Date().toUTCString());

		const message = {
			url: image,
			contentType: 'image/jpeg',
			name: `${Date.now()}.jpeg`,
			sender: userInfo?.email,
		};

		dispatch(setMessage(message));
		dispatch(uploadFiles(imgData));
		dispatch(setWebcamCapture(null));
	};
	return (
		<section className="ImagePreview">
			<img className="image__view" src={image} alt="" />
			<IconButton
				fontSize="small"
				style={{ background: 'rgb(236, 32, 83)' }}
				onClick={() => {
					dispatch(setWebcamCapture(null));
                    history.goBack();
				}}
				className="close__webcam"
			>
				<CloseIcon style={{ color: 'white' }} fontSize="small" />
			</IconButton>

			<IconButton
				fontSize="small"
				style={{ background: 'dodgerblue' }}
				onClick={handleSendImage}
				className="send__image"
			>
				<SendIcon style={{ color: 'white' }} fontSize="small" />
			</IconButton>
		</section>
	);
};

export default ImagePreview;
