import React from 'react';

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
      onDelete();
    } catch (error) {
      console.error('Failed to delete leave', error);
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 p-2">
      Remove
    </button>
  );
};

export default RemoveLeave;
