import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import BookFilter from "./BookFilter"; 
import "./App.css";

const App = () => {
  const [books, setBooks] = useState([]); 
  const [filteredBooks, setFilteredBooks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://fakeapi.extendsclass.com/books");
        const booksWithCovers = await Promise.all(
          response.data.map(async (book) => {
            const cover = await fetchCover(book.isbn);
            return { ...book, cover };
          })
        );
        setBooks(booksWithCovers);
        setFilteredBooks(booksWithCovers); 
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const fetchCover = async (isbn) => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyCZPb3j451Ulu_9Z8tQa33H8WFtv9bMHxM`
      );
      return res.data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/128x192";
    } catch (error) {
      console.error("Ошибка загрузки обложки:", error);
      return "https://via.placeholder.com/128x192";
    }
  };

  const handleFilterChange = (filteredBooks) => {
    setFilteredBooks(filteredBooks);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (books.length === 0) return <div>Книги не найдены.</div>;

  return (
    <div className="app">
      <h1>books</h1>
      <BookFilter books={books} onFilterChange={handleFilterChange} />
      <div className="book-list">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default App;