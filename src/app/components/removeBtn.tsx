'use client'
import React from 'react';
import { HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { userService } from '@/services/userService';

interface RemoveBtnProps {
  id: string;
  getUsers:any
}

const RemoveBtn: React.FC<RemoveBtnProps> = ({ id,getUsers }) => {
  const handleRemove = async () => {
    try {
      const res=await userService.editUserStatus(id, 'inactive',"true");//unable to delete cnt
      toast.success("Successfully deleted!", {
        position: "bottom-right",
      });
      console.log(res);
      getUsers();
    } catch (error) {
      toast.error("Failed to delete user. Please try again.", {
        position: "bottom-right",
      });
    }
  };
  return (
    <button onClick={handleRemove} className="text-red-500 hover:text-red-700 p-2">
      <HiTrash size={24} />
    </button>
  );
};

export default RemoveBtn;
