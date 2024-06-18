import React from 'react';
import { HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
interface RemoveLeaveProps {
  id: string;
  onDelete: () => void;
}
const RemoveLeave: React.FC<RemoveLeaveProps> = ({ id, onDelete }) => {
  const handleDelete = async () => {
    try {
      await fetch(`/api/leaves/${id}`, {
        method: 'DELETE',
      });
      toast.success("Successfully deleted!",{
        position:"bottom-right"
      });
      onDelete();
    } catch (error) {
      console.error('Failed to delete leave', error);
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 p-2">
      <HiTrash/>
    </button>
  );
};

export default RemoveLeave;
