'use client';
import React, { useEffect, useState } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import ContactForm from './contactForm';
import RemoveContact from './removeContact';
import Pagination from './pagination';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const { data: session, status } = useSession()
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const contactsPerPage = 5

  const fetchContacts = async (page: number) => {
    if (!session) return
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
      if (editingContact) {
        await fetch(`/api/contacts/${newContact._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newContact),
        });
        setContacts(prevContacts =>
          prevContacts.map(contact => (contact._id === newContact._id ? newContact : contact))
        );
        toast.success("Successfully edited!", {
          position: "bottom-right"
        });
      } else {
        await fetch('/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newContact),
        });
        fetchContacts(currentPage);
      }
    } catch (error) {
      console.error('Failed to save contact', error);
    } finally {
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      setContacts(contacts.filter(contact => contact._id !== id));
    } catch (error) {
      console.error('Failed to delete contact', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (status === 'loading') return <p>Loading...</p>;

  if (status === 'unauthenticated') {
    return <p>Please log in to view your contacts.</p>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-3 text-sm py-2 rounded">
          Create New Contact
        </button>
      </div>
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
          {contacts.map(contact => (
            <tr key={contact._id}>
              <td className="border border-gray-400 p-1">{contact.name}</td>
              <td className="border border-gray-400 p-1">{contact.email}</td>
              <td className="border border-gray-400 p-1">{contact.phone}</td>
              <td className="border border-gray-400 p-1">{contact.status}</td>
              <td className="border border-gray-400 p-1">
                <button onClick={() => handleEdit(contact)} className="text-blue-500 hover:text-blue-700 p-2">
                  <HiPencilAlt />
                </button>
                <RemoveContact id={contact._id!} onDelete={() => handleDelete(contact._id!)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {showForm && (
        <ContactForm
          contact={editingContact}
          onClose={() => {
            setEditingContact(null);
            setShowForm(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ContactsPage;