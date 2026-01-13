import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDashboard } from './components/user/UserDashboard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'member';
  token?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishYear: number;
  status: 'available' | 'checked-out';
  borrowedBy?: string;
  dueDate?: string;
  coverImage?: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // If admin is logged in, show admin dashboard
  if (currentUser?.role === 'admin') {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // Otherwise show user dashboard (whether logged in or not)
  return <UserDashboard user={currentUser} onLogin={handleLogin} onLogout={handleLogout} />;
}