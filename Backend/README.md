# Library Management System - Backend API

Flask-based REST API for Library Management System.

## Features

<<<<<<< HEAD
- ✅ User Authentication (JWT)
- ✅ Book Management (CRUD operations)
- ✅ Loan Management (Borrow/Return)
- ✅ User Management (Admin only)
- ✅ Category Management
- ✅ Fine Calculation
- ✅ Statistics & Reports
=======

Key Features Implemented

✅ User Roles: Admin and Member with role-based access control

✅ Book Management: CRUD operations with categories

✅ User Management: Registration, authentication, profile management

✅ Search Functionality: Search books by title, author, ISBN, category

✅ Borrowing/Returning: Complete loan lifecycle with validation

✅ Notifications: Email notification system (ready for use)

✅ Reports: Usage and inventory analytics

✅ Fine Management: Automatic calculation and payment

✅ Security: JWT authentication, password hashing, input validation

✅ Feedback System: (Can be extended with reviews table)
>>>>>>> 20ad7c4f967ce69b4f1d4eef3029f06c3406a75c

## Tech Stack

<<<<<<< HEAD
- **Flask** - Web framework
- **Flask-SQLAlchemy** - ORM for database operations
- **Flask-JWT-Extended** - JWT authentication
- **Flask-Bcrypt** - Password hashing
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-Mail** - Email notifications

## Installation

1. Create virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables in `.env`:
   ```env
   SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret
   DATABASE_URL=sqlite:///library.db
   ```

4. Run the application:
   ```bash
   python run.py
   ```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/<id>` | Get book by ID |
| POST | `/api/books` | Create book (Admin) |
| PUT | `/api/books/<id>` | Update book (Admin) |
| DELETE | `/api/books/<id>` | Delete book (Admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books/categories` | Get all categories |
| POST | `/api/books/categories` | Create category (Admin) |
| PUT | `/api/books/categories/<id>` | Update category (Admin) |
| DELETE | `/api/books/categories/<id>` | Delete category (Admin) |

### Loans
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/loans/borrow` | Borrow a book |
| POST | `/api/loans/return/<id>` | Return a book |
| GET | `/api/loans/my-loans` | Get user's active loans |
| GET | `/api/loans/history` | Get user's loan history |
| GET | `/api/loans/all` | Get all loans (Admin) |
| GET | `/api/loans/overdue` | Get overdue loans (Admin) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |
| GET | `/api/users/fines` | Get user's fines |
| POST | `/api/users/fines/pay` | Pay fine |
| GET | `/api/users/all` | Get all users (Admin) |
| GET | `/api/users/<id>` | Get user by ID (Admin) |
| PUT | `/api/users/<id>` | Update user (Admin) |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Get library statistics |
| GET | `/api/dashboard` | Get dashboard data (Admin) |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/reports/usage` | Usage report (Admin) |
| GET | `/api/users/reports/inventory` | Inventory report (Admin) |

## Testing

Run tests with:
```bash
pytest
```

## License

MIT License
=======
>>>>>>> 20ad7c4f967ce69b4f1d4eef3029f06c3406a75c
