import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Badge, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { User } from '../../App';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { api, Book } from '../../services/api';
import { mockBooks } from '../../data/mockBooks';

interface UserBooksPageProps {
  user: User | null;
  onShowLogin: () => void;
}

export function UserBooksPage({ user, onShowLogin }: UserBooksPageProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [borrowDuration, setBorrowDuration] = useState<7 | 14 | 21>(14);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);

    try {
      const response = await api.getBooks();
      setBooks(response);
      setUsingMockData(false);
    } catch (err) {
      // Fallback to mock data if API fails
      console.error('Failed to load books:', err);
      setBooks(mockBooks);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(books.map(b => b.category)))];

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);

    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setShowDetailModal(true);
    setBorrowSuccess(false);
    setBorrowDuration(14); // Reset to default
  };

  const handleBorrowBook = async () => {
    if (!user) {
      setShowDetailModal(false);
      onShowLogin();
      return;
    }

    if (!selectedBook) return;

    setBorrowing(true);
    try {
      await api.borrowBook(selectedBook.id, user.id, borrowDuration);
      setBorrowSuccess(true);
      await loadBooks();
      const updatedBook = books.find(b => b.id === selectedBook.id);
      if (updatedBook) {
        setSelectedBook(updatedBook);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to borrow book. Please try again.');
    } finally {
      setBorrowing(false);
    }
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
          <h1 className="fw-bold mb-2">Explore Our Collection</h1>
          <p className="mb-0">{books.length} books available</p>
        </Container>
      </div>

      <Container className="py-4">
        {usingMockData && (
          <Alert variant="info" className="mb-4">
            <strong>Demo Mode:</strong> You're viewing sample data. To connect to the backend, update the API_BASE_URL in /services/api.ts
          </Alert>
        )}

        {/* Filters */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by title, author, or ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="checked-out">Checked Out</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3">Loading books...</p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && (
          <Row className="g-4">
            {filteredBooks.map(book => (
              <Col key={book.id} sm={6} md={4} lg={3}>
                <Card
                  className="h-100 shadow-sm border-0"
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={() => handleViewDetails(book)}
                >
                  <div style={{ height: '300px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                    <ImageWithFallback
                      src={book.coverImage || ''}
                      alt={book.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <Card.Body>
                    <div className="mb-2">
                      <Badge bg="primary" className="me-2">{book.category}</Badge>
                      <Badge bg={book.availableCopies > 0 ? 'success' : 'danger'}>
                        {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'No Copies'}
                      </Badge>
                    </div>
                    <h6 className="fw-bold mb-2" style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {book.title}
                    </h6>
                    <p className="text-muted small mb-1">by {book.author}</p>
                    <p className="text-muted small mb-0">Published: {book.publishYear}</p>
                    <p className="text-muted small mb-0">Copies: {book.availableCopies}/{book.totalCopies}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-5">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" className="mb-3">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <p className="text-muted">No books found matching your criteria.</p>
          </div>
        )}
      </Container>

      {/* Book Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        {selectedBook && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedBook.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {borrowSuccess && (
                <Alert variant="success">
                  Book borrowed successfully! Check your account for due date.
                </Alert>
              )}

              <Row>
                <Col md={4}>
                  <ImageWithFallback
                    src={selectedBook.coverImage || ''}
                    alt={selectedBook.title}
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </Col>
                <Col md={8}>
                  <div className="mb-3">
                    <h5 className="mb-2">{selectedBook.title}</h5>
                    <p className="text-muted mb-1">by {selectedBook.author}</p>
                    <div className="mb-3">
                      <Badge bg="primary" className="me-2">{selectedBook.category}</Badge>
                      <Badge bg={selectedBook.availableCopies > 0 ? 'success' : 'danger'}>
                        {selectedBook.availableCopies > 0 ? `${selectedBook.availableCopies} Available` : 'No Copies'}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="mb-1"><strong>ISBN:</strong> <code>{selectedBook.isbn}</code></p>
                    <p className="mb-1"><strong>Published:</strong> {selectedBook.publishYear}</p>
                    <p className="mb-1"><strong>Total Copies:</strong> {selectedBook.totalCopies}</p>
                    <p className="mb-1"><strong>Available Copies:</strong> {selectedBook.availableCopies}</p>
                  </div>

                  {selectedBook.description && (
                    <div className="mb-3">
                      <h6>Description</h6>
                      <p className="text-muted">{selectedBook.description}</p>
                    </div>
                  )}

                  {selectedBook.status === 'checked-out' && selectedBook.dueDate && (
                    <div className="alert alert-warning">
                      <strong>Due Date:</strong> {selectedBook.dueDate}
                    </div>
                  )}

                  {!user && selectedBook.status === 'available' && (
                    <Alert variant="info">
                      Please sign in to borrow this book.
                    </Alert>
                  )}

                  {user && selectedBook.availableCopies > 0 && !borrowSuccess && (
                    <div className="mt-3">
                      <h6>Select Loan Duration</h6>
                      <Form.Select
                        value={borrowDuration}
                        onChange={(e) => setBorrowDuration(Number(e.target.value) as 7 | 14 | 21)}
                        className="mb-2"
                      >
                        <option value={7}>7 days</option>
                        <option value={14}>14 days (Standard)</option>
                        <option value={21}>21 days</option>
                      </Form.Select>
                      <small className="text-muted">
                        Due date: {new Date(Date.now() + borrowDuration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </small>
                    </div>
                  )}
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              {selectedBook.availableCopies > 0 && (
                <Button
                  variant="primary"
                  onClick={handleBorrowBook}
                  disabled={borrowing || borrowSuccess}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                >
                  {borrowing ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Borrowing...
                    </>
                  ) : borrowSuccess ? (
                    'Borrowed!'
                  ) : user ? (
                    'Borrow Book'
                  ) : (
                    'Sign In to Borrow'
                  )}
                </Button>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}