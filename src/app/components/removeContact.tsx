import React from 'react';
import { HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { contactService } from '@/services/contactService';

interface RemoveContactProps {
  id: string;
  
}

const RemoveContact: React.FC<RemoveContactProps> = ({ id,  }) => {
  const handleDelete = async () => {
    try {
      await contactService.deleteContact(id);
      toast.success("Successfully deleted!", {
        position: "bottom-right",
      });
      //onDelete();
    } catch (error) {
      toast.error("Failed to delete contact. Please try again.", {
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

export default RemoveContact;
