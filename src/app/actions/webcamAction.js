import {
	SET_CAPTURED_IMAGE,
	SET_IMAGE_VIEW,
	TOGGLE_CAMERA,
	SET_WEBCAM_MOOD,
	OPEN_CAMERA_MOOD_CHANGE_OPTION,
	CAPTURING_VIDEO,
	SET_RECORDED_CHUNKS,
	SET_VIDEO_BLOB,
	SET_VIDEO_URL,
} from "../types";

export const setWebcamCapture = imgData => {
	return {
		type: SET_CAPTURED_IMAGE,
		payload: imgData,
	};
};

export const setOpenImageView = bool => {
	return {
		type: SET_IMAGE_VIEW,
		payload: bool,
	};
};

export const setCamera = bool => {
	return {
		type: TOGGLE_CAMERA,
		payload: bool,
	};
};

export const setCameraMood = mood => {
	return {
		type: SET_WEBCAM_MOOD,
		payload: mood,
	};
};

export const setOpenCameraMoodOption = bool => {
	return {
		type: OPEN_CAMERA_MOOD_CHANGE_OPTION,
		payload: bool,
	};
};

export const setCapturingVideo = bool => {
	return {
		type: CAPTURING_VIDEO,
		payload: bool,
	};
};

export const setRecordedChunks = data => {
	return {
		type: SET_RECORDED_CHUNKS,
		payload: data,
	};
};

export const setVideoBlob = blob => {
	return {
		type: SET_VIDEO_BLOB,
		payload: blob,
	};
};

export const setVideoUrl = url => {
	return {
		type: SET_VIDEO_URL,
		payload: url,
	};
};
