import React, { useState } from "react";
import "../quotefeed.css";

function QuoteCard({ data }) {
  const date = new Date(data?.createdAt).toLocaleDateString();
  const username = data?.username.split(".")[0];
  return (
    <div className="card-wrapper">
      <img
        className="quote-media-image"
        src={data?.mediaUrl}
        alt={data?.text}
      ></img>
      <div className="quote-text">
        {" "}
        &#x275B;&nbsp;{data?.text}&nbsp;&#x275C;
      </div>
      <div className="quote-data">
        Created by: <strong>{username}</strong>
      </div>
      <div className="quote-data">
        Created at: <strong>{date}</strong>{" "}
      </div>
    </div>
  );
}

export default QuoteCard;
