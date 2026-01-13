import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface UserHomePageProps {
  onNavigate: (page: 'home' | 'books' | 'about') => void;
}

export function UserHomePage({ onNavigate }: UserHomePageProps) {
  return (
    <>
      {/* Hero Section */}
      <div 
        className="text-white py-5" 
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4">Welcome to Center</h1>
              <p className="lead mb-4" style={{ fontSize: '1.25rem' }}>
                Your gateway to endless knowledge and discovery. Explore our vast collection 
                of books, manage your reading journey, and connect with a community of readers.
              </p>
              <div className="d-flex gap-3">
                <Button 
                  variant="light" 
                  size="lg"
                  onClick={() => onNavigate('books')}
                  style={{ fontWeight: '600' }}
                >
                  Browse Books
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  onClick={() => onNavigate('about')}
                  style={{ fontWeight: '600' }}
                >
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1582203914614-e23623afc345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwcmVhZGluZyUyMGJvb2tzfGVufDF8fHx8MTc2Nzk3OTYxM3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Library"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5 my-5">
        <h2 className="text-center mb-5 fw-bold" style={{ fontSize: '2.5rem', color: '#2c3e50' }}>
          Why Choose Center?
        </h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div 
                  className="mb-3 mx-auto" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <h4 className="mb-3">Vast Collection</h4>
                <p className="text-muted">
                  Access thousands of books across multiple genres and categories. 
                  From classic literature to modern bestsellers.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div 
                  className="mb-3 mx-auto" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h4 className="mb-3">Easy Management</h4>
                <p className="text-muted">
                  Seamlessly manage your reading list, check out books, and track due dates 
                  with our intuitive interface.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div 
                  className="mb-3 mx-auto" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h4 className="mb-3">Community</h4>
                <p className="text-muted">
                  Join a vibrant community of readers and book enthusiasts. 
                  Share your thoughts and discover new favorites.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Statistics Section */}
      <div className="bg-white py-5">
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-4 mb-md-0">
              <h2 className="fw-bold mb-2" style={{ color: '#667eea', fontSize: '3rem' }}>5000+</h2>
              <p className="text-muted">Books Available</p>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <h2 className="fw-bold mb-2" style={{ color: '#f5576c', fontSize: '3rem' }}>1200+</h2>
              <p className="text-muted">Active Members</p>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <h2 className="fw-bold mb-2" style={{ color: '#4facfe', fontSize: '3rem' }}>50+</h2>
              <p className="text-muted">Categories</p>
            </Col>
            <Col md={3}>
              <h2 className="fw-bold mb-2" style={{ color: '#f093fb', fontSize: '3rem' }}>24/7</h2>
              <p className="text-muted">Access</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action */}
      <Container className="py-5 my-5 text-center">
        <h2 className="mb-4 fw-bold" style={{ fontSize: '2.5rem' }}>Ready to Start Your Journey?</h2>
        <p className="lead mb-4 text-muted">
          Explore our collection and find your next great read today.
        </p>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => onNavigate('books')}
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            fontWeight: '600',
            padding: '12px 40px'
          }}
        >
          Explore Books
        </Button>
      </Container>
    </>
  );
}
