"""
Test JWT token generation and validation
"""
from app import create_app, db
from app.models import User
from flask_jwt_extended import create_access_token, decode_token

app = create_app()

with app.app_context():
    # Get admin user
    admin = User.query.filter_by(email='admin@library.com').first()
    
    if not admin:
        print("❌ Admin user not found!")
        print("Run: python create_admin.py")
    else:
        print("✅ Admin user found:", admin.email)
        
        # Create token
        token = create_access_token(identity=admin.id)
        print("\n🔑 Generated Token:")
        print(token)
        print(f"\nToken length: {len(token)} characters")
        
        # Verify token
        try:
            decoded = decode_token(token)
            print("\n✅ Token is valid!")
            print(f"User ID: {decoded['sub']}")
        except Exception as e:
            print(f"\n❌ Token validation failed: {e}")
        
        # Print config
        print("\n📋 JWT Configuration:")
        print(f"JWT_SECRET_KEY: {app.config['JWT_SECRET_KEY'][:20]}...")
        print(f"JWT_ACCESS_TOKEN_EXPIRES: {app.config['JWT_ACCESS_TOKEN_EXPIRES']}")