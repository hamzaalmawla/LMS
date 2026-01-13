"""
Books Routes
Handles book management and catalog operations
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from app import db
from app.models import Book, Category, User
from app.utils import validate_isbn

books_bp = Blueprint('books', __name__)


def is_admin():
    """Check if current user is admin"""
    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)
    user = User.query.get(user_id)
    return user and user.role == 'admin'


@books_bp.route('/', methods=['GET'])
def get_books():
    """
    Get all books with optional filters
    
    Query Parameters:
        search: Search term for title, author, or ISBN
        category: Category ID filter
        available: Filter available books only (true/false)
    
    Returns:
        200: List of books
    """
    try:
        # Get query parameters
        search = request.args.get('search', '').strip()
        category_id = request.args.get('category', type=int)
        available_only = request.args.get('available', 'false').lower() == 'true'
        
        # Build query
        query = Book.query.filter_by(is_active=True)
        
        # Apply search filter
        if search:
            search_filter = or_(
                Book.title.ilike(f'%{search}%'),
                Book.author.ilike(f'%{search}%'),
                Book.isbn.ilike(f'%{search}%')
            )
            query = query.filter(search_filter)
        
        # Apply category filter
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        # Apply availability filter
        if available_only:
            query = query.filter(Book.available_copies > 0)
        
        # Execute query
        books = query.all()
        
        return jsonify([book.to_dict() for book in books]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@books_bp.route('/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """
    Get single book by ID
    
    Parameters:
        book_id: Book ID
    
    Returns:
        200: Book details
        404: Book not found
    """
    try:
        book = Book.query.get_or_404(book_id)
        
        if not book.is_active:
            return jsonify({'error': 'Book not found'}), 404
        
        return jsonify(book.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@books_bp.route('/', methods=['POST'])
@jwt_required()
def create_book():
    """
    Create new book (Admin only)
    
    Request Body:
        {
            "isbn": "string",
            "title": "string",
            "author": "string",
            "category_id": integer (optional),
            "total_copies": integer (optional, default: 1),
            "publication_year": integer (optional),
            "description": "string" (optional)
        }
    
    Returns:
        201: Book created
        400: Invalid input or ISBN exists
        403: Admin access required
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['isbn', 'title', 'author']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate ISBN
        if not validate_isbn(data['isbn']):
            return jsonify({'error': 'Invalid ISBN format (must be 13 digits)'}), 400
        
        # Check if ISBN already exists
        if Book.query.filter_by(isbn=data['isbn']).first():
            return jsonify({'error': 'ISBN already exists'}), 400
        
        # Validate total_copies
        total_copies = data.get('total_copies', 1)
        if total_copies < 1:
            return jsonify({'error': 'Total copies must be at least 1'}), 400
        
        # Create book
        book = Book(
            isbn=data['isbn'],
            title=data['title'],
            author=data['author'],
            category_id=data.get('category_id'),
            total_copies=total_copies,
            available_copies=total_copies,
            publication_year=data.get('publication_year'),
            description=data.get('description')
        )
        
        db.session.add(book)
        db.session.commit()
        
        return jsonify({
            'message': 'Book created successfully',
            'book': book.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@books_bp.route('/<int:book_id>', methods=['PUT'])
@jwt_required()
def update_book(book_id):
    """
    Update book details (Admin only)
    
    Parameters:
        book_id: Book ID
    
    Request Body: (all fields optional)
        {
            "title": "string",
            "author": "string",
            "category_id": integer,
            "total_copies": integer,
            "publication_year": integer,
            "description": "string"
        }
    
    Returns:
        200: Book updated
        403: Admin access required
        404: Book not found
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        book = Book.query.get_or_404(book_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'title' in data:
            book.title = data['title']
        if 'author' in data:
            book.author = data['author']
        if 'category_id' in data:
            book.category_id = data['category_id']
        if 'publication_year' in data:
            book.publication_year = data['publication_year']
        if 'description' in data:
            book.description = data['description']
        
        # Update total_copies and adjust available_copies
        if 'total_copies' in data:
            new_total = data['total_copies']
            if new_total < 1:
                return jsonify({'error': 'Total copies must be at least 1'}), 400
            
            # Calculate difference and adjust available copies
            diff = new_total - book.total_copies
            book.total_copies = new_total
            book.available_copies = max(0, book.available_copies + diff)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Book updated successfully',
            'book': book.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@books_bp.route('/<int:book_id>', methods=['DELETE'])
@jwt_required()
def delete_book(book_id):
    """
    Delete book (soft delete - Admin only)
    
    Parameters:
        book_id: Book ID
    
    Returns:
        200: Book deleted
        400: Cannot delete book with active loans
        403: Admin access required
        404: Book not found
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        book = Book.query.get_or_404(book_id)
        
        # Check if book has active loans
        if book.available_copies < book.total_copies:
            return jsonify({'error': 'Cannot delete book with active loans'}), 400
        
        # Soft delete
        book.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Book deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============= CATEGORY ROUTES =============

@books_bp.route('/categories', methods=['GET'])
def get_categories():
    """
    Get all categories
    
    Returns:
        200: List of categories
    """
    try:
        categories = Category.query.all()
        return jsonify([cat.to_dict() for cat in categories]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@books_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    """
    Create new category (Admin only)
    
    Request Body:
        {
            "name": "string"
        }
    
    Returns:
        201: Category created
        400: Missing name or category exists
        403: Admin access required
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        # Validate required field
        if 'name' not in data or not data['name'].strip():
            return jsonify({'error': 'Category name is required'}), 400
        
        category_name = data['name'].strip()
        
        # Check if category already exists (case-insensitive)
        existing_category = Category.query.filter(
            Category.name.ilike(category_name)
        ).first()
        
        if existing_category:
            return jsonify({'error': 'Category already exists'}), 400
        
        # Create category
        category = Category(name=category_name)
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'message': 'Category created successfully',
            'category': category.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@books_bp.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    """
    Update category (Admin only)
    
    Parameters:
        category_id: Category ID
    
    Request Body:
        {
            "name": "string"
        }
    
    Returns:
        200: Category updated
        400: Missing name or category exists
        403: Admin access required
        404: Category not found
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        category = Category.query.get_or_404(category_id)
        data = request.get_json()
        
        # Validate required field
        if 'name' not in data or not data['name'].strip():
            return jsonify({'error': 'Category name is required'}), 400
        
        new_name = data['name'].strip()
        
        # Check if new name already exists (excluding current category)
        existing_category = Category.query.filter(
            Category.name.ilike(new_name),
            Category.id != category_id
        ).first()
        
        if existing_category:
            return jsonify({'error': 'Category name already exists'}), 400
        
        # Update category
        category.name = new_name
        db.session.commit()
        
        return jsonify({
            'message': 'Category updated successfully',
            'category': category.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@books_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    """
    Delete category (Admin only)
    
    Parameters:
        category_id: Category ID
    
    Returns:
        200: Category deleted
        400: Category has books
        403: Admin access required
        404: Category not found
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        category = Category.query.get_or_404(category_id)
        
        # Check if category has books
        if category.books.count() > 0:
            return jsonify({
                'error': 'Cannot delete category with books. Reassign or delete books first.'
            }), 400
        
        db.session.delete(category)
        db.session.commit()
        
        return jsonify({'message': 'Category deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500