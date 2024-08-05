import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { contactService } from '@/services/contactService';

interface ShareContactProps {
  contactId: string;
  onClose: () => void;
}

const ShareContact: React.FC<ShareContactProps> = ({ contactId, onClose }) => {
  const [email, setEmail] = useState('');

  const handleShare = async () => {
    const res = await contactService.shareContact(contactId, email);
    if (res.success) {
      toast.success('Contact shared successfully');
      onClose();
    } else {
      toast.error(res.message);
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
