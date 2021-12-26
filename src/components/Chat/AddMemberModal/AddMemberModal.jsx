import React, { useState } from "react";
import "./AddMemberModal.css";
import { useDispatch, useSelector } from "react-redux";
import {
	getAllUserInfo,
	addMemberInGroup,
} from "../../../app/actions/userAction";
import {
	Avatar,
	CardActionArea,
	IconButton,
	Tooltip,
	Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AddMemberModal = ({ setIsOpen, groupMembers }) => {
	const dispatch = useDispatch();
	const {
		allUserInfo,
		loading,
		userInfo,
		groupInfo,
		addMemberSpinner,
		completeAddMemberIcon,
		errorToUploadMemberIcon,
	} = useSelector(state => ({
		allUserInfo: state.userReducer.allUserInfo,
		loading: state.userReducer.loading,
		userInfo: state.userReducer.userInfo,
		groupInfo: state.userReducer.groupInfo,
		addMemberSpinner: state.userReducer.addMemberSpinner,
		completeAddMemberIcon: state.userReducer.completeAddMemberIcon,
		errorToUploadMemberIcon: state.userReducer.errorToUploadMemberIcon,
	}));

	const [selectedMembers, setSelectedMembers] = useState([]);

	const handleAddMembers = user => {
		const isAlreadyMember = groupMembers?.find(member => member === user.email);

		if (!isAlreadyMember) {
			const isSelected = selectedMembers.find(
				member => member._id === user._id
			);
			if (!isSelected) {
				setSelectedMembers([...selectedMembers, user]);
			}
		} else alert("Already member");
	};

	const handleRemoveMembers = id => {
		const newList = selectedMembers.filter(member => member._id !== id);
		setSelectedMembers(newList);
	};

	const submitMembersData = () => {
		const data = {
			_id: groupInfo?._id,
			members: selectedMembers,
		};
		dispatch(addMemberInGroup(data, setIsOpen));
	};

	return (
		<div className="back_view">
			<section className="AddMember__modal">
				<div className="container">
					<div className="d-flex justify-content-between align-items-center py-2">
						<h6>Select member</h6>
						<IconButton
							onClick={() => setIsOpen(false)}
							style={{
								backgroundColor: "red",
								height: "1.5rem",
								width: "1.5rem",
							}}
						>
							<CloseIcon size="small" style={{ color: "white" }} />
						</IconButton>
					</div>
					<input
						onChange={e => dispatch(getAllUserInfo(e.target.value))}
						type="text"
						placeholder="Search for member"
						className="form-control"
					/>
					{selectedMembers.length > 0 && (
						<div className="selectedMember__container p-1">
							{selectedMembers?.map(member => (
								<Tooltip
									key={member._id}
									title={member?.displayName}
									className="mx-2"
								>
									<Badge
										onClick={() => handleRemoveMembers(member._id)}
										color="primary"
										overlap="circular"
										badgeContent={
											<HighlightOffIcon
												style={{
													color: "#fff",
												}}
												size="small"
											/>
										}
									>
										<Avatar
											src={
												member?.photoURL
													? member.photoURL
													: `https://barta-the-real-time-chat-app.herokuapp.com/user/account/get-profile-img/${member?.photoId}`
											}
										/>
									</Badge>
								</Tooltip>
							))}
							<div className="text-center">
								<button className="btn btn-primary" onClick={submitMembersData}>
									Add{" "}
									{addMemberSpinner && (
										<CircularProgress
											style={{
												height: "0.9rem",
												width: "0.9rem",
												color: "white",
											}}
										/>
									)}
									{completeAddMemberIcon && (
										<CheckCircleIcon
											style={{
												height: "1rem",
												width: "1rem",
												color: "white",
											}}
										/>
									)}
									{errorToUploadMemberIcon && (
										<CloseIcon
											style={{
												height: "1rem",
												width: "1rem",
												color: "white",
											}}
										/>
									)}
								</button>
							</div>
						</div>
					)}
					<div className="list mt-3">
						{loading ? (
							<div className="d-flex justify-content-center align-items-center">
								<CircularProgress style={{ color: "rgb(150, 118, 255)" }} />
							</div>
						) : (
							allUserInfo
								?.filter(user => user?.email !== userInfo?.email)
								?.map(user => (
									<CardActionArea
										key={user._id}
										className="mt-2 p-2"
										onClick={() => handleAddMembers(user)}
									>
										<div className="d-flex align-items-center">
											<Avatar
												size="small"
												src={
													user?.PhotoURL
														? user.PhotoURL
														: `https://barta-the-real-time-chat-app.herokuapp.com/user/account/get-profile-img/${user?.photoId}`
												}
											/>
											<p className="ml-2">{user?.displayName}</p>
										</div>
									</CardActionArea>
								))
						)}
					</div>
				</div>
			</section>
			<div className="view" onClick={() => setIsOpen(false)} />
		</div>
	);
};

export default AddMemberModal;
