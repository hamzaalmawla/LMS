import { useState } from 'react';
import { Book, Member } from '../App';
import { X } from 'lucide-react';

interface CheckoutModalProps {
  book: Book;
  members: Member[];
  onClose: () => void;
  onCheckout: (bookId: string, memberId: string) => void;
}

export function CheckoutModal({ book, members, onClose, onCheckout }: CheckoutModalProps) {
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMemberId) {
      onCheckout(book.id, selectedMemberId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl text-gray-900">Checkout Book</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="text-gray-900 mb-1">{book.title}</h3>
            <p className="text-sm text-gray-600">by {book.author}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Select Member *</label>
            <select
              required
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a member --</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <span>Due Date: </span>
              <span className="text-gray-900">
                {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Books can be checked out for 14 days</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
