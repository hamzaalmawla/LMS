import { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Card, Badge, Modal } from 'react-bootstrap';
import { Book, Member } from '../App';

interface BooksPageProps {
  books: Book[];
  members: Member[];
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onCheckout: (bookId: string, memberId: string) => void;
  onReturn: (bookId: string) => void;
}

export function BooksPage({ books, members, onAddBook, onEditBook, onDeleteBook, onCheckout, onReturn }: BooksPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publishYear: new Date().getFullYear()
  });

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

  const handleAddBook = () => {
    onAddBook({ ...formData, status: 'available' });
    setShowAddModal(false);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      publishYear: new Date().getFullYear()
    });
  };

  const handleEditBook = () => {
    if (selectedBook) {
      onEditBook({ ...selectedBook, ...formData });
      setShowEditModal(false);
    }
  };

  const handleCheckout = () => {
    if (selectedBook && selectedMemberId) {
      onCheckout(selectedBook.id, selectedMemberId);
      setShowCheckoutModal(false);
      setSelectedMemberId('');
    }
  };

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      publishYear: book.publishYear
    });
    setShowEditModal(true);
  };

  const openCheckoutModal = (book: Book) => {
    setSelectedBook(book);
    setShowCheckoutModal(true);
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
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold mb-2">Book Collection</h1>
              <p className="mb-0">{books.length} books in our library</p>
            </div>
            <Button 
              variant="light" 
              onClick={() => setShowAddModal(true)}
              style={{ fontWeight: '600' }}
            >
              + Add New Book
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-4">
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

        {/* Books Grid */}
        <Row className="g-4">
          {filteredBooks.map(book => (
            <Col key={book.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0" style={{ transition: 'transform 0.2s' }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Badge 
                      bg={book.status === 'available' ? 'success' : 'danger'}
                      className="mb-2"
                    >
                      {book.status === 'available' ? 'Available' : 'Checked Out'}
                    </Badge>
                    <Badge bg="primary">{book.category}</Badge>
                  </div>
                  
                  <h5 className="fw-bold mb-2">{book.title}</h5>
                  <p className="text-muted mb-2">by {book.author}</p>
                  <p className="small text-muted mb-2">
                    <strong>ISBN:</strong> {book.isbn}
                  </p>
                  <p className="small text-muted mb-3">
                    <strong>Published:</strong> {book.publishYear}
                  </p>

                  {book.status === 'checked-out' && book.dueDate && (
                    <div className="alert alert-warning py-2 small mb-3">
                      Due: {book.dueDate}
                    </div>
                  )}

                  <div className="d-flex gap-2">
                    {book.status === 'available' ? (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => openCheckoutModal(book)}
                        style={{ flex: 1 }}
                      >
                        Checkout
                      </Button>
                    ) : (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => onReturn(book.id)}
                        style={{ flex: 1 }}
                      >
                        Return
                      </Button>
                    )}
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => openEditModal(book)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => onDeleteBook(book.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredBooks.length === 0 && (
          <div className="text-center py-5">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" className="mb-3">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <p className="text-muted">No books found matching your criteria.</p>
          </div>
        )}
      </Container>

      {/* Add Book Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author *</Form.Label>
              <Form.Control
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ISBN *</Form.Label>
              <Form.Control
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Control
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Fiction, Non-Fiction, Fantasy"
                required
              />
            </Form.Group>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddBook}>
            Add Book
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Book Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author *</Form.Label>
              <Form.Control
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ISBN *</Form.Label>
              <Form.Control
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Control
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </Form.Group>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditBook}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Checkout Modal */}
      <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Checkout Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <>
              <div className="alert alert-info">
                <h6 className="mb-1">{selectedBook.title}</h6>
                <p className="small mb-0">by {selectedBook.author}</p>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Select Member *</Form.Label>
                <Form.Select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  required
                >
                  <option value="">-- Select a member --</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="alert alert-light">
                <small>
                  <strong>Due Date:</strong> {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  <br />
                  <span className="text-muted">Books can be checked out for 14 days</span>
                </small>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCheckout}>
            Checkout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
