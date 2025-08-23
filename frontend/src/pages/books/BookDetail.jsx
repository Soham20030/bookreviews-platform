import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import ReviewForm from '../../components/reviews/ReviewForm';
import { useAuth } from '../../context/AuthContext';
import '../../components/books.css';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [book, setBook]       = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError]     = useState(null);

  /* ───────── load once ───────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.getBookById(id);
        setBook(res.book);
        setReviews(res.reviews.map(r => ({ ...r, editing: false })));
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [id]);

  /* ───────── helpers ───────── */
  const recalcStats = (list) => {
    const count = list.length;
    const avg   = count ? (list.reduce((s, r) => s + r.rating, 0) / count).toFixed(1) : null;
    setBook(b => ({ ...b, review_count: count, average_rating: avg }));
  };

  const addReview = (newRev) => {
    setReviews(list => {
      const next = [newRev, ...list];
      recalcStats(next);
      return next;
    });
  };

  const updateReview = (revId, updated) => {
    setReviews(list => {
      const next = list.map(r => (r.id === revId ? { ...r, ...updated, editing: false } : r));
      recalcStats(next);
      return next;
    });
  };

  const toggleEdit = (rid) =>
    setReviews(list => list.map(r => (r.id === rid ? { ...r, editing: !r.editing } : r)));

  const handleDelete = async (rid) => {
    if (!window.confirm('Delete this review?')) return;
    await api.deleteReview(id, rid);
    setReviews(list => {
      const next = list.filter(r => r.id !== rid);
      recalcStats(next);
      return next;
    });
  };

  /* ───────── rendering ───────── */
  if (error)   return <p style={{ padding: '2rem' }}>{error}</p>;
  if (!book)   return <p style={{ padding: '2rem' }}>Loading…</p>;

  return (
    <div className="page-container">
      <Link to="/books" className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
        ← Back to Community Books
      </Link>

      <h1>{book.title}</h1>
      {book.author && <h3 style={{ color: 'var(--primary-brown)', marginTop: 0 }}>by {book.author}</h3>}

      <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
        {book.review_count} reviews • ★ {book.average_rating || '–'}
      </p>

      {book.description && (
        <p style={{ maxWidth: '700px', lineHeight: 1.6 }}>{book.description}</p>
      )}

      {/* ───────── new-review form ───────── */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Add Your Review</h2>
        <ReviewForm bookId={book.id} onSuccess={addReview} />
      </div>

      {/* ───────── list ───────── */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map(r => (
          <div key={r.id} className="book-card" style={{ marginBottom: '1rem' }}>
            {/* edit mode */}
            {r.editing ? (
              <ReviewForm
                bookId={book.id}
                reviewId={r.id}
                initial={{ rating: r.rating, body: r.body }}
                onSuccess={(upd) => updateReview(r.id, upd)}
                onCancel={() => toggleEdit(r.id)}
              />
            ) : (
              <>
                <div className="book-meta" style={{ marginBottom: '.25rem' }}>
                  <strong>{r.display_name || r.username}</strong>
                  <span>•</span> ★ {r.rating}
                  <span>•</span> {new Date(r.created_at).toLocaleDateString()}
                  {user && r.user_id === user.id && (
                    <span className="review-actions">
                      <button onClick={() => toggleEdit(r.id)}>Edit</button>
                      <button onClick={() => handleDelete(r.id)}>Delete</button>
                    </span>
                  )}
                </div>
                <p style={{ margin: 0 }}>{r.body}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookDetail;
