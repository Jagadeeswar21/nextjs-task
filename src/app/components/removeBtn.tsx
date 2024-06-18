
'use client'
import React from 'react';
import { HiTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
interface RemoveBtnProps {
  id: string;
}
const RemoveBtn: React.FC<RemoveBtnProps> = ({ id }) => {
  const router = useRouter()

  const handleRemove = async () => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({status:"inactive",isDeleted:true})
      });

      if (res.ok) {
        toast.success("successfully deleted!",{
          position:"bottom-right"
        });
        router.refresh();
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error( error)
    }
  };

  return (
    <button onClick={handleRemove}>
      <HiTrash size={24} />
    </button>
  );
};

export default RemoveBtn;