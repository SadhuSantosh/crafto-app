import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../App";
import Navbar from "../nav-bar";
import QuoteCard from "./quote-card";
import { useNavigate } from "react-router-dom";

import "./quotefeed.css";

function QuotesPage() {
  const [quoteItems, setQuoteItems] = useState([]);
  const [currentPage, setPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalText, setModalText] = useState("Fetching feeds...");
  const limit = 8;

  const navigate = useNavigate();

  const { token, setIsLoggedIn, setToken, setUsername } =
    useContext(userContext);

  const fetchQuotes = async (pageNumber) => {
    try {
      setLoading(true);
      const offset = pageNumber * limit;
      const response = await fetch(
        `https://assignment.stage.crafto.app/getQuotes?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        setModalText("Logging out...");
        //logging out user
        setIsLoggedIn(false);
        setToken(null);
        setUsername("");
        localStorage.clear();
        navigate("/");
      }
      const data = await response.json();

      if (data?.data?.length === 0) {
        setHasMoreData(false);
      } else {
        setQuoteItems(data?.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching quotes:", error);
    }
  };

  useEffect(() => {
    fetchQuotes(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setPage((prevPage) => prevPage - 1);
      setHasMoreData(true);
    }
  };

  return (
    <div className="feed-wrapper">
      <Navbar />

      <div className="quotes-wrapper">
        {quoteItems.length > 0 &&
          quoteItems.map((item) => (
            <div key={item.id} className="quote-card-wrapper">
              <QuoteCard data={item} />
            </div>
          ))}
      </div>
      <div className="pagination-wrapper">
        <button onClick={handlePrevPage} disabled={currentPage === 0}>
          &#8249; Previous
        </button>
        <button onClick={handleNextPage} disabled={!hasMoreData}>
          Next &#8250;
        </button>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-card">{modalText}</div>
        </div>
      )}

      <div
        className="create-quote-button"
        onClick={() => {
          navigate("/create-quote");
        }}
      >
        Create Quote
      </div>
    </div>
  );
}

export default QuotesPage;
