import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { User } from '../../App';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { api, BorrowedBook } from '../../services/api';
import { mockCurrentBorrows } from '../../data/mockBorrowHistory';

interface UserMyBooksPageProps {
  user: User;
}

export function UserMyBooksPage({ user }: UserMyBooksPageProps) {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [returning, setReturning] = useState<string | null>(null);

  useEffect(() => {
    loadBorrowedBooks();
  }, [user.id]);

  const loadBorrowedBooks = async () => {
    setLoading(true);
    
    if (!api.isConfigured()) {
      // Use mock data when backend is not configured
      setBorrowedBooks(mockCurrentBorrows);
      setUsingMockData(true);
      setLoading(false);
      return;
    }

    try {
      const response = await api.getCurrentBorrows(user.id);
      setBorrowedBooks(response.borrows || response || []);
      setUsingMockData(false);
    } catch (err: any) {
      console.error('Failed to load borrowed books:', err);
      // Fallback to mock data
      setBorrowedBooks(mockCurrentBorrows);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowId: string) => {
    if (usingMockData) {
      alert('This is a demo. Connect to the backend to enable book returns.');
      return;
    }

    setReturning(borrowId);
    
    try {
      await api.returnBook(borrowId);
      await loadBorrowedBooks();
    } catch (err: any) {
      alert(err.message || 'Failed to return book');
    } finally {
      setReturning(null);
    }
  };

  const calculateDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <>
      <div 
        className="text-white py-4" 
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Container>
          <h1 className="fw-bold mb-2">My Borrowed Books</h1>
          <p className="mb-0">Currently borrowing {borrowedBooks.length} book{borrowedBooks.length !== 1 ? 's' : ''}</p>
        </Container>
      </div>

      <Container className="py-4">
        {usingMockData && (
          <Alert variant="info" className="mb-4">
            <strong>Demo Mode:</strong> Connect to the backend to see your actual borrowed books. Currently showing sample data.
          </Alert>
        )}

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3">Loading your books...</p>
          </div>
        )}

        {!loading && borrowedBooks.length === 0 && (
          <Card className="text-center py-5 border-0 shadow-sm">
            <Card.Body>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" className="mb-3">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <h5 className="text-muted">No books borrowed</h5>
              <p className="text-muted">Browse our collection and borrow your first book!</p>
            </Card.Body>
          </Card>
        )}

        {!loading && borrowedBooks.length > 0 && (
          <Row className="g-4">
            {borrowedBooks.map(borrow => {
              const overdue = isOverdue(borrow.dueDate);
              const daysOverdue = calculateDaysOverdue(borrow.dueDate);
              
              return (
                <Col key={borrow.id} md={6} lg={4}>
                  <Card className={`h-100 shadow-sm ${overdue ? 'border-danger' : 'border-0'}`}>
                    <Row className="g-0">
                      <Col xs={4}>
                        <ImageWithFallback
                          src={borrow.bookCoverImage || ''}
                          alt={borrow.bookTitle}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover'
                          }}
                        />
                      </Col>
                      <Col xs={8}>
                        <Card.Body>
                          <h6 className="fw-bold mb-2">{borrow.bookTitle}</h6>
                          <p className="text-muted small mb-3">by {borrow.bookAuthor}</p>
                          
                          <div className="mb-2">
                            <small className="text-muted d-block">Borrowed:</small>
                            <small>{new Date(borrow.borrowDate).toLocaleDateString()}</small>
                          </div>
                          
                          <div className="mb-3">
                            <small className="text-muted d-block">Due Date:</small>
                            <small className={overdue ? 'text-danger fw-bold' : ''}>
                              {new Date(borrow.dueDate).toLocaleDateString()}
                            </small>
                          </div>

                          {overdue && (
                            <Alert variant="danger" className="py-2 mb-2">
                              <small className="mb-0">
                                <strong>Overdue by {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}</strong>
                                {borrow.fine && borrow.fine > 0 && (
                                  <div className="mt-1">Fine: ${borrow.fine.toFixed(2)}</div>
                                )}
                              </small>
                            </Alert>
                          )}

                          <Button
                            variant={overdue ? 'danger' : 'success'}
                            size="sm"
                            className="w-100"
                            onClick={() => handleReturnBook(borrow.id)}
                            disabled={returning === borrow.id}
                          >
                            {returning === borrow.id ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Returning...
                              </>
                            ) : (
                              'Return Book'
                            )}
                          </Button>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </>
  );
}
