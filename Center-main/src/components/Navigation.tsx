import { Navbar, Nav, Container } from 'react-bootstrap';
import { Logo } from './Logo';

interface NavigationProps {
  currentPage: 'home' | 'books' | 'about';
  onNavigate: (page: 'home' | 'books' | 'about') => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm" style={{ borderBottom: '1px solid #dee2e6' }}>
      <Container>
        <Navbar.Brand 
          onClick={() => onNavigate('home')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <Logo size={45} />
          <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2b6cb0' }}>
            Center
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              onClick={() => onNavigate('home')}
              active={currentPage === 'home'}
              style={{ fontWeight: currentPage === 'home' ? '600' : '400' }}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              onClick={() => onNavigate('books')}
              active={currentPage === 'books'}
              style={{ fontWeight: currentPage === 'books' ? '600' : '400' }}
            >
              Books
            </Nav.Link>
            <Nav.Link 
              onClick={() => onNavigate('about')}
              active={currentPage === 'about'}
              style={{ fontWeight: currentPage === 'about' ? '600' : '400' }}
            >
              About Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
