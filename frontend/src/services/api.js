/*  ================================================================
    Central API service – all endpoints in one place
    ================================================================ */
const API_BASE_URL = '/api';

class ApiService {
  /* -------------------------------------------------- core helper */
  async request(endpoint, options = {}) {
    const url   = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res  = await fetch(url, { ...options, headers });
    let  data = {};
    try { data = await res.json(); } catch (_) {}

    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  /* -------------------------------------------------- auth */
  register(body)   { return this.request('/auth/register', { method:'POST', body: JSON.stringify(body) }); }
  login(body)      { return this.request('/auth/login',    { method:'POST', body: JSON.stringify(body) }); }
  getProfile()     { return this.request('/auth/profile'); }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /* -------------------------------------------------- books */
  createBook(body) { return this.request('/books', { method:'POST', body: JSON.stringify(body) }); }

  getAllBooks({ search='', genre='', minRating='', maxRating='', sortBy='newest', limit=20, page=1 } = {}) {
    const offset = (page - 1) * limit;
    const params = new URLSearchParams();
    if (search)     params.append('search',  search);
    if (genre)      params.append('genre',   genre);
    if (minRating)  params.append('minRating', minRating);
    if (maxRating)  params.append('maxRating', maxRating);
    if (sortBy)     params.append('sortBy',  sortBy);
    params.append('limit',  limit);
    params.append('offset', offset);
    return this.request(`/books?${params.toString()}`);
  }

  getBookById(id)  { return this.request(`/books/${id}`); }

  /* -------------------------------------------------- reviews */
  createReview(bookId, body) {
    return this.request(`/books/${bookId}/reviews`, { method:'POST', body: JSON.stringify(body) });
  }
  updateReview(bookId, reviewId, body) {
    return this.request(`/books/${bookId}/reviews/${reviewId}`, { method:'PUT', body: JSON.stringify(body) });
  }
  deleteReview(bookId, reviewId) {
    return this.request(`/books/${bookId}/reviews/${reviewId}`, { method:'DELETE' });
  }

  /* -------------------------------------------------- reading status */
  setReadingStatus(bookId, status, dates = {}) {
    return this.request('/reading-status', {
      method:'POST',
      body: JSON.stringify({
        bookId,
        status,
        startedDate:  dates.startedDate,
        finishedDate: dates.finishedDate
      })
    });
  }
  getBookStatus(bookId)            { return this.request(`/reading-status/book/${bookId}`); }
  getBooksByStatus(status)         { return this.request(`/reading-status/${status}`); }
  getAllReadingStatuses()          { return this.request('/reading-status'); }
  removeFromLibrary(bookId)        { return this.request(`/reading-status/${bookId}`, { method:'DELETE' }); }

  /* -------------------------------------------------- user profiles */
  getUserProfile(userId)           { return this.request(`/users/${userId}/profile`); }
  updateUserProfile(data)          { return this.request('/users/profile', { method:'PUT', body: JSON.stringify(data) }); }
  searchUsers(query) {
    const params = new URLSearchParams({ q: query });
    return this.request(`/users/search?${params.toString()}`);
  }

  /* -------------------------------------------------- follows */
  followUser(userId)        { return this.request(`/follows/${userId}`,          { method:'POST'   }); }
  unfollowUser(userId)      { return this.request(`/follows/${userId}`,          { method:'DELETE' }); }
  getFollowers(userId)      { return this.request(`/follows/${userId}/followers`); }
  getFollowing(userId)      { return this.request(`/follows/${userId}/following`); }
getUserFollowers(userId) { return this.request(`/users/${userId}/followers`); }
getUserFollowing(userId) { return this.request(`/users/${userId}/following`); }


getReviewComments(reviewId) { 
  return this.request(`/reviews/${reviewId}/comments`); 
}

createComment(reviewId, comment_text) { 
  return this.request(`/reviews/${reviewId}/comments`, { 
    method: 'POST', 
    body: JSON.stringify({ comment_text }) 
  }); 
}

updateComment(commentId, comment_text) { 
  return this.request(`/comments/${commentId}`, { 
    method: 'PUT', 
    body: JSON.stringify({ comment_text }) 
  }); 
}

deleteComment(commentId) { 
  return this.request(`/comments/${commentId}`, { 
    method: 'DELETE' 
  }); 
}



}

export default new ApiService();
