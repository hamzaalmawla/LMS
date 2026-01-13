// API Configuration
// Backend API - Uses environment variable or falls back to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'member';
  };
}

export interface SignupResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'member';
  };
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverImage?: string;
  userId: string;
  userName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  fine?: number;
  status: 'borrowed' | 'returned' | 'overdue' | 'active';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishYear: number;
  coverImage?: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  status?: 'available' | 'checked-out';
  dueDate?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

// API Service for making HTTP requests
class ApiService {
  private baseUrl: string;
  private useMockData: boolean = false;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.token || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type');
      const data = contentType && contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const errorMessage = typeof data === 'object' && data.message
          ? data.message
          : typeof data === 'string'
            ? data
            : `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      // Check if it's a network error
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        this.useMockData = true;
        throw new Error('Backend connection failed. Using demo mode.');
      }
      throw error;
    }
  }

  isConfigured(): boolean {
    return !this.useMockData;
  }

  // ============= Authentication APIs =============

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      this.useMockData = false;
      return response;
    } catch (error: any) {
      // Fallback to mock login
      if (email === 'admin@center.com' && password === 'admin123') {
        return {
          token: 'mock-admin-token-' + Date.now(),
          user: {
            id: '1',
            name: 'Admin User',
            email: email,
            role: 'admin'
          }
        };
      } else if (email === 'user@center.com' && password === 'user123') {
        return {
          token: 'mock-user-token-' + Date.now(),
          user: {
            id: '2',
            name: 'Demo User',
            email: email,
            role: 'user'
          }
        };
      } else {
        throw new Error('Invalid email or password');
      }
    }
  }

  async signup(name: string, email: string, password: string): Promise<SignupResponse> {
    try {
      const response = await this.fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      this.useMockData = false;
      return response;
    } catch (error: any) {
      // Fallback to mock signup
      return {
        token: 'mock-new-user-token-' + Date.now(),
        user: {
          id: Date.now().toString(),
          name: name,
          email: email,
          role: 'user'
        }
      };
    }
  }

  // ============= Books APIs =============

  // Transform backend book format to frontend format
  private transformBook(backendBook: any): Book {
    return {
      id: String(backendBook.id),
      title: backendBook.title,
      author: backendBook.author,
      isbn: backendBook.isbn,
      category: backendBook.category?.name || 'Uncategorized',
      publishYear: backendBook.publication_year || 0,
      coverImage: backendBook.cover_image,
      description: backendBook.description,
      totalCopies: backendBook.total_copies,
      availableCopies: backendBook.available_copies,
    };
  }

  async getBooks(): Promise<Book[]> {
    const response = await this.fetchWithAuth('/books', {
      method: 'GET',
    });
    // Transform backend response to frontend format
    if (Array.isArray(response)) {
      return response.map((book: any) => this.transformBook(book));
    }
    return [];
  }

  async getBook(id: string): Promise<Book> {
    const response = await this.fetchWithAuth(`/books/${id}`, {
      method: 'GET',
    });
    return this.transformBook(response);
  }

  async createBook(bookData: {
    title: string;
    author: string;
    isbn: string;
    category: string;
    publishYear: number;
    coverImage?: string;
    description?: string;
    totalCopies?: number;
  }) {
    // Transform frontend format to backend format
    const backendData = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      category_id: bookData.category, // Backend expects category_id
      publication_year: bookData.publishYear,
      description: bookData.description,
      total_copies: bookData.totalCopies || 1,
    };
    const response = await this.fetchWithAuth('/books', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
    return this.transformBook(response.book || response);
  }

  async updateBook(id: string, bookData: {
    title?: string;
    author?: string;
    isbn?: string;
    category?: string;
    publishYear?: number;
    coverImage?: string;
    description?: string;
    totalCopies?: number;
  }) {
    // Transform frontend format to backend format
    const backendData: any = {};
    if (bookData.title) backendData.title = bookData.title;
    if (bookData.author) backendData.author = bookData.author;
    if (bookData.category) backendData.category_id = bookData.category;
    if (bookData.publishYear) backendData.publication_year = bookData.publishYear;
    if (bookData.description) backendData.description = bookData.description;
    if (bookData.totalCopies) backendData.total_copies = bookData.totalCopies;

    const response = await this.fetchWithAuth(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
    return this.transformBook(response.book || response);
  }

  async deleteBook(id: string) {
    return this.fetchWithAuth(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  // ============= Borrow/Return APIs =============

  // Transform backend loan format to frontend format
  private transformLoan(backendLoan: any): BorrowedBook {
    return {
      id: String(backendLoan.id),
      bookId: String(backendLoan.book?.id || backendLoan.book_id),
      bookTitle: backendLoan.book?.title || '',
      bookAuthor: backendLoan.book?.author || '',
      bookCoverImage: backendLoan.book?.cover_image,
      userId: String(backendLoan.user?.id || backendLoan.user_id),
      userName: backendLoan.user?.name || '',
      borrowDate: backendLoan.borrow_date,
      dueDate: backendLoan.due_date,
      returnDate: backendLoan.return_date,
      fine: backendLoan.fine_amount,
      status: backendLoan.status === 'active' ? 'borrowed' : backendLoan.status,
    };
  }

  async borrowBook(bookId: string, userId: string, duration: number = 14) {
    const response = await this.fetchWithAuth('/loans/borrow', {
      method: 'POST',
      body: JSON.stringify({
        book_id: parseInt(bookId),
        duration: duration
      }),
    });
    return response.loan ? this.transformLoan(response.loan) : response;
  }

  async returnBook(borrowId: string) {
    const response = await this.fetchWithAuth(`/loans/return/${borrowId}`, {
      method: 'POST',
    });
    return response.loan ? this.transformLoan(response.loan) : response;
  }

  async getMyBorrowedBooks(userId: string): Promise<BorrowedBook[]> {
    const response = await this.fetchWithAuth('/loans/my-loans', {
      method: 'GET',
    });
    if (Array.isArray(response)) {
      return response.map((loan: any) => this.transformLoan(loan));
    }
    return [];
  }

  async getCurrentBorrows(userId: string): Promise<BorrowedBook[]> {
    const response = await this.fetchWithAuth('/loans/my-loans', {
      method: 'GET',
    });
    if (Array.isArray(response)) {
      return response.map((loan: any) => this.transformLoan(loan));
    }
    return [];
  }

  async getBorrowHistory(userId: string): Promise<BorrowedBook[]> {
    const response = await this.fetchWithAuth('/loans/history', {
      method: 'GET',
    });
    if (Array.isArray(response)) {
      return response.map((loan: any) => this.transformLoan(loan));
    }
    return [];
  }

  async getAllBorrowHistory(): Promise<BorrowedBook[]> {
    const response = await this.fetchWithAuth('/loans/all', {
      method: 'GET',
    });
    if (Array.isArray(response)) {
      return response.map((loan: any) => this.transformLoan(loan));
    }
    return [];
  }

  async getAllCurrentBorrows(): Promise<BorrowedBook[]> {
    const response = await this.fetchWithAuth('/loans/all?status=active', {
      method: 'GET',
    });
    if (Array.isArray(response)) {
      return response.map((loan: any) => this.transformLoan(loan));
    }
    return [];
  }

  async adminReturnBook(borrowId: string) {
    const response = await this.fetchWithAuth(`/loans/return/${borrowId}`, {
      method: 'POST',
    });
    return response.loan ? this.transformLoan(response.loan) : response;
  }

  async calculateFine(borrowId: string) {
    // Fine is calculated automatically on return
    return this.fetchWithAuth(`/loans/all`, {
      method: 'GET',
    });
  }

  async payFine(loanId: string, amount: number) {
    return this.fetchWithAuth('/users/fines/pay', {
      method: 'POST',
      body: JSON.stringify({ loan_id: parseInt(loanId), amount }),
    });
  }

  // ============= Members APIs (Admin Only) =============

  // Transform backend user format to frontend format
  private transformMember(backendUser: any): Member {
    return {
      id: String(backendUser.id),
      name: backendUser.name,
      email: backendUser.email,
      phone: backendUser.phone,
      role: backendUser.role,
      isActive: backendUser.is_active,
      createdAt: backendUser.created_at,
    };
  }

  async getMembers(): Promise<Member[]> {
    const response = await this.fetchWithAuth('/users/all', {
      method: 'GET',
    });
    if (Array.isArray(response)) {
      return response.map((user: any) => this.transformMember(user));
    }
    return [];
  }

  async getMember(id: string): Promise<Member> {
    const response = await this.fetchWithAuth(`/users/${id}`, {
      method: 'GET',
    });
    return this.transformMember(response);
  }

  async updateMember(id: string, memberData: {
    name?: string;
    email?: string;
    status?: string;
  }) {
    // Transform frontend format to backend format
    const backendData: any = {};
    if (memberData.name) backendData.name = memberData.name;
    if (memberData.email) backendData.email = memberData.email;
    if (memberData.status !== undefined) backendData.is_active = memberData.status === 'active';

    const response = await this.fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
    return this.transformMember(response.user || response);
  }

  async deleteMember(id: string) {
    return this.fetchWithAuth(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // ============= Statistics APIs (Admin) =============

  async getStatistics() {
    return this.fetchWithAuth('/stats', {
      method: 'GET',
    });
  }

  async getDashboardData() {
    return this.fetchWithAuth('/dashboard', {
      method: 'GET',
    });
  }

  // ============= Search & Filter APIs =============

  async searchBooks(query: string) {
    return this.fetchWithAuth(`/books/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  }

  async getBooksByCategory(category: string) {
    return this.fetchWithAuth(`/books/category/${encodeURIComponent(category)}`, {
      method: 'GET',
    });
  }

  async getAvailableBooks() {
    return this.fetchWithAuth('/books/available', {
      method: 'GET',
    });
  }

  // ============= User Profile APIs =============

  async getUserProfile() {
    return this.fetchWithAuth('/users/profile', {
      method: 'GET',
    });
  }

  async updateUserProfile(userData: {
    name?: string;
    phone?: string;
    password?: string;
  }) {
    return this.fetchWithAuth('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.fetchWithAuth('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ password: newPassword }),
    });
  }
}

export const api = new ApiService(API_BASE_URL);