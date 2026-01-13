import { useState, useEffect } from 'react';
import { Container, Table, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { User } from '../../App';
import { api, BorrowedBook } from '../../services/api';
import { mockBorrowHistory } from '../../data/mockBorrowHistory';

interface UserHistoryPageProps {
  user: User;
}

export function UserHistoryPage({ user }: UserHistoryPageProps) {
  const [history, setHistory] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [user.id]);

  const loadHistory = async () => {
    setLoading(true);

    try {
      const response = await api.getBorrowHistory(user.id);
      setHistory(response);
      setUsingMockData(false);
    } catch (err: any) {
      console.error('Failed to load history:', err);
      // Fallback to mock data
      const userHistory = mockBorrowHistory.filter(h => h.userId === user.id);
      setHistory(userHistory);
      setUsingMockData(true);
    } finally {
      setLoading(false);
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
          <h1 className="fw-bold mb-2">Borrowing History</h1>
          <p className="mb-0">Your complete book borrowing history</p>
        </Container>
      </div>

      <Container className="py-4">
        {usingMockData && (
          <Alert variant="info" className="mb-4">
            <strong>Demo Mode:</strong> Connect to the backend to see your actual borrowing history. Currently showing sample data.
          </Alert>
        )}

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3">Loading history...</p>
          </div>
        )}

        {!loading && history.length === 0 && (
          <Card className="text-center py-5 border-0 shadow-sm">
            <Card.Body>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" className="mb-3">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <h5 className="text-muted">No borrowing history</h5>
              <p className="text-muted">Your borrowing history will appear here</p>
            </Card.Body>
          </Card>
        )}

        {!loading && history.length > 0 && (
          <Card className="shadow-sm border-0">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th>Book</th>
                      <th>Author</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                      <th>Return Date</th>
                      <th>Status</th>
                      <th>Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id}>
                        <td className="align-middle">
                          <strong>{record.bookTitle}</strong>
                        </td>
                        <td className="align-middle">{record.bookAuthor}</td>
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
    </>
  );
}
