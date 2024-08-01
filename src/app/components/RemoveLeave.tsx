import React from 'react';
import { HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { leaveService } from '@/services/userleaveService';

interface RemoveLeaveProps {
  id: string;
  onDelete: () => void;
}

const RemoveLeave: React.FC<RemoveLeaveProps> = ({ id, onDelete }) => {
  const handleDelete = async () => {
    try {
      await leaveService.deleteLeaveRequest(id);
      toast.success("Successfully deleted!", {
        position: "bottom-right",
      });
      // onDelete();
    } catch (error) {
      toast.error("Failed to delete leave request. Please try again.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 p-2">
      <HiTrash />
    </button>
  );
};

export default RemoveLeave;
