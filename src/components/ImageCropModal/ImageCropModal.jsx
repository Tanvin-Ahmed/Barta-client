import React, { useState } from "react";
import Cropper from "react-easy-crop";
import "./ImageCropModal.css";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ReplayIcon from "@mui/icons-material/Replay";
import getCroppedImg, { getCroppedImage } from "./cropImage";

// const aspectRatios = [
//   { value: 4 / 3, text: "Perfect" },
//   { value: 16 / 9, text: "16/9" },
//   { value: 1 / 2, text: "1/2" },
// ];

const ImageCropModal = ({
  chosenImg,
  setOpenImageCropModal,
  setCroppedImgUrl,
  setBlob,
}) => {
  const [chosenImage] = useState(chosenImg);
  if (!chosenImage.zoomInit) {
    chosenImage.zoomInit = 1;
  }
  if (!chosenImage.cropInit) {
    chosenImage.cropInit = { x: 0, y: 0 };
  }
  //   if (!chosenImg.aspectInit) {
  //     chosenImg.aspectInit = 1;
  //   }

  const [zoom, setZoom] = useState(chosenImage.zoomInit);
  const [crop, setCrop] = useState(chosenImage.cropInit);
  //   const [aspect, setAspect] = useState(chosenImg.aspectInit);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };
  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  //   const onAspectChange = (e) => {
  //     const value = e.target.value;
  //     const ratio = aspectRatios.find((ratio) => ratio.value == value);
  //     setAspect(ratio);
  //   };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onCrop = async () => {
    const cropImageUrl = await getCroppedImg(
      chosenImage.url,
      croppedAreaPixels
    );
    setCroppedImgUrl(cropImageUrl);
    setOpenImageCropModal(false);
    const blob = await getCroppedImage(chosenImg, croppedAreaPixels);
    setBlob(blob);
  };

  return (
    <div className="crop">
      <div className="back__drop" />
      <div className="crop__container">
        <Cropper
          image={chosenImage?.url}
          zoom={zoom}
          crop={crop}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
          cropShape="round"
          showGrid={false}
        />
      </div>
      <div className="controls">
        <div className="controls_upper_area">
          <input
            type="range"
            min={1}
            step={0.1}
            value={zoom}
            onInput={(e) => onZoomChange(e.target.value)}
            className="slider"
          />
          {/* <select onChange={onAspectChange}>
            {aspectRatios.map((ratio, index) => (
              <option
                value={ratio.value}
                key={index}
                selected={ratio.value === aspect.value}
              >
                {ratio.text}
              </option>
            ))}
          </select> */}
        </div>
        <div className="button__area">
          <IconButton
            onClick={() => setOpenImageCropModal(false)}
            size="small"
            style={{ background: "rgba(255, 0, 0, 0.801)", margin: "0 1rem" }}
          >
            <ClearIcon size="small" sx={{ color: "white" }} />
          </IconButton>
          <IconButton
            size="small"
            style={{ background: "rgb(255, 157, 0)", margin: "0 1rem" }}
          >
            <ReplayIcon size="small" sx={{ color: "white" }} />
          </IconButton>
          <IconButton
            onClick={onCrop}
            size="small"
            style={{ background: "rgb(7, 204, 0)", margin: "0 1rem" }}
          >
            <DoneIcon size="small" sx={{ color: "white" }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
