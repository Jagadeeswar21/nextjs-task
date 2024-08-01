'use client';
import React, { useState } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { leaveService } from '@/services/userleaveService';

interface EditLeaveBtnProps {
  id: string;
  currentStatus: string;
  getLeaves?:any
}

const EditLeaveBtn: React.FC<EditLeaveBtnProps> = ({ id, currentStatus,getLeaves }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const router = useRouter();

  const handleSave = async () => {
    try {
      await leaveService.editLeaveRequest({ _id: id, status });
      await getLeaves()
      setIsOpen(false);
      toast.success('Status updated!', {
        position: 'bottom-right',
      });
      
    } catch (error) {
      console.error('Failed to update leave status', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>
        <HiPencilAlt size={24} className="text-blue-500 hover:text-blue-700" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Edit Leave Status</h2>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="approved"
                  checked={status === 'approved'}
                  onChange={() => setStatus('approved')}
                  className="mr-2"
                />
                <span>Approved</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="rejected"
                  checked={status === 'rejected'}
                  onChange={() => setStatus('rejected')}
                  className="mr-2"
                />
                <span>Rejected</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={status === 'pending'}
                  onChange={() => setStatus('pending')}
                  className="mr-2"
                />
                <span>Pending</span>
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditLeaveBtn;
