import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import FollowButton from '../social/FollowButton';
import '../../components/dashboard-user-search.css';

const UserSearchWidget = () => {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [debounce, setDebounce] = useState(null);

  /* fire search 400 ms after user stops typing */
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounce);
    setDebounce(setTimeout(() => runSearch(val), 400));
  };

  const runSearch = async (val) => {
    if (val.trim().length < 2) { setResults([]); return; }
    try {
      setLoading(true);
      const res = await api.searchUsers(val);
      setResults(res.users);
    } catch (err) {
      console.error('user search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-widget user-search-widget">
      <h3>🔎 Find Readers</h3>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search members by name…"
        className="user-search-input"
      />

      {loading && <p className="user-search-loading">Searching…</p>}

      {!loading && query.length >= 2 && results.length === 0 && (
        <p className="user-search-empty">No users found</p>
      )}

      <ul className="user-search-results">
        {results.map(u => (
          <li key={u.id} className="user-search-item">
            <Link to={`/users/${u.id}`} className="user-link">
              {u.display_name || u.username}
            </Link>
            <span className="user-stats">
              {u.total_reviews} reviews · {u.total_books} books
            </span>
            <FollowButton profileUserId={u.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearchWidget;
