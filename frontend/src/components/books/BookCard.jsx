import React from 'react';
import { Link } from 'react-router-dom';
import '../../components/books.css';

const BookCard = ({ book }) => (
  <Link to={`/books/${book.id}`} className="book-card">
    <h3 className="book-title">{book.title}</h3>
    {book.author && <p className="book-author">by {book.author}</p>}
    <div className="book-meta">
      <span>{book.review_count ?? 0} reviews</span>
      {book.average_rating && <span>★ {book.average_rating}</span>}
    </div>
    {book.genre && (
      <p className="book-genre" style={{ fontSize: '.85rem' }}>
        {book.genre}
      </p>
    )}
  </Link>
);

export default BookCard;
