import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { User } from '../../App';
import { api } from '../../services/api';

interface UserProfilePageProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export function UserProfilePage({ user, onUpdateUser }: UserProfilePageProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await api.updateUserProfile({ name, email });
      
      // Update local user
      const updatedUser = { ...user, name, email };
      onUpdateUser(updatedUser);
      
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setSaving(true);

    try {
      await api.changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
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
          <h1 className="fw-bold mb-2">My Profile</h1>
          <p className="mb-0">Manage your account settings</p>
        </Container>
      </div>

      <Container className="py-4">
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        <Row className="g-4">
          {/* Profile Information */}
          <Col lg={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h5 className="mb-4">Profile Information</h5>
                <Form onSubmit={handleUpdateProfile}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={saving}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    {saving ? 'Saving...' : 'Update Profile'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Change Password */}
          <Col lg={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h5 className="mb-4">Change Password</h5>
                <Form onSubmit={handleChangePassword}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password (min 6 characters)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="warning"
                    disabled={saving}
                  >
                    {saving ? 'Changing...' : 'Change Password'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Account Details */}
        <Card className="shadow-sm border-0 mt-4">
          <Card.Body>
            <h5 className="mb-4">Account Details</h5>
            <Row>
              <Col md={6}>
                <p className="mb-2">
                  <strong>Account Type:</strong>{' '}
                  <span className="text-capitalize">{user.role}</span>
                </p>
              </Col>
              <Col md={6}>
                <p className="mb-2">
                  <strong>Member ID:</strong>{' '}
                  <code>{user.id}</code>
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
