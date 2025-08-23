import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import BookCard from '../../components/books/BookCard';
import '../../components/books.css';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await apiService.getAllBooks({ search, limit, page });
      setBooks(res.books);
      setTotal(res.total);
    })();
  }, [search, page]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="page-container">
      <header style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Community Books</h1>

        <input
          className="form-input"
          style={{ maxWidth: '260px' }}
          value={search}
          onChange={e => { setPage(1); setSearch(e.target.value); }}
          placeholder="Search title or author"
        />

        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </header>

      {books.length === 0 && <p>No books found.</p>}

      <div className="books-grid">
        {books.map(b => <BookCard key={b.id} book={b} />)}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >Previous</button>

          <span style={{ alignSelf: 'center' }}>
            Page {page} / {totalPages}
          </span>

          <button
            className="btn btn-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >Next</button>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
