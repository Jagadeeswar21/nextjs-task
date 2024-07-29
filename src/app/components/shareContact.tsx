import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface ShareContactProps {
  contactId: string;
  onClose: () => void;
}

const ShareContact: React.FC<ShareContactProps> = ({ contactId, onClose }) => {
  const [email, setEmail] = useState('');

  const handleShare = async () => {
    try {
      const response = await fetch('/api/contacts/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, receiverEmail: email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Contact shared successfully');
        onClose();
      } else {
        toast.error(data.message || 'Failed to share contact');
      }
    } catch (error) {
      console.error('Error sharing contact:', error);
      toast.error('An error occurred while sharing the contact');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Share Contact</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter receiver's email"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleShare} className="px-4 py-2 bg-blue-500 text-white rounded">Share</button>
        </div>
      </div>
    </div>
  );
};

export default ShareContact;