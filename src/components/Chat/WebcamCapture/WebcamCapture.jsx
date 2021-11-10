import React, { useRef, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import Webcam from "react-webcam";
import { setWebcamOpen } from "../../../app/actions/messageAction";
import "./WebcamCapture.css";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const videoConstraints = {
  height: "100%",
  width: "100%",
  facingMode: "user",
};

const WebcamCapture = () => {
  const dispatch = useDispatch();
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleWebcam = () => {
    dispatch(setWebcamOpen(false));
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  return (
    <div className="webCamCapture">
      <Webcam
        audio={false}
        height={videoConstraints.height}
        ref={webcamRef}
        screenShotFormat="image/jpeg"
        width={videoConstraints.width}
        videoConstraints={videoConstraints}
      />
      <button onClick={handleWebcam}>close</button>
      <RadioButtonUncheckedIcon
        className="webcam__button"
        onClick={capture}
        fontSize="large"
        style={{ color: "white", cursor: "pointer" }}
      />

      <img src={image} alt="" style={{ height: "100px", width: "100px" }} />
    </div>
  );
};

export default WebcamCapture;
