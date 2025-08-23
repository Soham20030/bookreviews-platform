import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ReviewForm = ({
  bookId,
  reviewId = null,
  initial = { rating: 0, body: '' },
  onSuccess,
  onCancel
}) => {
  const [rating, setRating] = useState(Number(initial.rating) || 0);
  const [body, setBody] = useState(initial.body || '');
  const [err, setErr] = useState('');
  const [submitting, setSubmit] = useState(false);

  // Update state when initial values change (for edit mode)
  useEffect(() => {
    setRating(Number(initial.rating) || 0);
    setBody(initial.body || '');
  }, [initial.rating, initial.body]);

  const submit = async (e) => {
    e.preventDefault();

    // Debug what we're validating
    console.log('Validating:', { 
      rating, 
      ratingType: typeof rating, 
      bodyLength: body.trim().length,
      bodyValue: body 
    });

    // Ensure rating is a number and validate
    const numRating = Number(rating);
    const trimmedBody = body.trim();

    if (!numRating || numRating < 1 || numRating > 5 || trimmedBody.length < 10) {
      setErr(`Rating must be 1-5 (current: ${numRating}) and review must be ≥10 characters (current: ${trimmedBody.length}).`);
      return;
    }

    setSubmit(true);
    try {
      const payload = { rating: numRating, body: trimmedBody };
      console.log('Sending payload:', payload);
      
      const res = reviewId
        ? await api.updateReview(bookId, reviewId, payload)
        : await api.createReview(bookId, payload);

      onSuccess(res.review || { ...payload, id: reviewId });
      setErr('');
      
      if (!reviewId) {  // Clear only for new review
        setRating(0);
        setBody('');
      }
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSubmit(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: '600px' }}>
      {/* Star rating */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '.5rem' }}>Rating:</label>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => {
              console.log('Setting rating to:', n);
              setRating(n);
              setErr(''); // Clear error when user interacts
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: n <= rating ? 'gold' : 'var(--light-brown)',
              lineHeight: 1,
              padding: '2px',
            }}
          >
            ★
          </button>
        ))}
        <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
          Selected: {rating}/5
        </span>
      </div>

      {/* Text area */}
      <textarea
        className="form-input"
        rows="4"
        placeholder="Write your thoughts… (minimum 10 characters)"
        value={body}
        onChange={e => {
          setBody(e.target.value);
          setErr(''); // Clear error when user types
        }}
      />
      
      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
        {body.trim().length}/10 characters minimum
      </div>

      {err && <p className="form-error" style={{ marginTop: '.5rem', color: 'red' }}>{err}</p>}

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : reviewId ? 'Save Changes' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
