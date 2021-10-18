import React, { useEffect, useState } from "react";
import "./ResetPassword.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { resetPassword } from "../../../app/actions/userAction";
import { useHistory, useParams } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import jwt_decode from "jwt-decode";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({});
  const [tokenExp, setTokenExp] = useState(null);
  const history = useHistory();
  const { token } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim() === confirm.trim()) {
      // update password in db
      if (tokenExp * 1000 <= new Date().getTime()) {
        setMessage({
          message: "Time is over! please send reset password request again.",
          status: "error",
        });
      } else {
        const data = {
          password,
          token,
        };
        resetPassword(data, setLoading, setMessage);
      }
    } else alert("Password not match!");
  };

  useEffect(() => {
    let t;
    if (message?.status === "ok") {
      t = setTimeout(() => {
        setMessage({});
        history.push("/login");
      }, 500);
      return () => clearTimeout(t);
    }
  }, [history, message]);

  useEffect(() => {
    const { exp } = jwt_decode(token);
    setTokenExp(exp);
  }, [token]);

  const handlePasswordShow = () => {
    setShowPassword(!showPassword);
  };
  return (
    <section className="reset__password">
      <div className="container">
        <h4>Barta</h4>
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between align-items-center password__container">
            <input
              value={password}
              className="pass_input mb-2 my-3 p-2"
              type={showPassword ? "text" : "password"}
              placeholder="Reset your password"
              style={{ paddingRight: "2rem" }}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <VisibilityIcon
                className="pas_icon"
                onClick={handlePasswordShow}
                size="small"
                style={{ cursor: "pointer", color: "rgb(109, 59, 218)" }}
              />
            ) : (
              <VisibilityOffIcon
                className="pas_icon"
                onClick={handlePasswordShow}
                size="small"
                style={{ cursor: "pointer", color: "rgb(109, 59, 218)" }}
              />
            )}
          </div>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="pass_input mb-3 p-2"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm your password"
            required
          />
          <div className="d-flex justify-content-center align-items-center">
            <button type="submit" className="submit__button">
              Reset password{" "}
              {loading ? (
                <CircularProgress
                  style={{ color: "white", height: "1rem", width: "1rem" }}
                />
              ) : message?.status ? (
                message?.status === "ok" ? (
                  <CheckIcon
                    sx={{
                      color: "white",
                      height: "1rem",
                      width: "1rem",
                    }}
                  />
                ) : (
                  <HighlightOffIcon
                    sx={{
                      color: "red",
                      height: "1rem",
                      width: "1rem",
                    }}
                  />
                )
              ) : null}
            </button>
          </div>
        </form>
        <div className="text-center mt-2">
          <small
            className={message?.status === "ok" ? "text-light" : "text-warning"}
          >
            {message?.message}
          </small>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
