import React from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { postMyInfo } from "../../app/actions/userAction";
import "./Login.css";
import { initializationLoginFramework, SignInWithGoogle } from "./loginManager";
import PermPhoneMsgIcon from "@material-ui/icons/PermPhoneMsg";

const Login = () => {
  initializationLoginFramework();

  const dispatch = useDispatch();

  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const signIn = () => {
    SignInWithGoogle()
      .then((result) => {
        const user = {
          email: result.email,
          displayName: result.displayName,
          photoURL: result.photoURL,
        };
        localStorage.setItem("barta/user", JSON.stringify(user));
        user.timeStamp = new Date().toUTCString();
        dispatch(postMyInfo(user));
        history.replace(from);
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <section className="login">
      <div className="login__container">
        <PermPhoneMsgIcon id="chat__icon" />
        <h2>Barta</h2>
        <h5 className="mb-5">Open your mind</h5>
        <button onClick={signIn} className="google__btn">
          SignIn with Google
        </button>
      </div>
    </section>
  );
};

export default Login;
