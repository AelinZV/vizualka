import React, { useState } from "react";
import "./BookFilter.css";

const BookFilter = ({ books, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title"); 
  const [sortOrder, setSortOrder] = useState("asc"); 

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterAndSortBooks(query, sortBy, sortOrder);
  };

  const handleSortByChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    filterAndSortBooks(searchQuery, newSortBy, sortOrder);
  };

  const handleSortOrderChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    filterAndSortBooks(searchQuery, sortBy, newSortOrder);
  };

  const filterAndSortBooks = (query, sortBy, sortOrder) => {
    let filteredBooks = [...books];

    if (query) {
      filteredBooks = filteredBooks.filter((book) => {
        const titleMatch = book.title?.toLowerCase().includes(query);
        const authorsMatch = book.authors?.some((author) =>
          author.toLowerCase().includes(query)
        );
        return titleMatch || authorsMatch;
      });
    }

    filteredBooks.sort((a, b) => {
      let valueA, valueB;
      if (sortBy === "title") {
        valueA = a.title?.toLowerCase() || "";
        valueB = b.title?.toLowerCase() || "";
      } else {
        valueA = a.authors?.[0]?.toLowerCase() || "";
        valueB = b.authors?.[0]?.toLowerCase() || "";
      }

      if (sortOrder === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

    onFilterChange(filteredBooks);
  };

  return (
    <div className="book-filter">
      <input
        type="text"
        placeholder="Поиск по названию или автору..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="sort-controls">
        <label>
          sort by:
          <select value={sortBy} onChange={handleSortByChange}>
            <option value="title">title</option>
            <option value="author">author</option>
          </select>
        </label>
        <label>
          queue:
          <select value={sortOrder} onChange={handleSortOrderChange}>
            <option value="asc">up</option>
            <option value="desc">down</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default BookFilter;