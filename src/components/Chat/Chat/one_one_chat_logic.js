import {
	deleteReact,
	getChosenFiles,
	getScreenSize,
	openOptions,
	sendMessageInDatabase,
	reactTabToggle,
	updateChatMessage,
	updatePreReact,
	uploadFiles,
	setMessage,
} from "../../../app/actions/messageAction";
import {
	getGroupIdForChatBar,
	getReceiverInfo,
	postFriendInfo,
	setFriendListTapOpen,
} from "../../../app/actions/userAction";

export const screen = dispatch => {
	console.log(window.innerWidth);
	if (window.innerWidth > 768) {
		dispatch(getScreenSize(true));
	} else {
		dispatch(getScreenSize(false));
	}
};

export const getUsersData = async (dispatch, id) => {
	await dispatch(getReceiverInfo(id));
};

export const getGroupInfo = (dispatch, id) => {
	dispatch(getGroupIdForChatBar(id, ""));
};

export const getRoomId = email => {
	const sender = email?.split("@");
	const receiver = JSON.parse(
		sessionStorage.getItem("barta/receiver")
	)?.email?.split("@");
	const ascendingSort = [sender[0], receiver[0]].sort();
	const roomId = `${ascendingSort[0]}_${ascendingSort[1]}`;
	return roomId;
};

export const handleIsType = (e, socket, senderEmail) => {
	if (e._reactName === "onFocus") {
		socket.emit("typing", {
			email: senderEmail,
			type: true,
		});
	} else if (e._reactName === "onBlur") {
		socket.emit("typing", {
			email: senderEmail,
			type: false,
		});
	}
};

export const handleSendMessage = (
	roomId,
	friendListOpen,
	setInputText,
	inputText,
	senderEmail,
	receiverEmail,
	dispatch,
	chosenFiles
) => {
	const timeStamp = new Date().toUTCString();
	if (chosenFiles[0]) {
		const data = new FormData();
		data.append("id", roomId);
		data.append("sender", senderEmail);

		for (let i = 0; i < chosenFiles.length; i++) {
			const element = chosenFiles[i]?.file;
			data.append("file", element);
		}
		data.append("status", "unseen");
		data.append("timeStamp", timeStamp);

		dispatch(uploadFiles(data));

		const chat = {
			id: roomId,
			sender: senderEmail,
			files: chosenFiles,
			react: [],
			status: "sending",
			timeStamp,
		};
		dispatch(setMessage(chat));
		dispatch(getChosenFiles([]));
	} else {
		const chat = {
			id: roomId,
			sender: senderEmail,
			message: inputText,
			react: [],
			status: "unseen",
			timeStamp,
		};
		dispatch(sendMessageInDatabase(chat));
		dispatch(setMessage({ ...chat, status: "sending" }));

		setInputText("");
	}
	if (!friendListOpen) {
		dispatch(
			postFriendInfo(roomId, {
				friendInfo: [
					{
						email: senderEmail,
						friendOf: receiverEmail?.split("@")[0],
					},
					{
						email: receiverEmail,
						friendOf: senderEmail?.split("@")[0],
					},
				],
			})
		);
		dispatch(setFriendListTapOpen(true));
	}
};

export const fileUpload = (e, dispatch) => {
	const newFiles = e.target.files;
	const files = [];
	for (let i = 0; i < newFiles.length; i++) {
		const element = newFiles[i];
		files.push({
			name: element.name,
			url: URL.createObjectURL(element),
			file: element,
			contentType: element.type,
		});
	}
	dispatch(getChosenFiles(files));
};

export const deleteChosenFiles = (chosenFiles, index, dispatch) => {
	chosenFiles.splice(index, 1);
	dispatch(getChosenFiles(chosenFiles));
};

export const options = (dispatch, bool, id) => {
	const open = {
		id,
		bool,
	};
	dispatch(openOptions(open));
};

export const toggleReactTab = (dispatch, toggle) => {
	dispatch(reactTabToggle(toggle));
};

export const handleReactions = (dispatch, message, sender, react) => {
	const preReact = message?.react?.find(r => r.sender === sender);
	if (preReact) {
		if (preReact.react === react) {
			deleteReact({ id: message._id, sender });
		} else {
			updatePreReact({ id: message._id, sender, react });
		}
	} else {
		updateChatMessage({ id: message._id, reactInfo: { sender, react } });
	}
	toggleReactTab(dispatch, false);
};
