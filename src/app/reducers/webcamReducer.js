import {
	SET_CAPTURED_IMAGE,
	SET_IMAGE_VIEW,
	SET_WEBCAM_MOOD,
	TOGGLE_CAMERA,
	OPEN_CAMERA_MOOD_CHANGE_OPTION,
	CAPTURING_VIDEO,
	SET_RECORDED_CHUNKS,
	SET_VIDEO_BLOB,
	SET_VIDEO_URL,
} from "../types";

const initialState = {
	image: null,
	openImageView: false,
	frontCamera: true,
	cameraMood: "image",
	openCameraMoodOption: false,
	capturingVideo: false,
	recordedChunks: [],
	videoBlob: null,
	videoUrl: "",
};

const webcamReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_CAPTURED_IMAGE:
			return {
				...state,
				image: action.payload,
			};

		case SET_IMAGE_VIEW:
			return {
				...state,
				openImageView: action.payload,
			};
		case TOGGLE_CAMERA:
			return {
				...state,
				frontCamera: action.payload,
			};
		case SET_WEBCAM_MOOD:
			return {
				...state,
				cameraMood: action.payload,
			};
		case OPEN_CAMERA_MOOD_CHANGE_OPTION:
			return {
				...state,
				openCameraMoodOption: action.payload,
			};
		case CAPTURING_VIDEO:
			return {
				...state,
				capturingVideo: action.payload,
			};
		case SET_RECORDED_CHUNKS:
			return {
				...state,
				recordedChunks: action.payload,
			};
		case SET_VIDEO_BLOB:
			return {
				...state,
				videoBlob: action.payload,
			};
		case SET_VIDEO_URL:
			return {
				...state,
				videoUrl: action.payload,
			};
		default:
			return state;
	}
};

export default webcamReducer;
