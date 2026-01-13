import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { api } from '../../services/api';

interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  borrowedCopies: number;
  availableCopies: number;
  overdueLoans: number;
  totalCategories: number;
  activeLoans: number;
}

export function AdminDashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.getStatistics();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container fluid className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Dashboard Overview</h2>

      {error && (
        <div className="alert alert-warning mb-4">
          {error}
        </div>
      )}

      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div
                  className="me-3"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-muted mb-1 small">Total Books</p>
                  <h3 className="mb-0">{stats?.totalBooks || 0}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div
                  className="me-3"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-muted mb-1 small">Total Members</p>
                  <h3 className="mb-0">{stats?.totalMembers || 0}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div
                  className="me-3"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="text-muted mb-1 small">Books Borrowed</p>
                  <h3 className="mb-0">{stats?.borrowedCopies || 0}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div
                  className="me-3"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="text-muted mb-1 small">Available Books</p>
                  <h3 className="mb-0">{stats?.availableCopies || 0}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Library Summary</h5>
              <Row>
                <Col md={6}>
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <span className="text-muted">Total Copies</span>
                    <strong>{stats?.totalBooks || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <span className="text-muted">Available Copies</span>
                    <strong className="text-success">{stats?.availableCopies || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Borrowed Copies</span>
                    <strong className="text-primary">{stats?.borrowedCopies || 0}</strong>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <span className="text-muted">Active Loans</span>
                    <strong>{stats?.activeLoans || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <span className="text-muted">Overdue Books</span>
                    <strong className="text-danger">{stats?.overdueLoans || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Total Members</span>
                    <strong>{stats?.totalMembers || 0}</strong>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Quick Stats</h5>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <span className="text-muted">Categories</span>
                <strong>{stats?.totalCategories || 0}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <span className="text-muted">Overdue Books</span>
                <strong className="text-danger">{stats?.overdueLoans || 0}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Active Members</span>
                <strong className="text-success">{stats?.totalMembers || 0}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
