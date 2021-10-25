import React, { useState, useEffect } from "react";
import "./Profile.css";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import { AgeFromDate } from "age-calculator";
import TimeCounting from "time-counting";
import { useParams } from "react-router";

const Profile = () => {
  const { identity } = useParams();
  const [user, setUser] = useState({});
  const { userInfo, receiverInfo } = useSelector((state) => ({
    userInfo: state.userReducer.userInfo,
    receiverInfo: state.userReducer.receiverInfo,
  }));

  useEffect(() => {
    if (identity === "userInfo") {
      setUser(userInfo);
    } else if (identity === "receiverInfo") {
      setUser(receiverInfo);
    }
  }, [userInfo, receiverInfo, identity]);

  return (
    <section className="profile">
      <div className="d-flex justify-content-center align-items-center flex-column p-4">
        <div style={{ position: "relative" }}>
          <Avatar
            src={
              user?.photoURL
                ? user?.photoURL
                : `https://barta-the-real-time-chat-app.herokuapp.com/user/account/get-profile-img/${user?.photoId}`
            }
            style={{ width: "10rem", height: "10rem" }}
          />
          {user?.status === "active" && <div className="online" />}
        </div>
        <h4 className="user__name">{user?.displayName}</h4>
      </div>
      <div className="info">
        <h6>Total friend: {user?.chatList?.length}</h6>
        <h6>Total group: {user?.groups?.length}</h6>
        <h6>Age: {new AgeFromDate(new Date(user?.birthday)).age}</h6>
        <h6>
          Next birthday:{" "}
          {TimeCounting(`${new Date().getFullYear() + 1}-04-18 00:00:00`, {
            objectTime: new Date(),
          }) + "🎂🎈🎁"}
        </h6>
        <h6>Gender: {user?.gender}</h6>
        <h6>Religion: {user?.religion}</h6>
        <h6>Nationality: {user?.nationality}</h6>
        <h6>Relationship: {user?.relationshipStatus}</h6>
      </div>
    </section>
  );
};

export default Profile;
