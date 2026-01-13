"""
Application Factory Module
Initializes Flask app and extensions
"""
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from app.config import Config

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
mail = Mail()


def create_app(config_class=Config):
    """
    Create and configure Flask application
    
    Args:
        config_class: Configuration class to use
        
    Returns:
        Flask application instance
    """
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Disable strict slashes to prevent 308 redirects on API calls
    app.url_map.strict_slashes = False
    
    # Initialize extensions with app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    # Configure CORS with explicit settings for all origins and methods
    CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})
    mail.init_app(app)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.books import books_bp
    from app.routes.loans import loans_bp
    from app.routes.users import users_bp
    from app.routes.stats import stats_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(books_bp, url_prefix='/api/books')
    app.register_blueprint(loans_bp, url_prefix='/api/loans')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(stats_bp, url_prefix='/api')
    
    # Global error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Authorization token is missing'}), 401
    
    # Health check endpoint
    @app.route('/api/health')
    def health():
        return jsonify({
            'status': 'healthy',
            'message': 'Library Management System API is running'
        }), 200
    
    return app