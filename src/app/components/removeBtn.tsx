'use client'
import React from 'react';
import { HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { userService } from '@/services/userService';

interface RemoveBtnProps {
  id: string;
  getUsers: () => void;
}

const RemoveBtn: React.FC<RemoveBtnProps> = ({ id, getUsers }) => {
  const handleRemove = async () => {
    try {
      await userService.editUserStatus(id,"inactive",true);
      toast.success("Successfully deleted!", {
        position: "bottom-right"
      });
      getUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast.error('Failed to delete user', {
        position: "bottom-right"
      });
    }
  };

  return (
    <button onClick={handleRemove}>
      <HiTrash size={24} />
    </button>
  );
};

export default RemoveBtn;
