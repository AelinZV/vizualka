import React from 'react';
import './BookCard.css';

const BookCard = ({ book }) => {
  const { title = 'Без названия', authors = ['Неизвестный автор'], cover } = book;

  return (
    <div className="book-card">
      {cover ? (
        <img src={cover} alt={`${title} обложка`} className="book-cover" />
      ) : (
        <div>Нет обложки</div>
      )}
      <h3 className="book-title">{title}</h3>
      <p className="book-authors">{authors.join(', ') || 'Нет авторов'}</p>
    </div>
  );
};

export default BookCard;