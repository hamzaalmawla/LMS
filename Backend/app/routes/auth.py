"""
Authentication Routes
Handles user registration, login, and authentication
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User
from app.utils import validate_email

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    
    Request Body:
        {
            "name": "string",
            "email": "string",
            "phone": "string" (optional),
            "password": "string"
        }
    
    Returns:
        201: User created successfully
        400: Invalid input or email already exists
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Validate password length
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Create new user
        user = User(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone', '')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user
    
    Request Body:
        {
            "email": "string",
            "password": "string"
        }
    
    Returns:
        200: Login successful with token
        400: Missing credentials
        401: Invalid credentials
        403: Account inactive
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('email', 'password')):
            return jsonify({'error': 'Missing email or password'}), 400
        
        # Find user
        user = User.query.filter_by(email=data['email']).first()
        
        # Verify user and password
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check if account is active
        if not user.is_active:
            return jsonify({'error': 'Account is inactive. Please contact admin.'}), 403
        
        # Create access token with string identity
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get current logged-in user information
    
    Headers:
        Authorization: Bearer <token>
    
    Returns:
        200: User information
        404: User not found
    """
    try:
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Logout user (client-side token removal)
    
    Note: JWT tokens are stateless, so logout is handled client-side
    
    Returns:
        200: Logout successful message
    """
    return jsonify({'message': 'Logout successful'}), 200