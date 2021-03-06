import React, { useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import {
	removeUserInfo,
	setDeleteAccountAlert,
} from "../../app/actions/userAction";
import { useHistory } from "react-router";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const Dropdown = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [anchorEl, setAnchorEl] = useState(null);

	const { userInfo } = useSelector(state => ({
		userInfo: state.userReducer.userInfo,
	}));

	const open = Boolean(anchorEl);
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		dispatch(removeUserInfo());
	};

	return (
		<>
			<Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
				<IconButton
					title="Account settings"
					onClick={handleClick}
					size="small"
					sx={{ ml: 2 }}
				>
					<MoreVertIcon className="text-light" size="small" />
				</IconButton>
			</Box>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: "background.paper",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<MenuItem onClick={() => history.push("/view-profile/userInfo")}>
					<Avatar
						src={`https://barta-the-real-time-chat-app.herokuapp.com/user/account/get-profile-img/${userInfo?.photoId}`}
					/>{" "}
					Profile
				</MenuItem>
				<MenuItem onClick={() => history.push("/update-account/userAccount")}>
					<Avatar
						src={`https://barta-the-real-time-chat-app.herokuapp.com/user/account/get-profile-img/${userInfo?.photoId}`}
					/>{" "}
					Update profile
				</MenuItem>
				<Divider />
				<MenuItem>
					<ListItemIcon>
						<PersonAdd fontSize="small" />
					</ListItemIcon>
					Add another account
				</MenuItem>
				<MenuItem>
					<ListItemIcon>
						<Settings fontSize="small" />
					</ListItemIcon>
					Settings
				</MenuItem>
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
				<MenuItem onClick={() => dispatch(setDeleteAccountAlert(true))}>
					<ListItemIcon>
						<DeleteForeverIcon fontSize="small" />
					</ListItemIcon>
					Delete account
				</MenuItem>
			</Menu>
		</>
	);
};

export default Dropdown;
