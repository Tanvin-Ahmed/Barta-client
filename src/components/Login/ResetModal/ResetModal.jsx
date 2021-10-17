import React, { useState } from "react";
import { resetPasswordRequest } from "../../../app/actions/userAction";
import "./ResetModal.css";
import CircularProgress from "@mui/material/CircularProgress";

const ResetModal = ({ setOpenModal }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // request to server
      resetPasswordRequest(email, setLoading, setMessage);
    } else alert("Please enter your email");
  };
  return (
    <section className="reset__modal">
      <div className="back__drop" onClick={() => setOpenModal(false)} />
      <div className="container">
        <h4>Barta</h4>
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            placeholder="Enter your login email"
          />
          <div className="d-flex justify-contain-center align-items-center">
            <button type="submit" className="submit__button">
              Send request{" "}
              {loading ? (
                <CircularProgress
                  style={{ color: "white", height: "0.7rem", width: "0.7rem" }}
                />
              ) : null}
            </button>
          </div>
        </form>
        <small className="text-center text-light mt-2">{message}</small>
      </div>
    </section>
  );
};

export default ResetModal;
