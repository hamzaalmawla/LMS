import { useState } from 'react';
import { Container, Navbar, Nav, Button, Modal, Form, Alert, Dropdown } from 'react-bootstrap';
import { User } from '../../App';
import { Logo } from '../Logo';
import { UserBooksPage } from './UserBooksPage';
import { UserHomePage } from './UserHomePage';
import { UserAboutPage } from './UserAboutPage';
import { UserMyBooksPage } from './UserMyBooksPage';
import { UserHistoryPage } from './UserHistoryPage';
import { UserProfilePage } from './UserProfilePage';
import { api } from '../../services/api';

interface UserDashboardProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export function UserDashboard({ user, onLogin, onLogout }: UserDashboardProps) {
  const [activePage, setActivePage] = useState<'home' | 'books' | 'my-books' | 'history' | 'profile' | 'about'>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const response = await api.login(loginEmail, loginPassword);
      const loggedInUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        token: response.token
      };
      onLogin(loggedInUser);
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error: any) {
      setLoginError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setSignupError('Please fill in all fields');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.signup(signupName, signupEmail, signupPassword);
      const newUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        token: response.token
      };
      onLogin(newUser);
      setShowSignupModal(false);
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
    } catch (error: any) {
      setSignupError(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setLoginError('');
    setLoginEmail('');
    setLoginPassword('');
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setSignupError('');
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setShowLoginModal(true);
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* User Navigation */}
      <Navbar bg="white" expand="lg" className="shadow-sm" style={{ borderBottom: '1px solid #dee2e6' }}>
        <Container>
          <Navbar.Brand className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => setActivePage('home')}>
            <Logo size={45} />
            <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2b6cb0' }}>
              Center
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="user-navbar-nav" />
          <Navbar.Collapse id="user-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                active={activePage === 'home'}
                onClick={() => setActivePage('home')}
                style={{ fontWeight: activePage === 'home' ? '600' : '400' }}
              >
                Home
              </Nav.Link>
              <Nav.Link 
                active={activePage === 'books'}
                onClick={() => setActivePage('books')}
                style={{ fontWeight: activePage === 'books' ? '600' : '400' }}
              >
                Books
              </Nav.Link>
              {user && (
                <>
                  <Nav.Link 
                    active={activePage === 'my-books'}
                    onClick={() => setActivePage('my-books')}
                    style={{ fontWeight: activePage === 'my-books' ? '600' : '400' }}
                  >
                    My Books
                  </Nav.Link>
                  <Nav.Link 
                    active={activePage === 'history'}
                    onClick={() => setActivePage('history')}
                    style={{ fontWeight: activePage === 'history' ? '600' : '400' }}
                  >
                    History
                  </Nav.Link>
                </>
              )}
              <Nav.Link 
                active={activePage === 'about'}
                onClick={() => setActivePage('about')}
                style={{ fontWeight: activePage === 'about' ? '600' : '400' }}
              >
                About Us
              </Nav.Link>
            </Nav>
            <div className="d-flex gap-2 align-items-center">
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ verticalAlign: 'middle' }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setActivePage('profile')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={onLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Button 
                    variant="outline-primary"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={() => setShowSignupModal(true)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Page Content */}
      {activePage === 'home' && <UserHomePage onNavigate={setActivePage} />}
      {activePage === 'books' && <UserBooksPage user={user} onShowLogin={() => setShowLoginModal(true)} />}
      {activePage === 'my-books' && user && <UserMyBooksPage user={user} />}
      {activePage === 'history' && user && <UserHistoryPage user={user} />}
      {activePage === 'profile' && user && <UserProfilePage user={user} onUpdateUser={onLogin} />}
      {activePage === 'about' && <UserAboutPage />}

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => { setShowLoginModal(false); setLoginError(''); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign In to Center</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <Logo size={50} />
          </div>
          
          {loginError && <Alert variant="danger">{loginError}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mb-3"
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                fontWeight: '600'
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form>

          <div className="text-center">
            <p className="text-muted mb-2">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0"
                onClick={switchToSignup}
                style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}
              >
                Sign Up
              </Button>
            </p>
            <div className="mt-3 pt-3 border-top">
              <p className="small text-muted mb-1">Demo Credentials:</p>
              <p className="small mb-0">Admin: admin@center.com / admin123</p>
              <p className="small mb-0">User: user@center.com / user123</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={() => { setShowSignupModal(false); setSignupError(''); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <Logo size={50} />
          </div>

          {signupError && <Alert variant="danger">{signupError}</Alert>}

          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mb-3"
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                fontWeight: '600'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Form>

          <div className="text-center">
            <p className="text-muted mb-0">
              Already have an account?{' '}
              <Button
                variant="link"
                className="p-0"
                onClick={switchToLogin}
                style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}
              >
                Sign In
              </Button>
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
