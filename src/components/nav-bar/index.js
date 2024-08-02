import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { userContext } from "../../App";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { setIsLoggedIn, setToken, setUsername } = useContext(userContext);

  const navigate = useNavigate();

  const logoutUser = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUsername("");
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="navbar-wrapper">
      <img
        src="https://play-lh.googleusercontent.com/2S5U0e8prP0ldzNR00piovnovERtUPuNrPObos96OwcaN-zLGAnwes-XywTRW47peAU=w480-h960-rw"
        className="app-logo"
        alt="logo"
      />
      <nav className="navbar-routes-wrapper">
        <Link to="/feed" className="navbar-link">
          Feed
        </Link>
        <span
          className="navbar-link"
          onClick={() => {
            logoutUser();
          }}
        >
          Logout
        </span>
        {/* <Link to="/create-quote" className="navbar-link">
          Create Quote
        </Link> */}
      </nav>
    </div>
  );
}

export default Navbar;
