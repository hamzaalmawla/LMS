import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Modal, Table, Spinner, Alert } from 'react-bootstrap';
import { Book } from '../../App';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { api } from '../../services/api';
import { mockBooks } from '../../data/mockBooks';

export function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publishYear: new Date().getFullYear(),
    coverImage: '',
    description: ''
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    
    if (!api.isConfigured()) {
      // Use mock data when backend is not configured
      setBooks(mockBooks);
      setUsingMockData(true);
      setLoading(false);
      return;
    }

    try {
      const response = await api.getBooks();
      setBooks(response.books || response);
      setUsingMockData(false);
    } catch (err) {
      // Fallback to mock data if API fails
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

    return matchesSearch && matchesCategory;
  });

  const handleAddBook = async () => {
    if (usingMockData) {
      alert('This is a demo. Connect to the backend to enable book management.');
      return;
    }

    setSaving(true);
    try {
      await api.createBook(formData);
      await loadBooks();
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Failed to add book. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditBook = async () => {
    if (usingMockData) {
      alert('This is a demo. Connect to the backend to enable book management.');
      return;
    }

    if (!selectedBook) return;
    
    setSaving(true);
    try {
      await api.updateBook(selectedBook.id, formData);
      await loadBooks();
      setShowEditModal(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Failed to update book. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (usingMockData) {
      alert('This is a demo. Connect to the backend to enable book management.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await api.deleteBook(bookId);
      await loadBooks();
    } catch (err: any) {
      alert(err.message || 'Failed to delete book. Please try again.');
    }
  };

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      publishYear: book.publishYear,
      coverImage: book.coverImage || '',
      description: book.description || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      publishYear: new Date().getFullYear(),
      coverImage: '',
      description: ''
    });
    setSelectedBook(null);
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Manage Books</h2>
          <p className="text-muted mb-0">{books.length} books in the library</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            fontWeight: '600'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ verticalAlign: 'middle' }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Book
        </Button>
      </div>

      {usingMockData && (
        <Alert variant="warning" className="mb-4">
          <strong>Demo Mode:</strong> You're viewing sample data. Book management is disabled. To enable full functionality, update the API_BASE_URL in /services/api.ts and connect to your backend.
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
                  placeholder="Search by title, author, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
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

      {/* Books Table */}
      {!loading && (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th style={{ width: '80px' }}>Cover</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th style={{ width: '150px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map(book => (
                    <tr key={book.id}>
                      <td>
                        <ImageWithFallback
                          src={book.coverImage || ''}
                          alt={book.title}
                          style={{
                            width: '50px',
                            height: '70px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      </td>
                      <td className="align-middle">
                        <strong>{book.title}</strong>
                      </td>
                      <td className="align-middle">{book.author}</td>
                      <td className="align-middle">
                        <code style={{ fontSize: '0.85rem' }}>{book.isbn}</code>
                      </td>
                      <td className="align-middle">
                        <Badge bg="primary">{book.category}</Badge>
                      </td>
                      <td className="align-middle">{book.publishYear}</td>
                      <td className="align-middle">
                        <Badge bg={book.status === 'available' ? 'success' : 'danger'}>
                          {book.status === 'available' ? 'Available' : 'Checked Out'}
                        </Badge>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEditModal(book)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-5 text-muted">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-3">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <p>No books found</p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Add Book Modal */}
      <Modal show={showAddModal} onHide={() => { setShowAddModal(false); resetForm(); }} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Author *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ISBN *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Fiction, Fantasy, Biography"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Publish Year *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.publishYear}
                    onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) })}
                    min="1000"
                    max={new Date().getFullYear()}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cover Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the book..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddBook}
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            {saving ? 'Adding...' : 'Add Book'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Book Modal */}
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); resetForm(); }} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Author *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ISBN *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Publish Year *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.publishYear}
                    onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) })}
                    min="1000"
                    max={new Date().getFullYear()}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cover Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowEditModal(false); resetForm(); }}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditBook}
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
