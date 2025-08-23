const API_BASE_URL = '/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Build headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add Authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log(`🔑 Adding Authorization header for ${endpoint}`);
    } else {
      console.log(`❌ No token found for ${endpoint}`);
    }
    
    console.log(`🌐 ${options.method || 'GET'} ${url}`);
    console.log('📤 Headers:', Object.keys(headers));

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`📡 Response: ${response.status}`);

      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ API Error:', data);
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('✅ Success:', data);
      return data;
    } catch (error) {
      console.error('🔥 Request failed:', error.message);
      throw error;
    }
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/profile', {
      method: 'GET',
    });
  }

  async createBook(bookData) {
  return this.request('/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });
}

async getAllBooks(searchQuery = '', limit = 20, offset = 0) {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);
  params.append('limit', limit);
  params.append('offset', offset);
  
  return this.request(`/books?${params.toString()}`);
}

async getBookById(id) {
  return this.request(`/books/${id}`);
}

}

export default new ApiService();
