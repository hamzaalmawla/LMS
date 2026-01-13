import { useState, useEffect } from 'react';
import { Container, Table, Card, Badge, Spinner, Alert, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { api, BorrowedBook } from '../../services/api';
import { mockBorrowHistory } from '../../data/mockBorrowHistory';

export function AdminHistoryPage() {
  const [history, setHistory] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    
    if (!api.isConfigured()) {
      // Use mock data when backend is not configured
      setHistory(mockBorrowHistory);
      setUsingMockData(true);
      setLoading(false);
      return;
    }

    try {
      const response = await api.getAllBorrowHistory();
      setHistory(response.history || response || []);
      setUsingMockData(false);
    } catch (err: any) {
      console.error('Failed to load history:', err);
      // Fallback to mock data
      setHistory(mockBorrowHistory);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(record => {
    const matchesSearch = 
      record.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalFines = history.reduce((sum, record) => sum + (record.fine || 0), 0);

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Borrowing History</h2>
          <p className="text-muted mb-0">Complete borrowing records for all members</p>
        </div>
        <div className="text-end">
          <p className="mb-0 text-muted">Total Fines Collected</p>
          <h4 className="mb-0 text-danger">${totalFines.toFixed(2)}</h4>
        </div>
      </div>

      {usingMockData && (
        <Alert variant="warning" className="mb-4">
          <strong>Demo Mode:</strong> Connect to the backend to see actual borrowing history. Currently showing sample data.
        </Alert>
      )}

      {/* Filters */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={8}>
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
            </Col>
            <Col md={4}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="borrowed">Currently Borrowed</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-3">Loading history...</p>
        </div>
      )}

      {!loading && filteredHistory.length === 0 && (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" className="mb-3">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <h5 className="text-muted">No borrowing history found</h5>
            <p className="text-muted">Borrowing records will appear here</p>
          </Card.Body>
        </Card>
      )}

      {!loading && filteredHistory.length > 0 && (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th>Book</th>
                    <th>Member</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                    <th>Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((record) => (
                    <tr key={record.id}>
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
                        {new Date(record.dueDate).toLocaleDateString()}
                      </td>
                      <td className="align-middle">
                        {record.returnDate 
                          ? new Date(record.returnDate).toLocaleDateString()
                          : '-'
                        }
                      </td>
                      <td className="align-middle">
                        {record.status === 'returned' ? (
                          <Badge bg="success">Returned</Badge>
                        ) : record.status === 'overdue' ? (
                          <Badge bg="danger">Overdue</Badge>
                        ) : (
                          <Badge bg="primary">Borrowed</Badge>
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
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
