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

    const res  = await fetch(url, { ...options, headers });
    let  data  = {};
    try { data = await res.json(); } catch (_) {}

    if (!res.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  }

  /* -------------------------------------------------- auth */
  register(body) { return this.request('/auth/register', { method: 'POST', body: JSON.stringify(body) }); }
  login(body)    { return this.request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }); }
  getProfile()   { return this.request('/auth/profile'); }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /* -------------------------------------------------- books */
  createBook(body) { return this.request('/books', { method: 'POST', body: JSON.stringify(body) }); }

  getAllBooks({ search = '', limit = 20, page = 1 } = {}) {
    const offset = (page - 1) * limit;
    const params = new URLSearchParams({ search, limit, offset });
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
}

export default new ApiService();
