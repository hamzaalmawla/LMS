import { useState } from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { User } from '../../App';
import { Logo } from '../Logo';
import { AdminBooksPage } from './AdminBooksPage';
import { AdminMembersPage } from './AdminMembersPage';
import { AdminDashboardHome } from './AdminDashboardHome';
import { AdminHistoryPage } from './AdminHistoryPage';
import { AdminBorrowedBooksPage } from './AdminBorrowedBooksPage';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activePage, setActivePage] = useState<'home' | 'books' | 'borrowed' | 'members' | 'history'>('home');

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Admin Navigation */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <Logo size={40} />
            <div>
              <span style={{ fontSize: '1.3rem', fontWeight: '600' }}>Center</span>
              <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Admin Dashboard</small>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar-nav" />
          <Navbar.Collapse id="admin-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                active={activePage === 'home'}
                onClick={() => setActivePage('home')}
                style={{ fontWeight: activePage === 'home' ? '600' : '400' }}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link 
                active={activePage === 'books'}
                onClick={() => setActivePage('books')}
                style={{ fontWeight: activePage === 'books' ? '600' : '400' }}
              >
                Books
              </Nav.Link>
              <Nav.Link 
                active={activePage === 'borrowed'}
                onClick={() => setActivePage('borrowed')}
                style={{ fontWeight: activePage === 'borrowed' ? '600' : '400' }}
              >
                Borrowed Books
              </Nav.Link>
              <Nav.Link 
                active={activePage === 'members'}
                onClick={() => setActivePage('members')}
                style={{ fontWeight: activePage === 'members' ? '600' : '400' }}
              >
                Members
              </Nav.Link>
              <Nav.Link 
                active={activePage === 'history'}
                onClick={() => setActivePage('history')}
                style={{ fontWeight: activePage === 'history' ? '600' : '400' }}
              >
                History
              </Nav.Link>
            </Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ verticalAlign: 'middle' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {user.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item disabled>
                  <small className="text-muted">{user.email}</small>
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
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Page Content */}
      {activePage === 'home' && <AdminDashboardHome />}
      {activePage === 'books' && <AdminBooksPage />}
      {activePage === 'borrowed' && <AdminBorrowedBooksPage />}
      {activePage === 'members' && <AdminMembersPage />}
      {activePage === 'history' && <AdminHistoryPage />}
    </div>
  );
}