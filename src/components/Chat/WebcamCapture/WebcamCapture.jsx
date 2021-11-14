import React, { useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Webcam from "react-webcam";
import "./WebcamCapture.css";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  setWebcamCapture,
  setWebcamOpen,
} from "../../../app/actions/webcamAction";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const videoConstraints = {
  height: "100%",
  width: "100%",
  facingMode: "user",
};

const WebcamCapture = () => {
  const dispatch = useDispatch();
  const webcamRef = useRef(null);
  const [openImageView, setOpenImageView] = useState(false);

  const { image } = useSelector((state) => ({
    image: state.webcamReducer.image,
  }));

  const handleWebcam = () => {
    dispatch(setWebcamOpen(false));
    dispatch(setWebcamCapture(null));
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    dispatch(setWebcamCapture(imageSrc));
    setOpenImageView(true);
  }, [webcamRef, dispatch]);

  const handleSendImage = () => {};

  return (
    <section className="webCamCapture">
      {openImageView ? (
        <div>
          <img className="image__view" src={image} alt="" />
          <IconButton
            fontSize="small"
            style={{ background: "rgb(236, 32, 83)" }}
            onClick={() => {
              setOpenImageView(false);
              dispatch(setWebcamCapture(null));
            }}
            className="close__webcam"
          >
            <CloseIcon style={{ color: "white" }} fontSize="small" />
          </IconButton>

          <IconButton
            fontSize="small"
            style={{ background: "dodgerblue" }}
            onClick={handleSendImage}
            className="send__image"
          >
            <SendIcon style={{ color: "white" }} fontSize="small" />
          </IconButton>
        </div>
      ) : (
        <div>
          <Webcam
            audio={false}
            height={videoConstraints.height}
            ref={webcamRef}
            screenShotFormat="image/jpeg"
            width={videoConstraints.width}
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
        </div>
      )}
    </section>
  );
};

export default WebcamCapture;
