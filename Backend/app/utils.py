"""
Utility Functions
Helper functions for business logic
"""
import re
from datetime import datetime, timedelta
from app import db
from app.models import Loan
from app.config import Config


def calculate_fines():
    """
    Calculate fines for all overdue loans
    Run this as a scheduled task (cron job)
    """
    today = datetime.utcnow()
    grace_end_date = today - timedelta(days=Config.GRACE_PERIOD_DAYS)
    
    # Get all active loans that are past grace period
    overdue_loans = Loan.query.filter(
        Loan.status == 'active',
        Loan.due_date < grace_end_date
    ).all()
    
    for loan in overdue_loans:
        # Calculate days overdue (excluding grace period)
        days_overdue = (today - loan.due_date).days - Config.GRACE_PERIOD_DAYS
        
        if days_overdue > 0:
            loan.fine_amount = days_overdue * Config.FINE_PER_DAY
            loan.status = 'overdue'
    
    db.session.commit()
    return len(overdue_loans)


def send_due_date_reminder(loan):
    """
    Send email reminder for upcoming due date
    
    Args:
        loan: Loan object to send reminder for
    """
    from flask_mail import Message
    from app import mail
    
    try:
        subject = "Book Due Date Reminder - Library Management System"
        body = f"""
        Dear {loan.user.name},
        
        This is a reminder that the following book is due soon:
        
        Book: {loan.book.title}
        Author: {loan.book.author}
        Due Date: {loan.due_date.strftime('%Y-%m-%d')}
        
        Please return the book on time to avoid late fees.
        
        Thank you,
        Library Management System
        """
        
        msg = Message(subject=subject, recipients=[loan.user.email], body=body)
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False


def send_overdue_notification(loan):
    """
    Send email notification for overdue book
    
    Args:
        loan: Loan object to send notification for
    """
    from flask_mail import Message
    from app import mail
    
    try:
        subject = "Overdue Book Notification - Library Management System"
        body = f"""
        Dear {loan.user.name},
        
        The following book is overdue:
        
        Book: {loan.book.title}
        Author: {loan.book.author}
        Due Date: {loan.due_date.strftime('%Y-%m-%d')}
        Days Overdue: {(datetime.utcnow() - loan.due_date).days}
        Fine Amount: ${loan.fine_amount:.2f}
        
        Please return the book as soon as possible.
        
        Thank you,
        Library Management System
        """
        
        msg = Message(subject=subject, recipients=[loan.user.email], body=body)
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False


def validate_isbn(isbn):
    """
    Validate ISBN format (13 digits)
    
    Args:
        isbn: ISBN string to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not isbn:
        return False
    
    # Remove any hyphens or spaces
    isbn = isbn.replace('-', '').replace(' ', '')
    
    # Check if 13 digits
    if len(isbn) != 13 or not isbn.isdigit():
        return False
    
    return True


def validate_email(email):
    """
    Validate email format
    
    Args:
        email: Email string to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not email:
        return False
    
    # Email regex pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None