"""
Loans Routes
Handles book borrowing, returning, and loan management
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from app import db
from app.models import Loan, Book, User
from app.config import Config

loans_bp = Blueprint('loans', __name__)

LOAN_DURATIONS = {7: 7, 14: 14, 21: 21}


def is_admin():
    """Check if current user is admin"""
    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)
    user = User.query.get(user_id)
    return user and user.role == 'admin'


@loans_bp.route('/borrow', methods=['POST'])
@jwt_required()
def borrow_book():
    """
    Borrow a book
    
    Request Body:
        {
            "book_id": integer,
            "duration": integer (7, 14, or 21 days)
        }
    
    Returns:
        201: Book borrowed successfully
        400: Invalid input or borrowing not allowed
        404: Book not found
    """
    try:
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)
        user = User.query.get(user_id)
        data = request.get_json()
        
        # Validate required fields
        if 'book_id' not in data:
            return jsonify({'error': 'Book ID is required'}), 400
        
        book_id = data['book_id']
        duration = data.get('duration', 14)
        
        # Validate duration
        if duration not in LOAN_DURATIONS:
            return jsonify({'error': 'Invalid loan duration. Choose 7, 14, or 21 days'}), 400
        
        # Check if user has outstanding fines
        total_fines = db.session.query(db.func.sum(Loan.fine_amount))\
            .filter(Loan.user_id == user_id, Loan.fine_amount > 0, Loan.return_date.is_(None))\
            .scalar() or 0
        
        if total_fines > 0:
            return jsonify({
                'error': f'Please pay outstanding fines (${total_fines:.2f}) before borrowing'
            }), 400
        
        # Check active loans count
        active_loans = Loan.query.filter_by(user_id=user_id, status='active').count()
        if active_loans >= Config.MAX_BOOKS_PER_USER:
            return jsonify({
                'error': f'Maximum {Config.MAX_BOOKS_PER_USER} books allowed per member'
            }), 400
        
        # Check book availability
        book = Book.query.get_or_404(book_id)
        
        if not book.is_active:
            return jsonify({'error': 'Book not available'}), 404
        
        if book.available_copies < 1:
            return jsonify({'error': 'No copies available for borrowing'}), 400
        
        # Create loan
        due_date = datetime.utcnow() + timedelta(days=duration)
        loan = Loan(
            user_id=user_id,
            book_id=book_id,
            due_date=due_date,
            status='active'
        )
        
        # Update book availability
        book.available_copies -= 1
        
        db.session.add(loan)
        db.session.commit()
        
        return jsonify({
            'message': 'Book borrowed successfully',
            'loan': loan.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@loans_bp.route('/return/<int:loan_id>', methods=['POST'])
@jwt_required()
def return_book(loan_id):
    """
    Return a borrowed book
    
    Parameters:
        loan_id: Loan ID
    
    Returns:
        200: Book returned successfully
        400: Book already returned
        403: Unauthorized
        404: Loan not found
    """
    try:
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)
        loan = Loan.query.get_or_404(loan_id)
        
        # Verify loan belongs to user (or user is admin)
        if loan.user_id != user_id and not is_admin():
            return jsonify({'error': 'Unauthorized to return this loan'}), 403
        
        if loan.status == 'returned':
            return jsonify({'error': 'Book already returned'}), 400
        
        # Calculate fine if overdue
        return_date = datetime.utcnow()
        grace_end = loan.due_date + timedelta(days=Config.GRACE_PERIOD_DAYS)
        
        if return_date > grace_end:
            days_overdue = (return_date - loan.due_date).days - Config.GRACE_PERIOD_DAYS
            loan.fine_amount = days_overdue * Config.FINE_PER_DAY
        
        # Update loan
        loan.return_date = return_date
        loan.status = 'returned'
        
        # Update book availability
        book = Book.query.get(loan.book_id)
        book.available_copies += 1
        
        db.session.commit()
        
        message = 'Book returned successfully'
        if loan.fine_amount > 0:
            message += f'. Fine: ${loan.fine_amount:.2f}'
        
        return jsonify({
            'message': message,
            'fine_amount': loan.fine_amount,
            'loan': loan.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@loans_bp.route('/my-loans', methods=['GET'])
@jwt_required()
def get_my_loans():
    """
    Get current user's active loans
    
    Returns:
        200: List of active loans
    """
    try:
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)
        
        active_loans = Loan.query.filter_by(
            user_id=user_id,
            status='active'
        ).order_by(Loan.due_date.asc()).all()
        
        return jsonify([loan.to_dict() for loan in active_loans]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@loans_bp.route('/history', methods=['GET'])
@jwt_required()
def get_loan_history():
    """
    Get current user's loan history
    
    Returns:
        200: List of all loans
    """
    try:
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)
        
        loans = Loan.query.filter_by(user_id=user_id)\
            .order_by(Loan.borrow_date.desc()).all()
        
        return jsonify([loan.to_dict() for loan in loans]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@loans_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_loans():
    """
    Get all loans (Admin only)
    
    Query Parameters:
        status: Filter by status (active, returned, overdue)
    
    Returns:
        200: List of all loans
        403: Admin access required
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        status = request.args.get('status')
        
        query = Loan.query
        if status:
            query = query.filter_by(status=status)
        
        loans = query.order_by(Loan.borrow_date.desc()).all()
        
        return jsonify([loan.to_dict() for loan in loans]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@loans_bp.route('/overdue', methods=['GET'])
@jwt_required()
def get_overdue_loans():
    """
    Get all overdue loans (Admin only)
    
    Returns:
        200: List of overdue loans
        403: Admin access required
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        today = datetime.utcnow()
        
        overdue_loans = Loan.query.filter(
            Loan.status.in_(['active', 'overdue']),
            Loan.due_date < today
        ).order_by(Loan.due_date.asc()).all()
        
        return jsonify([loan.to_dict() for loan in overdue_loans]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500