import React, { useContext, useEffect, useState } from "react";
import Navbar from "../nav-bar";
import { userContext } from "../../App";
import { useNavigate } from "react-router-dom";

import "./create-quote.css";

function CreateQuote() {
  const [quote, steQuote] = useState("");
  const [error, setError] = useState("");
  const [disable, setDisable] = useState(true);
  const [image, setImage] = useState(null);
  const [imageMediaUrl, setImageMediaUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalText, setModalText] = useState("Creating Quote...");
  const [successMessage, setSuccesMessage] = useState("");

  useEffect(() => {
    if (successMessage.length > 0) {
      const timerId = setTimeout(() => {
        setSuccesMessage("");
      }, 5000);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [successMessage]);

  const { token, setIsLoggedIn, setToken, setUsername } =
    useContext(userContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (quote.trim() === "" || imageMediaUrl === null) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [imageMediaUrl, quote]);

  const logoutUser = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUsername("");
    localStorage.clear();
    navigate("/");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setModalText("Uploading Image...");
      const response = await fetch(
        "https://crafto.app/crafto/v1.0/media/assignment/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.status === 401) {
        logoutUser();
      }

      if (response.ok) {
        const data = await response.json();
        setImageMediaUrl(data[0]?.url);
      } else {
        setError(response.statusText);
        console.error("Upload failed:", response.statusText);
      }
      setModalText("Uploading Image...");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error uploading file:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!disable) {
      try {
        setLoading(true);
        setModalText("Creating Quote...");
        const body = {
          text: quote,
          mediaUrl: imageMediaUrl,
        };

        const response = await fetch(
          "https://assignment.stage.crafto.app/postQuote",
          {
            method: "POST",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (response.status === 401) {
          logoutUser();
        } else if (response.ok) {
          const data = await response.json().then((data) => data);
          setSuccesMessage("Quote Created Sucessfully !!");
          setImage(null);
          setImagePreview(null);
          setImageMediaUrl(null);
          steQuote("");
        } else {
          setError(response.statusText);
          console.error("Creation failed:", response.statusText);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("<<<<<<< LOGIN ERROR >>>>>>>>", error);
      }
    }
  };

  return (
    <div className="create-wrapper">
      <Navbar />
      <form className="create-fields-wrapper">
        <span className="create-heading">Create a Quote</span>
        <div>
          <br />
          <input
            className="create-input-text"
            type="text"
            value={quote}
            onChange={(e) => {
              steQuote(e.target.value);
            }}
            placeholder="Enter your quote"
            autoFocus
          ></input>
          <label htmlFor="img" className="upload-button">
            Choose a Image &#127748;
          </label>
          <input
            type="file"
            id="img"
            accept="image/*"
            onChange={handleFileChange}
          ></input>
          {imagePreview && (
            <>
              <span className="image-choosen">
                Choosen Image: <strong>{image?.name}</strong>
              </span>
              <img
                src={imagePreview}
                className="image-preview"
                alt="Preview Image"
                width="200"
              />
            </>
          )}
          {error.length > 0 ? (
            <span className="error">Error: {error}</span>
          ) : null}
          {successMessage.length > 0 ? (
            <span className="sucess">{successMessage}</span>
          ) : null}
          <button
            className="create-button"
            disabled={disable ? true : false}
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-card">{modalText}</div>
        </div>
      )}
    </div>
  );
}

export default CreateQuote;
