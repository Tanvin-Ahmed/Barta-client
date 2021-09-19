import React from "react";
import "./PopupMessage.css";
import logo from "../../img/logo/logo.jpg";

const PopupMessage = ({ setShowPopup }) => {
  const handlePopup = () => {
    sessionStorage.setItem("barta/popup-message", JSON.stringify(false));
    setShowPopup(false);
  };
  return (
    <div className="PopupMessage">
      <div className="d-flex justify-content-center align-items-center flex-wrap flex-column">
        <img src={logo} alt="logo" />
        <div className="text-center">
          <h3>Welcome to Barta app!</h3>
          <h4>Warning🚧</h4>
          <h6>
            Don't reload this app. Otherwise you may loss some realtime
            information!
          </h6>
        </div>
        <button onClick={handlePopup} type="submit" className="popup__close">
          I understood
        </button>
      </div>
    </div>
  );
};

export default PopupMessage;
