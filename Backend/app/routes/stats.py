"""
Statistics Routes
Provides statistics and dashboard data for the frontend
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from datetime import datetime, timedelta
from app import db
from app.models import User, Book, Loan, Category

stats_bp = Blueprint('stats', __name__)


def is_admin():
    """Check if current user is admin"""
    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)
    user = User.query.get(user_id)
    return user and user.role == 'admin'


@stats_bp.route('/stats', methods=['GET'])
def get_stats():
    """
    Get general library statistics (public endpoint)
    
    Returns:
        200: Library statistics
    """
    try:
        # Total active books
        total_books = Book.query.filter_by(is_active=True).count()
        
        # Total copies
        total_copies = db.session.query(func.sum(Book.total_copies))\
            .filter_by(is_active=True).scalar() or 0
        
        # Available copies
        available_copies = db.session.query(func.sum(Book.available_copies))\
            .filter_by(is_active=True).scalar() or 0
        
        # Total members
        total_members = User.query.filter_by(role='member', is_active=True).count()
        
        # Active loans
        active_loans = Loan.query.filter_by(status='active').count()
        
        # Overdue loans
        today = datetime.utcnow()
        overdue_loans = Loan.query.filter(
            Loan.status == 'active',
            Loan.due_date < today
        ).count()
        
        # Total categories
        total_categories = Category.query.count()
        
        return jsonify({
            'totalBooks': total_books,
            'totalCopies': int(total_copies),
            'availableCopies': int(available_copies),
            'borrowedCopies': int(total_copies) - int(available_copies),
            'totalMembers': total_members,
            'activeLoans': active_loans,
            'overdueLoans': overdue_loans,
            'totalCategories': total_categories
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@stats_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """
    Get detailed dashboard data (Admin only)
    
    Returns:
        200: Dashboard data with stats, charts, and recent activity
        403: Admin access required
    """
    try:
        if not is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        today = datetime.utcnow()
        week_ago = today - timedelta(days=7)
        
        # === Quick Stats ===
        total_books = Book.query.filter_by(is_active=True).count()
        total_copies = db.session.query(func.sum(Book.total_copies))\
            .filter_by(is_active=True).scalar() or 0
        available_copies = db.session.query(func.sum(Book.available_copies))\
            .filter_by(is_active=True).scalar() or 0
        total_members = User.query.filter_by(role='member').count()
        active_members = User.query.filter_by(role='member', is_active=True).count()
        active_loans = Loan.query.filter_by(status='active').count()
        
        overdue_loans = Loan.query.filter(
            Loan.status == 'active',
            Loan.due_date < today
        ).count()
        
        # Total fines pending
        total_fines = db.session.query(func.sum(Loan.fine_amount))\
            .filter(Loan.fine_amount > 0, Loan.return_date.is_(None)).scalar() or 0
        
        # === Books by Category ===
        books_by_category = db.session.query(
            Category.name,
            func.count(Book.id).label('count')
        ).outerjoin(Book, Book.category_id == Category.id)\
         .filter(Book.is_active == True)\
         .group_by(Category.id, Category.name).all()
        
        # === Recent Loans (last 10) ===
        recent_loans = Loan.query\
            .order_by(Loan.borrow_date.desc())\
            .limit(10).all()
        
        # === Popular Books (most borrowed) ===
        popular_books = db.session.query(
            Book.id,
            Book.title,
            Book.author,
            func.count(Loan.id).label('borrow_count')
        ).join(Loan).filter(Book.is_active == True)\
         .group_by(Book.id)\
         .order_by(func.count(Loan.id).desc())\
         .limit(5).all()
        
        # === Loans this week ===
        loans_this_week = Loan.query.filter(
            Loan.borrow_date >= week_ago
        ).count()
        
        # === Returns this week ===
        returns_this_week = Loan.query.filter(
            Loan.return_date >= week_ago,
            Loan.status == 'returned'
        ).count()
        
        # === Overdue Books Details ===
        overdue_books = Loan.query.filter(
            Loan.status == 'active',
            Loan.due_date < today
        ).order_by(Loan.due_date.asc()).limit(10).all()
        
        return jsonify({
            'stats': {
                'totalBooks': total_books,
                'totalCopies': int(total_copies),
                'availableCopies': int(available_copies),
                'borrowedCopies': int(total_copies) - int(available_copies),
                'totalMembers': total_members,
                'activeMembers': active_members,
                'activeLoans': active_loans,
                'overdueLoans': overdue_loans,
                'totalFinesPending': round(float(total_fines), 2),
                'loansThisWeek': loans_this_week,
                'returnsThisWeek': returns_this_week
            },
            'booksByCategory': [
                {'name': cat.name, 'count': cat.count}
                for cat in books_by_category
            ],
            'popularBooks': [
                {
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'borrowCount': book.borrow_count
                }
                for book in popular_books
            ],
            'recentLoans': [loan.to_dict() for loan in recent_loans],
            'overdueBooks': [
                {
                    'id': loan.id,
                    'book': loan.book.to_dict(),
                    'user': loan.user.to_dict(),
                    'dueDate': loan.due_date.isoformat(),
                    'daysOverdue': (today - loan.due_date).days
                }
                for loan in overdue_books
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
