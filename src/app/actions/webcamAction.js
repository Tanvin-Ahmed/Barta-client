import { SET_WEBCAM_OPEN, SET_CAPTURED_IMAGE } from "../types";

export const setWebcamOpen = (bool) => {
  return {
    type: SET_WEBCAM_OPEN,
    payload: bool,
  };
};

export const setWebcamCapture = (imgData) => {
  return {
    type: SET_CAPTURED_IMAGE,
    payload: imgData,
  };
};
