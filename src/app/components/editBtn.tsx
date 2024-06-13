'use client';
import React, { useState } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
interface EditBtnProps {
  id: string;
  currentStatus: string;
}

const EditBtn: React.FC<EditBtnProps> = ({ id, currentStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const router = useRouter()
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/users/${id}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>
        <HiPencilAlt size={24} className="text-blue-500 hover:text-blue-700" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Edit User Status</h2>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="mr-2"
                />
                <span>Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={status === 'inactive'}
                  onChange={() => setStatus('inactive')}
                  className="mr-2"
                />
               <span>Inactive</span>
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

export default EditBtn;