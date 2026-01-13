import { BorrowedBook } from '../services/api';

export const mockBorrowHistory: BorrowedBook[] = [
  {
    id: '1',
    bookId: '1',
    bookTitle: 'To Kill a Mockingbird',
    bookAuthor: 'Harper Lee',
    bookCoverImage: 'https://images.unsplash.com/photo-1763768861268-cb6b54173dbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc2Nzg4NDMzNnww&ixlib=rb-4.1.0&q=80&w=400',
    userId: '2',
    userName: 'Demo User',
    borrowDate: '2025-12-20',
    dueDate: '2026-01-03',
    returnDate: '2026-01-02',
    status: 'returned',
    fine: 0
  },
  {
    id: '2',
    bookId: '5',
    bookTitle: 'The Hobbit',
    bookAuthor: 'J.R.R. Tolkien',
    bookCoverImage: 'https://images.unsplash.com/photo-1711185892790-4cabb6701cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc2Nzk3NjExMHww&ixlib=rb-4.1.0&q=80&w=400',
    userId: '2',
    userName: 'Demo User',
    borrowDate: '2025-11-15',
    dueDate: '2025-11-29',
    returnDate: '2025-12-05',
    status: 'returned',
    fine: 6.00
  },
  {
    id: '3',
    bookId: '4',
    bookTitle: 'Sapiens',
    bookAuthor: 'Yuval Noah Harari',
    bookCoverImage: 'https://images.unsplash.com/photo-1725869973689-425c74f79a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc2Nzk4MDI0MHww&ixlib=rb-4.1.0&q=80&w=400',
    userId: '1',
    userName: 'Admin User',
    borrowDate: '2025-12-15',
    dueDate: '2025-12-29',
    returnDate: '2025-12-28',
    status: 'returned',
    fine: 0
  }
];

export const mockCurrentBorrowsAdmin: BorrowedBook[] = [
  {
    id: '4',
    bookId: '3',
    bookTitle: '1984',
    bookAuthor: 'George Orwell',
    bookCoverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXJ8ZW58MXx8fHwxNzM2OTU4OTQzfDA&ixlib=rb-4.1.0&q=80&w=400',
    userId: '3',
    userName: 'John Smith',
    borrowDate: '2026-01-05',
    dueDate: '2026-01-19',
    status: 'borrowed',
    fine: 0
  },
  {
    id: '5',
    bookId: '2',
    bookTitle: 'The Great Gatsby',
    bookAuthor: 'F. Scott Fitzgerald',
    bookCoverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXJ8ZW58MXx8fHwxNzM2OTU4OTQzfDA&ixlib=rb-4.1.0&q=80&w=400',
    userId: '4',
    userName: 'Sarah Johnson',
    borrowDate: '2025-12-28',
    dueDate: '2026-01-11',
    status: 'borrowed',
    fine: 0
  },
  {
    id: '6',
    bookId: '6',
    bookTitle: 'Pride and Prejudice',
    bookAuthor: 'Jane Austen',
    bookCoverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXJ8ZW58MXx8fHwxNzM2OTU4OTQzfDA&ixlib=rb-4.1.0&q=80&w=400',
    userId: '5',
    userName: 'Mike Davis',
    borrowDate: '2025-12-15',
    dueDate: '2025-12-29',
    status: 'overdue',
    fine: 13.00
  }
];

export const mockCurrentBorrows: BorrowedBook[] = [];