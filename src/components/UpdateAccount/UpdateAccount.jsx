import { Avatar, IconButton } from "@mui/material";
import React from "react";
import "./UpdateAccount.css";
import { useForm } from "react-hook-form";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import { TextField } from "@material-ui/core";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const UpdateAccount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <div className="update__account">
      <div className="d-flex justify-content-center align-items-center my-4">
        <IconButton style={{ position: "relative" }}>
          <Avatar style={{ width: "10rem", height: "10rem" }} />
          <CameraAltIcon className="camera__icon" size="small" />
        </IconButton>
      </div>
      <div className="form__container">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              style={{ color: "white" }}
              label="Birth Day"
              inputFormat="MM/dd/yyyy"
              value={new Date().toUTCString()}
              onChange
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <input
            className="form__input mb-3 mt-2"
            defaultValue="Tanvin Ahmed"
            {...register("name", { required: true })}
            placeholder="Name"
          />
          {errors.name && <span>This field is required</span>}
          <button type="submit" className="update__submit">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccount;
