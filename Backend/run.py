"""
Application Entry Point
Run this file to start the Flask server
"""
from app import create_app, db

# Create Flask app
app = create_app()


@app.route('/')
def index():
    """Root endpoint"""
    return {
        'message': 'Library Management System API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'auth': '/api/auth',
            'books': '/api/books',
            'loans': '/api/loans',
            'users': '/api/users'
        }
    }, 200


@app.cli.command()
def init_db():
    """Initialize the database"""
    db.create_all()
    print("Database initialized successfully!")


@app.cli.command()
def drop_db():
    """Drop all database tables"""
    db.drop_all()
    print("Database dropped successfully!")


if __name__ == '__main__':
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
        print("Database tables created!")
    
    # Run development server
    app.run(debug=True, host='0.0.0.0', port=5000)