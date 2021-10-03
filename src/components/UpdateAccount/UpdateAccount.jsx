import { Avatar, IconButton } from "@mui/material";
import React, { useState } from "react";
import "./UpdateAccount.css";
import { useForm } from "react-hook-form";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import { TextField } from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import ImageCropModal from "../ImageCropModal/ImageCropModal";
import { useDispatch, useSelector } from "react-redux";
import { profileUpdate } from "../../app/actions/userAction";

const UpdateAccount = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.userInfo,
  }));
  const [chosenImg, setChosenImg] = useState({});
  const [openImageCropModal, setOpenImageCropModal] = useState(false);
  const [birthday, setBirthday] = useState(null);
  const [croppedImgUrl, setCroppedImgUrl] = useState(null);
  const [blob, setBlob] = useState(null);
  const [gender, setGender] = useState("");
  const [relationship, setRelationship] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleChosenImg = (file) => {
    file.url = URL.createObjectURL(file);
    setChosenImg(file);
    setOpenImageCropModal(true);
  };

  const onSubmit = (data) => {
    const profileInfo = {
      _id: userInfo._id,
      displayName: data.name ? data.name : userInfo.displayName,
      religion: data.religion ? data.religion : userInfo.religion,
      gender: gender ? gender : userInfo.gender,
      birthday: birthday ? birthday : userInfo.birthday,
      relationshipStatus: relationship
        ? relationship
        : userInfo.relationshipStatus,
      nationality: data.nationality ? data.nationality : userInfo.nationality,
    };
    const pic = new FormData();
    if (blob) {
      pic.append("file", blob);
      pic.append("photoId", userInfo.photoId);
      pic.append("_id", userInfo._id);
      if (
        data.name ||
        data.religion ||
        data.nationality ||
        gender ||
        relationship ||
        birthday
      ) {
        dispatch(profileUpdate(pic, profileInfo));
      } else {
        dispatch(profileUpdate(pic, ""));
      }
    } else {
      if (
        data.name ||
        data.religion ||
        data.nationality ||
        gender ||
        relationship ||
        birthday
      ) {
        dispatch(profileUpdate("", profileInfo));
      } else {
        dispatch(profileUpdate("", ""));
      }
    }
  };
  return (
    <div className="update__account">
      <div className="d-flex justify-content-center align-items-center my-4">
        <IconButton
          onChange={(e) => handleChosenImg(e.target.files[0])}
          style={{ position: "relative" }}
        >
          <input type="file" name="file" accept="image/*" id="image" />
          <label style={{ cursor: "pointer" }} htmlFor="image">
            <Avatar
              src={
                croppedImgUrl ||
                `http://localhost:5000/user/account/get-profile-img/${userInfo?.photoId}`
              }
              style={{ width: "10rem", height: "10rem" }}
            />
            <EditIcon className="camera__icon" size="small" />
          </label>
        </IconButton>
      </div>
      <div className="form__container">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              style={{ color: "white" }}
              label="Birth Day"
              inputFormat="MM/dd/yyyy"
              value={new Date(userInfo.birthday)}
              onChange={(value) => setBirthday(value)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <input
            className="form__input mb-3 mt-2"
            defaultValue={userInfo?.displayName}
            {...register("name", { required: true })}
            placeholder="Name"
          />
          {errors.name && <span>This field is required</span>}
          <input
            className="form__input mb-3 mt-2"
            defaultValue={userInfo?.religion}
            {...register("religion")}
            placeholder="Religion"
          />
          <input
            className="form__input mb-3 mt-2"
            defaultValue={userInfo.nationality}
            {...register("nationality")}
            placeholder="Nationality"
          />
          <div className="d-flex justify-content-around align-items-center my-2">
            <select
              onChange={(e) => setGender(e.target.value)}
              className="mx-3 update__select"
              value={gender || userInfo.gender}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            <select
              onChange={(e) => setRelationship(e.target.value)}
              className="mx-3 update__select"
              value={relationship || userInfo.relationshipStatus}
            >
              <option value="">Relationship status</option>
              <option value="Single">Single</option>
              <option value="In a relationship">In a relationship</option>
              <option value="Engaged">Engaged</option>
              <option value="Married">Married</option>
              <option value="Divorce">Divorce</option>
              <option value="It's complicated">It's complicated</option>
            </select>
          </div>
          <button type="submit" className="update__submit">
            Update Profile
          </button>
        </form>
      </div>
      {openImageCropModal && (
        <ImageCropModal
          style={{ zIndex: "100" }}
          chosenImg={chosenImg}
          setOpenImageCropModal={setOpenImageCropModal}
          setCroppedImgUrl={setCroppedImgUrl}
          setBlob={setBlob}
        />
      )}
    </div>
  );
};

export default UpdateAccount;
