import { Avatar, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
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
import CircularProgress from "@material-ui/core/CircularProgress";
import { useParams } from "react-router";

const UpdateAccount = () => {
	const { identity } = useParams();
	const dispatch = useDispatch();
	const { userInfo, profileUpdateSpinner, groupInfo, userInfoSpinner } =
		useSelector(state => ({
			userInfo: state.userReducer.userInfo,
			profileUpdateSpinner: state.userReducer.profileUpdateSpinner,
			groupInfo: state.userReducer.groupInfo,
			userInfoSpinner: state.userReducer.userInfoSpinner,
		}));
	const [chosenImg, setChosenImg] = useState({});
	const [openImageCropModal, setOpenImageCropModal] = useState(false);
	const [birthday, setBirthday] = useState(new Date());
	const [croppedImgUrl, setCroppedImgUrl] = useState(null);
	const [blob, setBlob] = useState(null);
	const [gender, setGender] = useState("");
	const [relationship, setRelationship] = useState("");
	const [photoIdURL, setPhotoIdURL] = useState("");
	const [message, setMessage] = useState({});

	useEffect(() => {
		setBirthday(userInfo?.birthday);
	}, [userInfo]);

	useEffect(() => {
		let url;
		if (JSON.parse(sessionStorage.getItem("barta/groupId"))?.groupId) {
			url = `https://barta-the-real-time-chat-app.herokuapp.com/groupAccount/get-profile-img/${groupInfo?.photoId}`;
		} else {
			url = `https://barta-the-real-time-chat-app.herokuapp.com/user/account/get-profile-img/${userInfo?.photoId}`;
		}
		setPhotoIdURL(url);
	}, [groupInfo, userInfo]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const handleChosenImg = file => {
		setChosenImg({});
		file.url = URL.createObjectURL(file);
		setChosenImg(file);
		setOpenImageCropModal(true);
	};

	const onSubmit = data => {
		if (!birthday) return alert("Birthday is required");
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
				(data.name.trim() && data.name !== userInfo?.displayName) ||
				(data.religion.trim() && data.religion !== userInfo?.religion) ||
				(data.nationality.trim() &&
					data.nationality !== userInfo?.nationality) ||
				gender !== userInfo?.gender ||
				relationship !== userInfo?.relationshipStatus ||
				(birthday.trim() && birthday !== userInfo?.birthday)
			) {
				dispatch(profileUpdate(pic, profileInfo, setMessage));
			} else {
				dispatch(profileUpdate(pic, "", setMessage));
			}
		} else {
			if (
				(data.name.trim() && data.name !== userInfo?.displayName) ||
				(data.religion.trim() && data.religion !== userInfo?.religion) ||
				(data.nationality.trim() &&
					data.nationality !== userInfo?.nationality) ||
				gender !== userInfo?.gender ||
				relationship !== userInfo?.relationshipStatus ||
				(birthday.trim() && birthday !== userInfo?.birthday)
			) {
				dispatch(profileUpdate("", profileInfo, setMessage));
			}
		}
	};

	const onGroupSubmit = data => {
		const groupName = data.name + "◉_◉" + groupInfo?.groupName?.split("◉_◉")[1];
		const updatedData = {
			_id: groupInfo?._id,
			groupName,
		};

		if (blob) {
			const pic = new FormData();
			pic.append("file", blob);
			pic.append("photoId", groupInfo.photoId);
			pic.append("_id", groupInfo._id);

			if (groupName.trim() && groupName !== groupInfo?.groupName) {
				dispatch(profileUpdate(pic, updatedData, setMessage));
			} else {
				dispatch(profileUpdate(pic, "", setMessage));
			}
		} else {
			if (groupName.trim() && groupName !== groupInfo?.groupName) {
				dispatch(profileUpdate("", updatedData, setMessage));
			}
		}
	};

	return (
		<div className="update__account">
			{userInfoSpinner && (
				<>
					<div className="back__drop" />
					<div className="loading__spinner">
						<CircularProgress style={{ color: "rgb(55, 26, 134)" }} />
					</div>
				</>
			)}
			<div className="d-flex justify-content-center align-items-center my-4">
				<IconButton
					onChange={e => handleChosenImg(e.target.files[0])}
					style={{ position: "relative" }}
				>
					<input type="file" name="file" accept="image/*" id="image" />
					<label style={{ cursor: "pointer" }} htmlFor="image">
						<Avatar
							src={croppedImgUrl || photoIdURL}
							style={{ width: "10rem", height: "10rem" }}
						/>
						<EditIcon className="camera__icon" size="small" />
					</label>
				</IconButton>
			</div>
			<div className="form__container">
				<form
					className="form"
					onSubmit={
						identity === "userAccount"
							? handleSubmit(onSubmit)
							: handleSubmit(onGroupSubmit)
					}
				>
					{identity === "userAccount" && (
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DesktopDatePicker
								style={{ color: "white" }}
								label="Birth Day"
								inputFormat="MM/dd/yyyy"
								value={birthday}
								onChange={value => setBirthday(value)}
								renderInput={params => <TextField {...params} />}
							/>
						</LocalizationProvider>
					)}
					<input
						className="form__input mb-3 mt-2"
						defaultValue={
							identity === "userAccount"
								? userInfo?.displayName
								: groupInfo?.groupName
						}
						{...register("name", { required: true })}
						placeholder="Name"
					/>
					{errors.name && <span>This field is required</span>}
					{identity === "userAccount" && (
						<>
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
									onChange={e => setGender(e.target.value)}
									className="mx-3 update__select"
									value={gender || userInfo.gender}
								>
									<option value="">Gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Others">Others</option>
								</select>
								<select
									onChange={e => setRelationship(e.target.value)}
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
						</>
					)}
					<button type="submit" className="update__submit">
						Update Profile
					</button>
				</form>
				{profileUpdateSpinner && (
					<div className="d-flex justify-content-center align-items-center mt-3">
						<CircularProgress style={{ color: "rgb(150, 118, 255)" }} />
					</div>
				)}
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
