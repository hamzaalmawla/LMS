import { useState } from 'react';
import { Book, Member } from '../App';
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { EditBookModal } from './EditBookModal';
import { CheckoutModal } from './CheckoutModal';

interface BookListProps {
  books: Book[];
  members: Member[];
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onCheckout: (bookId: string, memberId: string) => void;
  onReturn: (bookId: string) => void;
}

export function BookList({ books, members, onAddBook, onEditBook, onDeleteBook, onCheckout, onReturn }: BookListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [checkoutBook, setCheckoutBook] = useState<Book | null>(null);

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

  const handleCheckout = (bookId: string, memberId: string) => {
    onCheckout(bookId, memberId);
    setCheckoutBook(null);
  };

  return (
    <div>
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl text-gray-900">Book Catalog</h2>
          <p className="text-sm text-gray-600 mt-1">{books.length} total books</p>
        </div>
        <button
          onClick={onAddBook}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Book
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="checked-out">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">ISBN</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBooks.map(book => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{book.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{book.isbn}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.publishYear}</td>
                  <td className="px-6 py-4 text-sm">
                    {book.status === 'available' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Available
                      </span>
                    ) : (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3" />
                          Checked Out
                        </span>
                        {book.dueDate && (
                          <div className="text-xs text-gray-500 mt-1">Due: {book.dueDate}</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {book.status === 'available' ? (
                        <button
                          onClick={() => setCheckoutBook(book)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          Checkout
                        </button>
                      ) : (
                        <button
                          onClick={() => onReturn(book.id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          Return
                        </button>
                      )}
                      <button
                        onClick={() => setEditingBook(book)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteBook(book.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No books found matching your criteria.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={onEditBook}
        />
      )}

      {/* Checkout Modal */}
      {checkoutBook && (
        <CheckoutModal
          book={checkoutBook}
          members={members}
          onClose={() => setCheckoutBook(null)}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}
