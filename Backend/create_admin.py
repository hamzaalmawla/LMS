"""
Database Setup Script
Creates database tables, admin user, and sample data
"""
from app import create_app, db
from app.models import User, Category, Book
from datetime import datetime

app = create_app()


def create_tables():
    """Create all database tables"""
    with app.app_context():
        db.create_all()
        print("✓ Database tables created")


def create_admin_user():
    """Create default admin user"""
    with app.app_context():
        # Check if admin exists
        admin = User.query.filter_by(email='admin@library.com').first()
        
        if not admin:
            admin = User(
                name='Admin User',
                email='admin@library.com',
                phone='1234567890',
                role='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("✓ Admin user created")
            print("  Email: admin@library.com")
            print("  Password: admin123")
        else:
            print("✓ Admin user already exists")


def create_categories():
    """Create default categories"""
    with app.app_context():
        categories = [
            'Fiction', 'Non-Fiction', 'Science', 'History',
            'Technology', 'Arts', 'Biography', 'Fantasy',
            'Mystery', 'Romance'
        ]
        
        created_count = 0
        for cat_name in categories:
            if not Category.query.filter_by(name=cat_name).first():
                category = Category(name=cat_name)
                db.session.add(category)
                created_count += 1
        
        db.session.commit()
        print(f"✓ {created_count} categories created")


def create_sample_books():
    """Create sample books"""
    with app.app_context():
        # Get categories
        fiction = Category.query.filter_by(name='Fiction').first()
        science = Category.query.filter_by(name='Science').first()
        tech = Category.query.filter_by(name='Technology').first()
        
        sample_books = [
            {
                'isbn': '9780141439518',
                'title': 'Pride and Prejudice',
                'author': 'Jane Austen',
                'category_id': fiction.id if fiction else None,
                'total_copies': 3,
                'publication_year': 1813,
                'description': 'A romantic novel of manners.'
            },
            {
                'isbn': '9780393319928',
                'title': 'A Brief History of Time',
                'author': 'Stephen Hawking',
                'category_id': science.id if science else None,
                'total_copies': 2,
                'publication_year': 1988,
                'description': 'From the Big Bang to black holes.'
            },
            {
                'isbn': '9780135957059',
                'title': 'The Pragmatic Programmer',
                'author': 'David Thomas',
                'category_id': tech.id if tech else None,
                'total_copies': 2,
                'publication_year': 1999,
                'description': 'Your journey to mastery.'
            }
        ]
        
        created_count = 0
        for book_data in sample_books:
            if not Book.query.filter_by(isbn=book_data['isbn']).first():
                book = Book(**book_data)
                book.available_copies = book.total_copies
                db.session.add(book)
                created_count += 1
        
        db.session.commit()
        print(f"✓ {created_count} sample books created")


def main():
    """Run all setup functions"""
    print("\n=== Library Management System - Database Setup ===\n")
    
    create_tables()
    create_admin_user()
    create_categories()
    create_sample_books()
    
    print("\n=== Setup Complete! ===")
    print("\nYou can now:")
    print("1. Run the server: python run.py")
    print("2. Login as admin:")
    print("   Email: admin@library.com")
    print("   Password: admin123")
    print("\n")


if __name__ == '__main__':
    main()