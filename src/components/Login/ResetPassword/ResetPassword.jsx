import React, { useState } from "react";
import "./ResetPassword.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim() === confirm.trim()) {
      // update password in db
    } else alert("Password not match!");
  };

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
              Reset password
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
