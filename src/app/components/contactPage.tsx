
'use client'

import React, { useEffect, useState } from 'react';
import { HiPencilAlt, HiSearch, HiShare ,HiTrash} from 'react-icons/hi';
import ContactForm from './contactForm';
import RemoveContact from './removeContact';
import Pagination from './pagination';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { contactService } from '@/services/contactService';
import ShareContact from './shareContact';

interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  sharedBy?: string;
}

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [shareContactId, setShareContactId] = useState<string | null>(null);

  const contactsPerPage = 5;

  const fetchContacts = async (page: number) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/contacts?page=${page}&limit=${contactsPerPage}`);
      const data = await res.json();
      setContacts(data.contacts || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch contacts', error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchContacts(currentPage);
    }
  }, [session, currentPage]);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSave = async (newContact: Contact) => {
    try {
      if (editingContact && editingContact._id) {
        await contactService.editContact(newContact);
        setContacts(prevContacts =>
          prevContacts.map(contact =>
            contact._id === editingContact._id ? newContact : contact
          )
        );
        toast.success("Successfully edited!", {
          position: "bottom-right"
        });
      } else {
        const res=await contactService.addContact(newContact);
        console.log(res)
        toast.success("Successfully added!", {
          position: "bottom-right"
        });
        fetchContacts(currentPage)
      }
    } catch (error) {
      console.error('Failed to save contact', error);
      toast.error('Failed to save contact', {
        position: "bottom-right"
      });
    } finally {
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contactService.deleteContact(id);
      setContacts(contacts.filter(contact => contact._id !== id));
      toast.success("Successfully deleted!", {
        position: "bottom-right"
      });
    } catch (error) {
      console.error('Failed to delete contact', error);
      toast.error('failed to delete contact', {
        position: "bottom-right"
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') return <p>Loading...</p>;

  if (status === 'unauthenticated') {
    return <p>Please log in to view your contacts.</p>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="ml-auto relative ">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
            <HiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 pl-10 rounded-full border border-gray-400 focus:outline-none focus:ring focus:border-blue-300 bg-white w-full"
          />
        </div>
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-3 text-sm py-2 rounded">
          Create New Contact
        </button>
      </div>

      <div className="bg-white p-[15px] rounded shadow-lg">
        <table className="min-w-full border-collapse border border-gray-400 leading-normal">
          <thead>
            <tr>
              <th className="border border-gray-400 p-1">Name</th>
              <th className="border border-gray-400 p-1">Email</th>
              <th className="border border-gray-400 p-1">Phone</th>
              <th className="border border-gray-400 p-1">Status</th>
              <th className="border border-gray-400 p-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(contact => (
              <tr key={contact._id}>
                <td className="border border-gray-400 p-1">{contact.name}</td>
                <td className="border border-gray-400 p-1">{contact.email}</td>
                <td className="border border-gray-400 p-1">{contact.phone}</td>
                <td className="border border-gray-400 p-1">{contact.status}</td>
                <td className="border border-gray-400 p-1">
                      <button onClick={() => handleEdit(contact)} className="text-blue-500 hover:text-blue-700 p-2">
                        <HiPencilAlt />
                      </button>
                      {/* <RemoveContact id={contact._id!} onDelete={() => handleDelete(contact._id!)} /> */}
                      <button onClick={()=>handleDelete(contact._id!)} className="text-red-500 hover:text-red-700 p-2"><HiTrash />
    </button>
                      <button onClick={() => setShareContactId(contact._id!)} className="text-green-500 hover:text-green-700 p-2">
                        <HiShare />
                      </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {showForm && (
        <ContactForm
          contact={editingContact}
          onClose={() => {
            setShowForm(false);
          }}
          onSave={handleSave}
        />
      )}
      {shareContactId && (
        <ShareContact
          contactId={shareContactId}
          onClose={() => setShareContactId(null)}
        />
      )}
    </div>
  );
};

export default ContactsPage;
