'use client';
import React from 'react';
import { HiTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface RemoveLeaveProps {
  id: string;
}

const RemoveLeave: React.FC<RemoveLeaveProps> = ({ id }) => {
  const router = useRouter();

  const handleRemove = async () => {
    try {
      const res = await fetch(`/api/leaves/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success("Successfully deleted!", {
          position: "bottom-right",
        });
        router.refresh();
      } else {
        console.error('Failed to delete leave request');
      }
    } catch (error) {
      console.error('Failed to delete leave request', error);
    }
  };

  return (
    <button onClick={handleRemove}>
      <HiTrash size={24} />
    </button>
  );
};

export default RemoveLeave;
