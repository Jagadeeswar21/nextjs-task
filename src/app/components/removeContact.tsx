// components/RemoveContact.tsx
import React from 'react';
import { HiTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
interface RemoveContactProps {
  id: string;
  onDelete:()=>void;
}
const RemoveContact: React.FC<RemoveContactProps> = ({ id,onDelete}) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("successfully deleted!",{
          position:"bottom-right"
        });
        onDelete()
      } else {
        console.error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Failed to delete contact', error);
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 p-2">
      <HiTrash />
    </button>
  );
};

export default RemoveContact;
