import {
	SET_WEBCAM_OPEN,
	SET_CAPTURED_IMAGE,
	SET_IMAGE_VIEW,
	TOGGLE_CAMERA,
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
