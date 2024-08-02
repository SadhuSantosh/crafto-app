import React, { useState, createContext, useEffect } from "react";

import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthScreen from "./components/login-page";
import QuotesPage from "./components/quote-feed-page";
import CreateQuote from "./components/quote-create-page";

import PrivateRoute from "./components/private-route";

export const userContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");

  return (
    <userContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        token,
        setToken,
        username,
        setUsername,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<AuthScreen />} />
          <Route element={<PrivateRoute />}>
            <Route path="/feed" element={<QuotesPage />} />
            <Route path="/create-quote" element={<CreateQuote />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </userContext.Provider>
  );
}

export default App;
