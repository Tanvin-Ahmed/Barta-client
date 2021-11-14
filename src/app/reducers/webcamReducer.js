import { SET_CAPTURED_IMAGE, SET_WEBCAM_OPEN } from "../types";

const initialState = {
  webcamIsOpen: false,
  image: null,
};

const webcamReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WEBCAM_OPEN:
      return {
        ...state,
        webcamIsOpen: action.payload,
      };

    case SET_CAPTURED_IMAGE:
      return {
        ...state,
        image: action.payload,
      };
    default:
      return state;
  }
};

export default webcamReducer;
