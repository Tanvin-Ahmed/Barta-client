import { IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import "./AccountDeleteAlert.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  deleteAccount,
  setDeleteAccountAlert,
} from "../../../app/actions/userAction";

import { useDispatch, useSelector } from "react-redux";

const AccountDeleteAlert = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.userInfo,
  }));
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = () => {
    const friendList = [];
    const groupList = [];
    userInfo?.chatList?.forEach(({ email }) => {
      friendList.push(email);
    });
    userInfo.groups.forEach(({ groupId }) => {
      groupList.push(groupId);
    });

    const data = {
      groupList,
      friendList,
      email: userInfo?.email,
    };
    deleteAccount(data, setLoading, setMessage);
  };

  useEffect(() => {
    if (message?.status === "ok") {
      const t = setTimeout(() => {
        dispatch(setDeleteAccountAlert(false));
      }, 200);
      return () => clearTimeout(t);
    }
  }, [message, dispatch]);

  return (
    <div className="delete_alert_modal">
      <div
        onClick={() => dispatch(setDeleteAccountAlert(false))}
        className="back__drop"
      />
      <section className="account__delete">
        <div className="container">
          <h5 className="text-light text-center">Delete Account Forever</h5>
          <small className="text-light">
            There is no option to recover this account and your conversation
            will remove from your friend chat also and automatically all of your
            friend will be unfriend.
          </small>
          <small
            style={{ fontWeight: "bold", letterSpacing: "1px" }}
            className="text-warning d-block"
          >
            If you want to delete account, please press delete button
          </small>
          <div className="d-flex justify-content-around align-items-center mt-2">
            <IconButton
              title="cancel"
              style={{ backgroundColor: "rgb(106, 57, 185)" }}
              onClick={() => dispatch(setDeleteAccountAlert(false))}
            >
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
            <IconButton
              onClick={handleDeleteAccount}
              title="Delete Account"
              style={{ backgroundColor: "rgb(255, 35, 64)" }}
            >
              <DeleteForeverIcon sx={{ color: "white" }} />
            </IconButton>
          </div>
          {loading && (
            <div className="d-flex justify-content-center align-items-center mt-3">
              <CircularProgress style={{ color: "rgb(150, 118, 255)" }} />
            </div>
          )}
          {message?.status ? (
            <div className="mt-3">
              {message?.status === "ok" ? (
                <small className="text-center text-light">
                  {message?.message}
                </small>
              ) : (
                <small className="text-warning text-center">
                  {message?.message}
                </small>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default AccountDeleteAlert;
