import "./ChatBar.css";
import PeopleIcon from "@material-ui/icons/People";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import {
	Avatar,
	Button,
	CardActionArea,
	IconButton,
	Menu,
} from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import Dropdown from "../DropdownMenu/Dropdown";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import path from "path";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BlockIcon from "@mui/icons-material/Block";
import { handleText } from "./chatBar_logic";
import time_ago from "time-ago";
import {
	addIdToCreateGroup,
	createGroupForFirst,
	deleteIdFromSelectedId,
	handleGroupInfo,
	handleReceiverInfo,
	handleSearchForFriend,
	openFriendListTab,
	openGroupListTab,
	openGroupMakingTab,
	openSearchToMakeFriendTab,
} from "./chatBar_logic";
import { Spinner } from "react-bootstrap";
import {
	setFinalStepToCreateGroup,
	setGroupName,
	removeFriend,
} from "../../app/actions/userAction";
import { useState } from "react";
import { MenuItem } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CallMadeIcon from "@material-ui/icons/CallMade";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import CallMissedOutgoingIcon from "@material-ui/icons/CallMissedOutgoing";
import CallMissedIcon from "@material-ui/icons/CallMissed";

export const ChatBarHeader = ({ userPhotoURL, photoId, name }) => {
	return (
		<div className="chatBar__header">
			<div className="d-flex align-items-center justify-content-between flex-wrap">
				<div className="avatar">
					<IconButton style={{ position: "relative" }}>
						<Avatar
							title={name}
							src={
								userPhotoURL
									? userPhotoURL
									: `https://git.heroku.com/barta-the-real-time-chat-app.git/user/account/get-profile-img/${photoId}`
							}
						/>
						<div className="onLine" />
					</IconButton>
				</div>
				<div className="text__center">
					<h3 className="text-center text-light">Barta</h3>
				</div>
				<div className="more__options">
					<Dropdown />
				</div>
			</div>
		</div>
	);
};

