import {
	SET_CAPTURED_IMAGE,
	SET_IMAGE_VIEW,
	SET_WEBCAM_OPEN,
	TOGGLE_CAMERA,
} from "../types";

const initialState = {
	image: null,
	openImageView: false,
	frontCamera: true,
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
		default:
			return state;
	}
};

export default webcamReducer;
