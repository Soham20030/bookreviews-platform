const API_BASE_URL = '/api';

class ApiService {
  /* -------------------------------------------------- core helper */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });
    let data = {};
    try { data = await res.json(); } catch (_) {}

    if (!res.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  }

  /* -------------------------------------------------- auth */
  register(body) { return this.request('/auth/register', { method: 'POST', body: JSON.stringify(body) }); }
  login(body) { return this.request('/auth/login', { method: 'POST', body: JSON.stringify(body) }); }
  getProfile() { return this.request('/auth/profile'); }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /* -------------------------------------------------- books */
  createBook(body) { return this.request('/books', { method: 'POST', body: JSON.stringify(body) }); }

  getAllBooks({ search = '', genre = '', minRating = '', maxRating = '', sortBy = 'newest', limit = 20, page = 1 } = {}) {
    const offset = (page - 1) * limit;
    
    // Build query parameters properly
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (genre) params.append('genre', genre);
    if (minRating) params.append('minRating', minRating);
    if (maxRating) params.append('maxRating', maxRating);
    if (sortBy) params.append('sortBy', sortBy);
    params.append('limit', limit);
    params.append('offset', offset);

    console.log('🌐 API call URL:', `/books?${params.toString()}`); // Debug log
    return this.request(`/books?${params.toString()}`);
  }

  getBookById(id) { return this.request(`/books/${id}`); }

  /* -------------------------------------------------- reviews */
  createReview(bookId, body) {
    return this.request(`/books/${bookId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  updateReview(bookId, reviewId, body) {
    return this.request(`/books/${bookId}/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  deleteReview(bookId, reviewId) {
    return this.request(`/books/${bookId}/reviews/${reviewId}`, { method: 'DELETE' });
  }

  /* -------------------------------------------------- reading status */
  setReadingStatus(bookId, status, dates = {}) {
    return this.request('/reading-status', {
      method: 'POST',
      body: JSON.stringify({
        bookId,
        status,
        startedDate: dates.startedDate,
        finishedDate: dates.finishedDate
      })
    });
  }

  getBooksByStatus(status) {
    return this.request(`/reading-status/${status}`);
  }

  getAllReadingStatuses() {
    return this.request('/reading-status');
  }

  getBookStatus(bookId) {
    return this.request(`/reading-status/book/${bookId}`);
  }

  removeFromLibrary(bookId) {
    return this.request(`/reading-status/${bookId}`, { method: 'DELETE' });
  }

  getBooksByStatus(status) {
  return this.request(`/reading-status/${status}`);
}

getAllReadingStatuses() {
  return this.request('/reading-status');
}
}


export default new ApiService();
