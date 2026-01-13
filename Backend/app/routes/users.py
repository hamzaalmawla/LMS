"""
Users Routes
Handles user management, profiles, and fines
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app import db
from app.models import User, Loan, Book, Category

users_bp = Blueprint('users', __name__)


def is_admin():
    """Check if current user is admin"""
    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)
    user = User.query.get(user_id)
    return user and user.role == 'admin'


@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """
    Get current user profile
    
    Returns:
        200: User profile
        404: User not found
    """
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """
    Update current user profile
    
    Request Body: (all optional)
        {
            "name": "string",
            "phone": "string",
            "password": "string"
        }
    
    Returns:
        200: Profile updated
        400: Invalid input
    """
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'name' in data and data['name']:
            user.name = data['name']
        
        if 'phone' in data:
            user.phone = data['phone']
        
        if 'password' in data and data['password']:
            if len(data['password']) < 6:
                return jsonify({'error': 'Password must be at least 6 characters'}), 400
            user.set_password(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@users_bp.route('/fines', methods=['GET'])
@jwt_required()
def get_fines():
    """
    Get current user's fines
    
    Returns:
        200: Fine details
    """
    try:
        user_id = int(get_jwt_identity())
        
        # Get all loans with fines that haven't been returned
        loans_with_fines = Loan.query.filter(
            Loan.user_id == user_id,
            Loan.fine_amount > 0
        ).all()
        
        total_fines = sum(loan.fine_amount for loan in loans_with_fines if not loan.return_date)
        
        return jsonify({
            'total_fines': round(total_fines, 2),
            'loans': [loan.to_dict() for loan in loans_with_fines]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/fines/pay', methods=['POST'])
@jwt_required()
def pay_fine():
    """
    Pay fine for a loan
    
    Request Body:
        {
            "loan_id": integer,
            "amount": float
        }
    
    Returns:
        200: Fine paid successfully
        400: Invalid input or insufficient payment
        403: Unauthorized
        404: Loan not found
    """
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if 'loan_id' not in data or 'amount' not in data:
            return jsonify({'error': 'Loan ID and amount are required'}), 400
        
        loan_id = data['loan_id']
        amount = float(data['amount'])
        
        loan = Loan.query.get_or_404(loan_id)
        
        # Verify loan belongs to user
        if loan.user_id != user_id:
            return jsonify({'error': 'Unauthorized to pay this fine'}), 403
        
        # Validate payment amount
        if amount < loan.fine_amount:
            return jsonify({'error': 'Insufficient payment amount'}), 400
        
        # Pay fine
        loan.fine_amount = 0
        db.session.commit()
        
        return jsonify({
            'message': 'Fine paid successfully',
            'loan': loan.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============= ADMIN ROUTES =============

@users_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_users():
    """
    Get all users (Admin only)
    
    Returns:
        200: List of all users
        403: Admin access required
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """
    Get user by ID (Admin only)
    
    Parameters:
        user_id: User ID
    
    Returns:
        200: User details
        403: Admin access required
        404: User not found
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """
    Update user (Admin only)
    
    Parameters:
        user_id: User ID
    
    Request Body: (all optional)
        {
            "name": "string",
            "email": "string",
            "phone": "string",
            "role": "string",
            "is_active": boolean
        }
    
    Returns:
        200: User updated
        403: Admin access required
        404: User not found
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        if 'phone' in data:
            user.phone = data['phone']
        if 'role' in data and data['role'] in ['admin', 'member']:
            user.role = data['role']
        if 'is_active' in data:
            user.is_active = bool(data['is_active'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@users_bp.route('/<int:user_id>/toggle-status', methods=['POST'])
@jwt_required()
def toggle_user_status(user_id):
    """
    Toggle user active status (Admin only)
    
    Parameters:
        user_id: User ID
    
    Returns:
        200: Status toggled
        403: Admin access required
        404: User not found
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        user = User.query.get_or_404(user_id)
        user.is_active = not user.is_active
        db.session.commit()
        
        status = 'activated' if user.is_active else 'deactivated'
        
        return jsonify({
            'message': f'User {status} successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@users_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """
    Delete user (Admin only)
    
    Parameters:
        user_id: User ID
    
    Returns:
        200: User deleted
        400: Cannot delete admin or user with active loans
        403: Admin access required
        404: User not found
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        user = User.query.get_or_404(user_id)
        
        # Cannot delete admin users
        if user.role == 'admin':
            return jsonify({'error': 'Cannot delete admin users'}), 400
        
        # Check if user has active loans
        active_loans = Loan.query.filter_by(user_id=user_id, status='active').count()
        if active_loans > 0:
            return jsonify({'error': 'Cannot delete user with active loans'}), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============= REPORTS ROUTES =============

@users_bp.route('/reports/usage', methods=['GET'])
@jwt_required()
def get_usage_report():
    """
    Get library usage statistics (Admin only)
    
    Returns:
        200: Usage statistics
        403: Admin access required
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        # Most borrowed books
        most_borrowed = db.session.query(
            Book.id,
            Book.title,
            Book.author,
            func.count(Loan.id).label('borrow_count')
        ).join(Loan).group_by(Book.id)\
         .order_by(func.count(Loan.id).desc()).limit(10).all()
        
        # Active members
        active_members = db.session.query(
            User.id,
            User.name,
            User.email,
            func.count(Loan.id).label('loan_count')
        ).join(Loan).filter(User.role == 'member')\
         .group_by(User.id)\
         .order_by(func.count(Loan.id).desc()).limit(10).all()
        
        # Currently overdue count
        from datetime import datetime
        overdue_count = Loan.query.filter(
            Loan.status.in_(['active', 'overdue']),
            Loan.due_date < datetime.utcnow()
        ).count()
        
        # Total active loans
        active_loans_count = Loan.query.filter_by(status='active').count()
        
        return jsonify({
            'most_borrowed': [
                {
                    'id': b.id,
                    'title': b.title,
                    'author': b.author,
                    'count': b.borrow_count
                } for b in most_borrowed
            ],
            'active_members': [
                {
                    'id': m.id,
                    'name': m.name,
                    'email': m.email,
                    'loans': m.loan_count
                } for m in active_members
            ],
            'overdue_count': overdue_count,
            'active_loans': active_loans_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/reports/inventory', methods=['GET'])
@jwt_required()
def get_inventory_report():
    """
    Get inventory statistics (Admin only)
    
    Returns:
        200: Inventory statistics
        403: Admin access required
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        # Total books and copies
        total_books = Book.query.filter_by(is_active=True).count()
        total_copies = db.session.query(func.sum(Book.total_copies))\
            .filter_by(is_active=True).scalar() or 0
        available_copies = db.session.query(func.sum(Book.available_copies))\
            .filter_by(is_active=True).scalar() or 0
        borrowed_copies = total_copies - available_copies
        
        # Books by category
        books_by_category = db.session.query(
            Category.name,
            func.count(Book.id).label('count')
        ).outerjoin(Book).filter(Book.is_active == True)\
         .group_by(Category.id, Category.name).all()
        
        # Total members
        total_members = User.query.filter_by(role='member').count()
        
        return jsonify({
            'total_books': total_books,
            'total_copies': int(total_copies),
            'available_copies': int(available_copies),
            'borrowed_copies': int(borrowed_copies),
            'total_members': total_members,
            'books_by_category': [
                {'category': c.name, 'count': c.count}
                for c in books_by_category
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500