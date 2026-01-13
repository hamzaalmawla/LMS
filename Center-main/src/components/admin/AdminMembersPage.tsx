import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { api, Member } from '../../services/api';

export function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await api.getMembers();
        setMembers(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch members');
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.phone || '').includes(searchQuery)
  );

  const handleToggleStatus = async (memberId: string) => {
    try {
      const member = members.find(m => m.id === memberId);
      if (!member) return;

      const newStatus = member.isActive ? 'inactive' : 'active';
      await api.updateMember(memberId, { status: newStatus });

      setMembers(members.map(m =>
        m.id === memberId
          ? { ...m, isActive: !m.isActive }
          : m
      ));
    } catch (err: any) {
      alert('Failed to update member status: ' + err.message);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.deleteMember(memberId);
        setMembers(members.filter(member => member.id !== memberId));
      } catch (err: any) {
        alert('Failed to delete member: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading members...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Manage Members</h2>
          <p className="text-muted mb-0">{members.length} registered members</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning mb-4">
          {error}
        </div>
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
              placeholder="Search members by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Card.Body>
      </Card>

      {/* Members Table */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Member Since</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ width: '200px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => (
                  <tr key={member.id}>
                    <td className="align-middle">
                      <strong>{member.name}</strong>
                    </td>
                    <td className="align-middle">{member.email}</td>
                    <td className="align-middle">{member.phone || '-'}</td>
                    <td className="align-middle">
                      {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="align-middle">
                      <Badge bg={member.role === 'admin' ? 'primary' : 'secondary'}>
                        {member.role}
                      </Badge>
                    </td>
                    <td className="align-middle">
                      <Badge bg={member.isActive ? 'success' : 'secondary'}>
                        {member.isActive ? 'active' : 'inactive'}
                      </Badge>
                    </td>
                    <td className="align-middle">
                      <div className="d-flex gap-2">
                        <Button
                          variant={member.isActive ? 'outline-warning' : 'outline-success'}
                          size="sm"
                          onClick={() => handleToggleStatus(member.id)}
                          disabled={member.role === 'admin'}
                        >
                          {member.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteMember(member.id)}
                          disabled={member.role === 'admin'}
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

          {filteredMembers.length === 0 && (
            <div className="text-center py-5 text-muted">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-3">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <p>No members found</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
