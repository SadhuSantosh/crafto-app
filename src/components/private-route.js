import React, { useEffect, useContext, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { userContext } from "../App";

const PrivateRoute = ({}) => {
  const { setIsLoggedIn, setToken, setUsername } = useContext(userContext);
  const [redirectToHome, setRedirect] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (window) {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      if (token?.length > 0 && username.length > 0) {
        setToken(token);
        setUsername(username);
        setIsLoggedIn(true);
        setRedirect("no");
      }
      if (!token && !username) {
        navigate("/");
      }
    }
  }, []);

  return (
    redirectToHome.length > 0 &&
    (redirectToHome === "no" ? <Outlet /> : <Navigate to="/" />)
  );
};

export default PrivateRoute;