export const ChatList = ({
	friendList,
	history,
	spinnerForChatList,
	friendNotAvailable,
	largeScreen,
	userInfo,
	dispatch,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [removed, setRemoved] = useState(false);
	const [friendEmail, setFriendEmail] = useState("");

	const handleRemove = () => {
		const data = {
			userEmail: userInfo?.email,
			friendEmail: friendEmail,
		};
		removeFriend(data, setLoading, setError, setRemoved);
	};

	return (
		<div className="friendList__container">
			<div className="find__friend mt-3 sticky-top">
				<input
					onChange={e => setSearchTerm(e.target.value)}
					type="text"
					className="form-control"
					placeholder="Find Friend"
				/>
			</div>
			<div className="friend__list mt-2">
				{spinnerForChatList ? (
					<div className="chatBar__progress">
						<CircularProgress style={{ color: "rgb(18, 3, 45)" }} />
					</div>
				) : friendNotAvailable ? (
					<p className="friend__notAvailable">{friendNotAvailable}</p>
				) : (
					friendList
						?.filter(val => {
							if (searchTerm === "") {
								return val;
							} else if (
								val.displayName.toLowerCase().includes(searchTerm.toLowerCase())
							) {
								return val;
							}
						})
						?.map(friend => (
							<div className="d-flex justify-content-between align-items-center">
								<CardActionArea
									sx={{ padding: "0.5rem", marginBottom: "0.5rem" }}
									key={friend?._id}
									onClick={() => handleReceiverInfo(friend, history)}
									className="px-3 d-flex justify-content-start align-items-center text-light"
								>
									<div style={{ position: "relative" }} className="mr-3">
										<Avatar
											src={
												friend?.photoURL
													? friend?.photoURL
													: `https://git.heroku.com/barta-the-real-time-chat-app.git/user/account/get-profile-img/${friend?.photoId}`
											}
										/>
										<div
											className={
												friend?.status === "active" ? "onLine" : "d-none"
											}
										/>
									</div>
									<div>
										<h6 style={{ letterSpacing: "1px" }} className="mx-4 mb-0">
											{friend?.displayName}
										</h6>
										{friend?.lastMessage?.status ? (
											friend?.lastMessage?.files?.length > 0 ? (
												friend?.lastMessage?.files[0]?.contentType?.split(
													"/"
												)[0] === "image" ? (
													<div
														className={
															friend?.lastMessage?.sender !== userInfo?.email
																? friend?.lastMessage?.status === "unseen"
																	? "unseenMessage mx-4"
																	: "seenMessage mx-4"
																: "seenMessage mx-4"
														}
													>
														<small>Photo</small>
														<small className="ml-1">
															{time_ago.ago(
																friend?.lastMessage?.timeStamp,
																true
															)}
														</small>
													</div>
												) : friend?.lastMessage?.files[0]?.contentType?.split(
														"/"
												  )[0] === "video" ? (
													<div
														className={
															friend?.lastMessage?.sender !== userInfo?.email
																? friend?.lastMessage?.status === "unseen"
																	? "unseenMessage mx-4"
																	: "seenMessage mx-4"
																: "seenMessage mx-4"
														}
													>
														<small>Video</small>
														<small className="ml-1">
															{time_ago.ago(
																friend?.lastMessage?.timeStamp,
																true
															)}
														</small>
													</div>
												) : (
													friend?.lastMessage?.files[0]?.contentType?.split(
														"/"
													)[0] === "application" && (
														<div
															className={
																friend?.lastMessage?.sender !== userInfo?.email
																	? friend?.lastMessage?.status === "unseen"
																		? "unseenMessage mx-4"
																		: "seenMessage mx-4"
																	: "seenMessage mx-4"
															}
														>
															<small>
																{handleText(
																	friend?.lastMessage?.files[0]?.filename
																		?.split("_")
																		?.join(" ")
																		?.split("◉_◉")[0],
																	largeScreen
																) +
																	path.extname(
																		friend?.lastMessage?.files[0]?.filename
																	)}
															</small>
															<small className="ml-1">
																{time_ago.ago(
																	friend?.lastMessage?.timeStamp,
																	true
																)}
															</small>
														</div>
													)
												)
											) : (
												<div
													className={
														friend?.lastMessage?.sender !== userInfo?.email
															? friend?.lastMessage?.status === "unseen"
																? "unseenMessage mx-4"
																: "seenMessage mx-4"
															: "seenMessage mx-4"
													}
												>
													{friend?.lastMessage?.message ? (
														<div className="d-flex justify-content-between align-items-center">
															<small>
																{handleText(
																	friend?.lastMessage?.message,
																	largeScreen
																)}
															</small>
															<small className="ml-1">
																{time_ago.ago(
																	friend?.lastMessage?.timeStamp,
																	true
																)}
															</small>
														</div>
													) : (
														<div className="d-flex align-items-center">
															<small className="d-flex justify-content-center align-items-center">
																{friend?.lastMessage?.callDuration?.duration ? (
																	friend?.lastMessage?.sender ===
																	userInfo.email ? (
																		<CallMadeIcon
																			className="mr-2"
																			variant="contained"
																			size="small"
																			style={{ color: "blue" }}
																		/>
																	) : (
																		<CallReceivedIcon
																			className="mr-2"
																			variant="contained"
																			size="small"
																			style={{ color: "green" }}
																		/>
																	)
																) : friend?.lastMessage?.sender ===
																  userInfo.email ? (
																	<CallMissedOutgoingIcon
																		className="mr-2"
																		variant="contained"
																		size="small"
																		style={{ color: "red" }}
																	/>
																) : (
																	<CallMissedIcon
																		className="mr-2"
																		variant="contained"
																		size="small"
																		style={{ color: "red" }}
																	/>
																)}
																{friend?.lastMessage?.callDescription}
															</small>
															&nbsp; &nbsp;
															<small className="ml-1">
																{time_ago.ago(
																	friend?.lastMessage?.timeStamp,
																	true
																)}
															</small>
														</div>
													)}
												</div>
											)
										) : null}
									</div>
								</CardActionArea>
								{loading ? (
									friendEmail === friend?.email && (
										<CircularProgress
											style={{ color: "white", height: "1rem", width: "1rem" }}
										/>
									)
								) : error ? (
									friendEmail === friend?.email && (
										<HighlightOffIcon
											style={{
												color: "rgb(255, 166, 0)",
												height: "1rem",
												width: "1rem",
											}}
										/>
									)
								) : removed ? (
									friendEmail === friend?.email && (
										<CheckCircleOutlineIcon
											style={{ color: "red", height: "1rem", width: "1rem" }}
										/>
									)
								) : (
									<div onClick={() => setFriendEmail(friend?.email)}>
										<FriendMoreButton
											dispatch={dispatch}
											handleRemove={handleRemove}
										/>
									</div>
								)}
							</div>
						))
				)}
			</div>
		</div>
	);
};

export const GroupList = ({
	groups,
	history,
	spinnerForGroupList,
	largeScreen,
	userInfo,
	dispatch,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	return (
		<div className="friendList__container">
			<div className="find__friend mt-3 sticky-top">
				<input
					onChange={e => setSearchTerm(e.target.value)}
					type="text"
					className="form-control"
					placeholder="Find Group"
				/>
			</div>
			<div className="friend__list mt-2">
				{spinnerForGroupList ? (
					<div className="chatBar__progress">
						<CircularProgress style={{ color: "rgb(18, 3, 45)" }} />
					</div>
				) : groups.length === 0 ? (
					<h3 className="group_not_available">No group available</h3>
				) : (
					groups
						?.filter(val => {
							if (searchTerm === "") {
								return val;
							} else if (
								val.groupName.toLowerCase().includes(searchTerm.toLowerCase())
							) {
								return val;
							}
						})
						?.map(group => (
							<div className="d-flex justify-content-between align-items-center">
								<CardActionArea
									sx={{ padding: "0.5rem", marginBottom: "0.5rem" }}
									key={group?._id}
									onClick={() => handleGroupInfo(group, history)}
									className="px-3 d-flex justify-content-start align-items-center text-light"
								>
									<div style={{ position: "relative" }} className="mr-3">
										<Avatar
											src={`https://git.heroku.com/barta-the-real-time-chat-app.git/groupAccount/get-profile-img/${group?.photoId}`}
										/>
										<div
											className={
												group?.status === "active" ? "onLine" : "d-none"
											}
										/>
									</div>
									<div>
										<h6 style={{ letterSpacing: "1px" }} className="mx-4 mb-0">
											{group?.groupName}
										</h6>
										{group?.lastMessage?.status ? (
											group?.lastMessage?.files?.length > 0 ? (
												group?.lastMessage?.files[0]?.contentType?.split(
													"/"
												)[0] === "image" ? (
													<div
														className={
															group?.lastMessage?.sender !== userInfo?.email
																? group?.lastMessage?.status === "unseen"
																	? "unseenMessage mx-4"
																	: "seenMessage mx-4"
																: "seenMessage mx-4"
														}
													>
														<small>Photo</small>
														<small className="ml-1">
															{time_ago.ago(
																group?.lastMessage?.timeStamp,
																true
															)}
														</small>
													</div>
												) : group?.lastMessage?.files[0]?.contentType?.split(
														"/"
												  )[0] === "video" ? (
													<div
														className={
															group?.lastMessage?.sender !== userInfo?.email
																? group?.lastMessage?.status === "unseen"
																	? "unseenMessage mx-4"
																	: "seenMessage mx-4"
																: "seenMessage mx-4"
														}
													>
														<small>Video</small>
														<small className="ml-1">
															{time_ago.ago(
																group?.lastMessage?.timeStamp,
																true
															)}
														</small>
													</div>
												) : (
													group?.lastMessage?.files[0]?.contentType?.split(
														"/"
													)[0] === "application" && (
														<div
															className={
																group?.lastMessage?.sender !== userInfo?.email
																	? group?.lastMessage?.status === "unseen"
																		? "unseenMessage mx-4"
																		: "seenMessage mx-4"
																	: "seenMessage mx-4"
															}
														>
															<small>
																{handleText(
																	group?.lastMessage?.files[0]?.filename
																		?.split("_")
																		?.join(" ")
																		?.split("◉_◉")[0],
																	largeScreen
																) +
																	path.extname(
																		group?.lastMessage?.files[0]?.filename
																	)}
															</small>
															<small className="ml-1">
																{time_ago.ago(
																	group?.lastMessage?.timeStamp,
																	true
																)}
															</small>
														</div>
													)
												)
											) : (
												<div
													className={
														group?.lastMessage?.sender !== userInfo?.email
															? group?.lastMessage?.status === "unseen"
																? "unseenMessage mx-4"
																: "seenMessage mx-4"
															: "seenMessage mx-4"
													}
												>
													{group?.lastMessage?.message ? (
														<div className="d-flex justify-content-between align-items-center">
															<small>
																{handleText(
																	group?.lastMessage?.message,
																	largeScreen
																)}
															</small>
															<small className="ml-1">
																{time_ago.ago(
																	group?.lastMessage?.timeStamp,
																	true
																)}
															</small>
														</div>
													) : (
														<div className="d-flex align-items-center">
															<small className="d-flex justify-content-center align-items-center">
																{group?.lastMessage?.callDuration?.duration ? (
																	group?.lastMessage?.sender ===
																	userInfo.email ? (
																		<CallMadeIcon
																			className="mr-2"
																			variant="contained"
																			size="small"
																			style={{ color: "blue" }}
																		/>
																	) : (
																		<CallReceivedIcon
																			className="mr-2"
																			variant="contained"
																			size="small"
																			style={{ color: "green" }}
																		/>
																	)
																) : group?.lastMessage?.sender ===
																  userInfo.email ? (
																	<CallMissedOutgoingIcon
																		className="mr-2"
																		variant="contained"
																		size="small"
																		style={{ color: "red" }}
																	/>
																) : (
																	<CallMissedIcon
																		className="mr-2"
																		variant="contained"
																		size="small"
																		style={{ color: "red" }}
																	/>
																)}
																{group?.lastMessage?.callDescription}
															</small>
															&nbsp; &nbsp;
															<small className="ml-1">
																{time_ago.ago(
																	group?.lastMessage?.timeStamp,
																	true
																)}
															</small>
														</div>
													)}
												</div>
											)
										) : (
											<small className="seenMessage mx-4">
												{group?.lastMessage?.message}
											</small>
										)}
									</div>
								</CardActionArea>
							</div>
						))
				)}
			</div>
		</div>
	);
};

const FriendMoreButton = ({ dispatch, handleRemove }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<IconButton
				style={{ width: "1.6rem", height: "1.6rem" }}
				id="basic-button"
				aria-controls="basic-menu"
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
			>
				<MoreVertIcon
					sx={{ color: "#fff", height: "1.3rem", width: "1.3rem" }}
				/>
			</IconButton>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<MenuItem
					onClick={() => {
						handleRemove();
						handleClose();
					}}
				>
					<RemoveCircleIcon sx={{ color: "gray" }} />
					Remove
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<BlockIcon sx={{ color: "red" }} />
					Block
				</MenuItem>
			</Menu>
		</div>
	);
};

export const SearchFriend = ({
	userEmail,
	users,
	loading,
	history,
	dispatch,
	makeGroup,
	selectedIdsForGroup,
	groupCreated,
	groupCreatingSpinner,
}) => {
	return (
		<>
			<div className="find__users mt-2 sticky-top">
				<input
					onChange={e => handleSearchForFriend(e, userEmail, dispatch)}
					type="text"
					className="form-control"
					placeholder={
						makeGroup ? "Search people to make group" : "Add new Friend"
					}
				/>
			</div>
			<div className="my-1" />
			{makeGroup && selectedIdsForGroup.length > 0 && (
				<div className="selectedId__section rounded">
					<div className="selectedId__container">
						{selectedIdsForGroup?.map(selectedId => (
							<div key={selectedId.id} className="selected_id">
								<HighlightOffIcon
									onClick={() =>
										deleteIdFromSelectedId(
											dispatch,
											selectedId?.id,
											selectedIdsForGroup
										)
									}
									className="times_for_selectedId"
									size="small"
								/>
								<Avatar
									src={`https://git.heroku.com/barta-the-real-time-chat-app.git/user/account/get-profile-img/${selectedId?.photoId}`}
								/>
							</div>
						))}
					</div>
					{selectedIdsForGroup.length >= 2 && (
						<div className="d-flex justify-content-center align-items-center">
							<Button
								onClick={() => dispatch(setFinalStepToCreateGroup(true))}
								style={{ background: "#fff", color: "rgb(69, 139, 219)" }}
								variant="contained"
								size="small"
							>
								<span style={{ fontWeight: "bold" }}>
									{groupCreated ? "Created" : "Create"}
								</span>{" "}
								&nbsp;
								{!groupCreatingSpinner && !groupCreated && (
									<AddCircleOutlineIcon size={12} />
								)}
								&nbsp;
								{groupCreatingSpinner && <CircularProgress size={12} />}
								{groupCreated && <CheckCircleOutlineIcon size={10} />}
							</Button>
						</div>
					)}
				</div>
			)}
			<div className="users__list mt-2">
				{loading ? (
					<div className="loadingSpinner">
						<Spinner animation="grow" variant="warning" />
					</div>
				) : (
					users.length > 0 &&
					users?.map(otherUser => {
						if (otherUser.email !== userEmail) {
							return (
								<CardActionArea
									key={otherUser._id}
									onClick={() => {
										!makeGroup
											? handleReceiverInfo(otherUser, history)
											: addIdToCreateGroup(
													dispatch,
													otherUser,
													selectedIdsForGroup
											  );
									}}
									className="px-3 d-flex justify-content-start align-items-center text-light"
								>
									<div className="mr-3">
										<Avatar
											src={`https://git.heroku.com/barta-the-real-time-chat-app.git/user/account/get-profile-img/${otherUser?.photoId}`}
										/>
									</div>
									<h6 className="m-4">{otherUser?.displayName}</h6>
								</CardActionArea>
							);
						}
						return null;
					})
				)}
			</div>
		</>
	);
};

export const FinalProcessToCreateGroup = ({
	dispatch,
	selectedIdsForGroup,
	userInfo,
	groupName,
}) => {
	return (
		<div>
			<div className="find__users mt-2 sticky-top">
				<input
					onChange={e => dispatch(setGroupName(e.target.value))}
					className="form-control"
					type="text"
					placeholder="Group Name is required"
					required
				/>
			</div>
			<div className="users__list mt-2">
				<div className="selectedId__container">
					{selectedIdsForGroup?.map(selectedId => (
						<div key={selectedId.id} className="selected_id">
							<HighlightOffIcon
								onClick={() =>
									deleteIdFromSelectedId(
										dispatch,
										selectedId?.id,
										selectedIdsForGroup
									)
								}
								className="times_for_selectedId"
								size="small"
							/>
							<Avatar
								src={`https://git.heroku.com/barta-the-real-time-chat-app.git/user/account/get-profile-img/${selectedId?.photoId}`}
							/>
						</div>
					))}
				</div>
				<div className="d-flex justify-content-center align-items-center">
					<Button
						onClick={() => dispatch(setFinalStepToCreateGroup(false))}
						style={{
							background: "#fff",
							color: "rgb(29, 29, 29)",
							margin: "0 0.5rem",
						}}
						variant="contained"
						size="small"
					>
						<ArrowBackIcon style={{ fontSize: "16px" }} /> &nbsp;
						<span style={{ fontWeight: "bold" }}>Back</span>
					</Button>
					<Button
						onClick={() =>
							createGroupForFirst(
								selectedIdsForGroup,
								userInfo,
								groupName,
								dispatch
							)
						}
						style={{
							margin: "0 0.5rem",
						}}
						variant="contained"
						size="small"
					>
						<span style={{ fontWeight: "bold" }}>Create</span> &nbsp;
						<AddCircleOutlineIcon style={{ fontSize: "16px" }} />
					</Button>
				</div>
			</div>
		</div>
	);
};

export const BottomNavigationBar = ({ dispatch }) => {
	const [value, setValue] = useState("friendList");
	const handleChange = (event, newValue) => {
		setValue(newValue);
		if (newValue === "friendList") {
			openFriendListTab(dispatch);
		} else if (newValue === "addNewFriend") {
			openSearchToMakeFriendTab(dispatch);
		} else if (newValue === "groups") {
			openGroupListTab(dispatch);
		} else if (newValue === "makeNewGroup") {
			openGroupMakingTab(dispatch);
		}
	};
	return (
		<BottomNavigation
			sx={{
				position: "absolute",
				bottom: 0,
				left: 0,
				right: 0,
				background: "rgb(68, 27, 121)",
			}}
			value={value}
			onChange={handleChange}
		>
			<BottomNavigationAction
				color="warning"
				label="Friends"
				value="friendList"
				icon={<PersonOutlineIcon sx={{ color: "#fff" }} />}
			/>
			<BottomNavigationAction
				sx={{ color: "#fff" }}
				label="Add"
				value="addNewFriend"
				icon={<PersonAddIcon sx={{ color: "#fff" }} />}
			/>
			<BottomNavigationAction
				sx={{ color: "#fff" }}
				label="Groups"
				value="groups"
				icon={<PeopleIcon sx={{ color: "#fff" }} />}
			/>
			<BottomNavigationAction
				sx={{ color: "#fff" }}
				label="Create"
				value="makeNewGroup"
				icon={<GroupAddIcon sx={{ color: "#fff" }} />}
			/>
		</BottomNavigation>
	);
};
