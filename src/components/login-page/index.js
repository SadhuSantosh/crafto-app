import React, { useContext, useEffect, useState } from "react";
import "./login.css";
import { userContext } from "../../App";
import { useNavigate } from "react-router-dom";

function AuthScreen() {
  const { setIsLoggedIn, setToken, username, setUsername } =
    useContext(userContext);
  const [otp, setOtp] = useState("");
  const [disable, setDisable] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window) {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      if (token?.length > 0 && username.length > 0) {
        setToken(token);
        setUsername(username);
        setIsLoggedIn(true);
        navigate("/feed");
      }
    }
  }, []);

  useEffect(() => {
    if (otp.trim().length !== 4 || username.trim() === "") {
      setDisable(true);
    } else {
      setDisable(false);
    }
    setError("");
  }, [otp, username]);

  const onOtpChange = (e) => {
    let filteredvalue = e.target.value.replace(/[^0-9]/, "");
    setOtp(filteredvalue);
  };

  const handleLogin = async () => {
    if (!disable) {
      try {
        setLoading(true);
        const body = {
          username: username,
          otp: otp,
        };

        const response = await fetch(
          "https://assignment.stage.crafto.app/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (response.status === 401) {
          setError("Invalid OTP");
        } else {
          const data = await response.json().then((data) => data);
          if (data?.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", username);
            localStorage.setItem("isloggedIn", "true");
            setToken(data.token);
            setIsLoggedIn(true);
            navigate("/feed");
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("<<<<<<< LOGIN ERROR >>>>>>>>", error);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <span className="auth-heading">Login to Crafto</span>
        <div>
          <span className="auth-label">Username</span>
          <br />
          <input
            className="auth-input"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Enter your username"
            autoFocus
          ></input>
        </div>
        <div>
          <span className="auth-label">OTP</span>
          <br />
          <input
            className="auth-input"
            type="text"
            value={otp}
            onChange={onOtpChange}
            placeholder="Enter your OTP"
            maxLength={4}
          ></input>
        </div>
        {error.length > 0 ? (
          <span className="auth-error">Error: {error}</span>
        ) : (
          ""
        )}
        <button
          className={`auth-login-user ${disable ? "login-disable" : ""}`}
          disable={disable ? "true" : "false"}
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-card">Logging in...</div>
        </div>
      )}
    </div>
  );
}

export default AuthScreen;
