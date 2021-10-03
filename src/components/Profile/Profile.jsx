import React from "react";
import "./Profile.css";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import { AgeFromDate } from "age-calculator";
import TimeCounting from "time-counting";

const Profile = () => {
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.userInfo,
  }));
  return (
    <section className="profile">
      <div className="d-flex justify-content-center align-items-center flex-column p-4">
        <div style={{ position: "relative" }}>
          <Avatar
            src={`http://localhost:5000/user/account/get-profile-img/${userInfo?.photoId}`}
            style={{ width: "10rem", height: "10rem" }}
          />
          <div className="online" />
        </div>
        <h4 className="user__name">{userInfo?.displayName}</h4>
      </div>
      <div className="info">
        <h6>Total friend: {userInfo?.chatList?.length}</h6>
        <h6>Total group: {userInfo?.groups?.length}</h6>
        <h6>Age: {new AgeFromDate(new Date(userInfo?.birthday)).age}</h6>
        <h6>
          Next birthday:{" "}
          {TimeCounting(`${new Date().getFullYear() + 1}-04-18 00:00:00`, {
            objectTime: new Date(),
          }) + "🎂🎈🎁"}
        </h6>
        <h6>Gender: {userInfo?.gender}</h6>
        <h6>Religion: {userInfo?.religion}</h6>
        <h6>Nationality: {userInfo?.nationality}</h6>
        <h6>Relationship: {userInfo?.relationshipStatus}</h6>
      </div>
    </section>
  );
};

export default Profile;
