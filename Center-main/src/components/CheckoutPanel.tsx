import { Checkout, Book, Member } from '../App';
import { Calendar, User, BookOpen, AlertCircle } from 'lucide-react';

interface CheckoutPanelProps {
  checkouts: Checkout[];
  books: Book[];
  members: Member[];
  onReturn: (bookId: string) => void;
}

export function CheckoutPanel({ checkouts, books, members, onReturn }: CheckoutPanelProps) {
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const activeCheckouts = books.filter(book => book.status === 'checked-out');

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl text-gray-900">Active Checkouts</h2>
        <p className="text-sm text-gray-600 mt-1">{activeCheckouts.length} books currently checked out</p>
      </div>

      {/* Checkouts List */}
      {activeCheckouts.length > 0 ? (
        <div className="space-y-4">
          {activeCheckouts.map(book => {
            const member = members.find(m => m.id === book.borrowedBy);
            const overdue = book.dueDate && isOverdue(book.dueDate);

            return (
              <div
                key={book.id}
                className={`bg-white rounded-lg shadow-sm border p-6 ${
                  overdue ? 'border-red-300 bg-red-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg text-gray-900">{book.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">by {book.author}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Borrowed by: <span className="text-gray-900">{member?.name || 'Unknown'}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Due Date: <span className={overdue ? 'text-red-600' : 'text-gray-900'}>{book.dueDate}</span>
                            </span>
                          </div>
                        </div>

                        {overdue && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>This book is overdue!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onReturn(book.id)}
                    className="ml-4 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Return Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No books are currently checked out.</p>
        </div>
      )}
    </div>
  );
}
