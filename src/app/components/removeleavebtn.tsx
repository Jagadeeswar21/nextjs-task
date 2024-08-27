'use client';
import React from 'react';
import { HiTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { leaveService } from '@/services/userleaveService';

interface RemoveLeaveProps {
  id: string;
  getLeaves:any
}

const RemoveLeave: React.FC<RemoveLeaveProps> = ({ id,getLeaves }) => {
  const router = useRouter();

  const handleRemove = async () => {
    try {
      await leaveService.deleteLeaveRequest(id);
      toast.success("Successfully deleted!", {
        position: "bottom-right",
      });
      getLeaves();
      //router.refresh();
    } catch (error) {
      toast.error("Failed to delete leave request. Please try again.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <button onClick={handleRemove} className="text-black p-2">
      <HiTrash size={24} />
    </button>
  );
};

export default RemoveLeave;
