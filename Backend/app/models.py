"""
Database Models
Defines all database tables and relationships
"""
from datetime import datetime
from app import db, bcrypt


class User(db.Model):
    """User model for members and admins"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='member', nullable=False)  # 'admin' or 'member'
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    loans = db.relationship('Loan', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password):
        """Hash and set user password"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }


class Category(db.Model):
    """Category model for book classification"""
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False, index=True)
    
    # Relationships
    books = db.relationship('Book', backref='category', lazy='dynamic')
    
    def __repr__(self):
        return f'<Category {self.name}>'
    
    def to_dict(self):
        """Convert category to dictionary"""
        return {
            'id': self.id,
            'name': self.name
        }


class Book(db.Model):
    """Book model for library inventory"""
    __tablename__ = 'books'
    
    id = db.Column(db.Integer, primary_key=True)
    isbn = db.Column(db.String(13), unique=True, nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    author = db.Column(db.String(100), nullable=False, index=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    total_copies = db.Column(db.Integer, default=1, nullable=False)
    available_copies = db.Column(db.Integer, default=1, nullable=False)
    publication_year = db.Column(db.Integer)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    loans = db.relationship('Loan', backref='book', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Book {self.title}>'
    
    def to_dict(self):
        """Convert book to dictionary"""
        return {
            'id': self.id,
            'isbn': self.isbn,
            'title': self.title,
            'author': self.author,
            'category': self.category.to_dict() if self.category else None,
            'total_copies': self.total_copies,
            'available_copies': self.available_copies,
            'publication_year': self.publication_year,
            'description': self.description,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }


class Loan(db.Model):
    """Loan model for book borrowing records"""
    __tablename__ = 'loans'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False, index=True)
    borrow_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False, index=True)
    return_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='active', nullable=False, index=True)  # 'active', 'returned', 'overdue'
    fine_amount = db.Column(db.Float, default=0.0, nullable=False)
    
    def __repr__(self):
        return f'<Loan {self.id}: User {self.user_id} - Book {self.book_id}>'
    
    def to_dict(self):
        """Convert loan to dictionary"""
        return {
            'id': self.id,
            'user': self.user.to_dict(),
            'book': self.book.to_dict(),
            'borrow_date': self.borrow_date.isoformat(),
            'due_date': self.due_date.isoformat(),
            'return_date': self.return_date.isoformat() if self.return_date else None,
            'status': self.status,
            'fine_amount': round(self.fine_amount, 2)
        }