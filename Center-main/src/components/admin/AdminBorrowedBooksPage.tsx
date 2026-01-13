import { useState, useEffect } from 'react';
import { Container, Table, Card, Badge, Button, Spinner, Alert, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { api, BorrowedBook } from '../../services/api';
import { mockCurrentBorrowsAdmin } from '../../data/mockBorrowHistory';

export function AdminBorrowedBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [returning, setReturning] = useState<string | null>(null);

  useEffect(() => {
    loadBorrowedBooks();
  }, []);

  const loadBorrowedBooks = async () => {
    setLoading(true);
    
    if (!api.isConfigured()) {
      setBorrowedBooks(mockCurrentBorrowsAdmin);
      setUsingMockData(true);
      setLoading(false);
      return;
    }

    try {
      const response = await api.getAllCurrentBorrows();
      setBorrowedBooks(response.borrows || response || []);
      setUsingMockData(false);
    } catch (err: any) {
      console.error('Failed to load borrowed books:', err);
      setBorrowedBooks(mockCurrentBorrowsAdmin);
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

    if (!confirm('Are you sure you want to mark this book as returned?')) {
      return;
    }

    setReturning(borrowId);
    
    try {
      await api.adminReturnBook(borrowId);
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

  const filteredBooks = borrowedBooks.filter(book => {
    const matchesSearch = 
      book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const overdueCount = borrowedBooks.filter(b => isOverdue(b.dueDate)).length;
  const totalFines = borrowedBooks.reduce((sum, b) => sum + (b.fine || 0), 0);

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Currently Borrowed Books</h2>
          <p className="text-muted mb-0">Manage all active book loans</p>
        </div>
        <div className="d-flex gap-4">
          <div className="text-end">
            <p className="mb-0 text-muted">Total Borrowed</p>
            <h4 className="mb-0 text-primary">{borrowedBooks.length}</h4>
          </div>
          <div className="text-end">
            <p className="mb-0 text-muted">Overdue</p>
            <h4 className="mb-0 text-danger">{overdueCount}</h4>
          </div>
          <div className="text-end">
            <p className="mb-0 text-muted">Outstanding Fines</p>
            <h4 className="mb-0 text-warning">${totalFines.toFixed(2)}</h4>
          </div>
        </div>
      </div>

      {usingMockData && (
        <Alert variant="warning" className="mb-4">
          <strong>Demo Mode:</strong> Connect to the backend to see actual borrowed books. Currently showing sample data.
        </Alert>
      )}

      {/* Search */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by book title or member name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Card.Body>
      </Card>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-3">Loading borrowed books...</p>
        </div>
      )}

      {!loading && filteredBooks.length === 0 && (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" className="mb-3">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <h5 className="text-muted">No borrowed books</h5>
            <p className="text-muted">All books are currently available</p>
          </Card.Body>
        </Card>
      )}

      {!loading && filteredBooks.length > 0 && (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th>Book</th>
                    <th>Borrowed By</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Fine</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((record) => {
                    const overdue = isOverdue(record.dueDate);
                    const daysOverdue = calculateDaysOverdue(record.dueDate);

                    return (
                      <tr key={record.id} className={overdue ? 'table-danger' : ''}>
                        <td className="align-middle">
                          <div>
                            <strong>{record.bookTitle}</strong>
                            <div className="text-muted small">{record.bookAuthor}</div>
                          </div>
                        </td>
                        <td className="align-middle">{record.userName}</td>
                        <td className="align-middle">
                          {new Date(record.borrowDate).toLocaleDateString()}
                        </td>
                        <td className="align-middle">
                          <div>
                            {new Date(record.dueDate).toLocaleDateString()}
                            {overdue && (
                              <div className="text-danger small fw-bold">
                                {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="align-middle">
                          {overdue ? (
                            <Badge bg="danger">Overdue</Badge>
                          ) : (
                            <Badge bg="success">On Time</Badge>
                          )}
                        </td>
                        <td className="align-middle">
                          {record.fine && record.fine > 0 ? (
                            <span className="text-danger fw-bold">
                              ${record.fine.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-muted">$0.00</span>
                          )}
                        </td>
                        <td className="align-middle">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleReturnBook(record.id)}
                            disabled={returning === record.id}
                          >
                            {returning === record.id ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Returning...
                              </>
                            ) : (
                              <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Return Book
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
