import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import {
  accessTokenForGoogle,
  postMyInfo,
  sendLoginRequest,
  sendSignInRequest,
} from "../../app/actions/userAction";
import "./Login.css";
import { initializationLoginFramework, SignInWithGoogle } from "./loginManager";
import { useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import { TextField } from "@material-ui/core";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";

const Login = () => {
  const [passwordShow, setPasswordShow] = useState("password");
  const [login, setLogin] = useState(true);
  const [birthday, setBirthday] = useState(new Date().toUTCString());
  initializationLoginFramework();

  const dispatch = useDispatch();
  const { loginSpinner } = useSelector((state) => ({
    loginSpinner: state.userReducer.loginSpinner,
  }));

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
          chatList: [],
          groups: [],
          status: "active",
          goOffLine: new Date().toUTCString(),
          timeStamp: new Date().toUTCString(),
        };

        localStorage.setItem(
          "barta/user",
          JSON.stringify({
            email: result.email,
            displayName: result.displayName,
            photoURL: result.photoURL,
            status: "active",
          })
        );
        dispatch(postMyInfo(user));

        history.replace(from);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handlePasswordShow = () => {
    if (passwordShow === "password") {
      setPasswordShow("text");
    } else {
      setPasswordShow("password");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    let userInfo = {};
    if (login) {
      if (data.password.trim()) {
        // data send to the server to verify
        userInfo = {
          email: data.email,
          password: data.password,
        };
        dispatch(sendLoginRequest(userInfo, history, from));
      } else alert("Please enter your password");
    } else {
      if (data.name.trim() && data.password.trim() && data.confirm.trim()) {
        if (data.password === data.confirm) {
          if (birthday) {
            // data send to the server
            userInfo = {
              displayName: data.name,
              email: data.email,
              password: data.password,
              confirm: data.confirm,
              birthday: birthday,
            };
            dispatch(sendSignInRequest(userInfo, history, from));
          } else alert("Birthday required");
        } else alert("Password not match!");
      } else alert("Please fill up the form properly.");
    }
  };

  return (
    <section className="login">
      <div className="login__container">
        <h4 className="text-center">{login ? "Log In" : "Sign In"}</h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!login && (
            <>
              <input
                className=" my-2 login__input"
                type="text"
                {...register("name", { required: true })}
                placeholder="User Name"
                autoFocus={!login && true}
              />
              {errors.name && <span>User Name is required</span>}
            </>
          )}

          <input
            className="my-2 login__input"
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
            autoFocus={login && true}
          />
          {errors.email && <span>Email is required</span>}
          <div className="d-flex justify-content-between align-items-center password__container">
            <input
              className="my-2 login__input"
              type={passwordShow}
              {...register("password", { required: true })}
              placeholder="Password"
              style={{ paddingRight: "2rem" }}
            />
            {passwordShow === "password" ? (
              <VisibilityOffIcon
                className="pas_icon"
                onClick={handlePasswordShow}
                size="small"
                style={{ cursor: "pointer", color: "rgb(109, 59, 218)" }}
              />
            ) : (
              <VisibilityIcon
                className="pas_icon"
                onClick={handlePasswordShow}
                size="small"
                style={{ cursor: "pointer", color: "rgb(109, 59, 218)" }}
              />
            )}
          </div>
          {errors.password && <span>Password is required</span>}

          {!login && (
            <>
              <input
                className=" my-2 login__input"
                type={passwordShow}
                {...register("confirm", { required: true })}
                placeholder="Confirm Password"
              />
              {errors.confirm && <span>Confirm password is required</span>}
            </>
          )}

          {!login && (
            <div className="d-flex justify-content-center align-items-center my-2">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  style={{ color: "white" }}
                  label="Birth Day"
                  inputFormat="MM/dd/yyyy"
                  value={new Date().toUTCString()}
                  onChange={(value) =>
                    setBirthday(new Date(value).toUTCString())
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
          )}

          <div className="button__container">
            <button className="submit__button" type="submit">
              {login ? "Log In" : "Sign In"} {"  "}
              {loginSpinner && (
                <CircularProgress
                  style={{ color: "white", height: "0.7rem", width: "0.7rem" }}
                />
              )}
            </button>
          </div>
        </form>
        <div className="signIn_btn">
          {login ? (
            <>
              New in here? <span onClick={() => setLogin(false)}>Sign In</span>
            </>
          ) : (
            <>
              Have an account?{" "}
              <span onClick={() => setLogin(true)}>Log In</span>
            </>
          )}
        </div>

        {/* <button onClick={signIn} className="google__btn">
          SignIn with Google
        </button> */}
      </div>
    </section>
  );
};

export default Login;
