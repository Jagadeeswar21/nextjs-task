'use client'
import React, { useEffect, useState } from 'react';
import { HiPencilAlt, HiSearch } from 'react-icons/hi';
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
  const { data: session, status } = useSession()
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const contactsPerPage = 5;

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchContacts = async (page: number) => {
        try {
          const res = await fetch(`/api/contacts?page=${page}&limit=${contactsPerPage}`);
          const data = await res.json();
          setContacts(data.contacts || []);
          setTotalPages(data.totalPages || 1)
        } catch (error) {
          console.error('Failed to fetch contacts', error);
        }
      };

      fetchContacts(currentPage);
    }
  }, [currentPage, status]);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSave = (updatedContact: Contact) => {
    if (editingContact && editingContact._id) {
      setContacts(contacts.map(contact => (contact._id === updatedContact._id ? updatedContact : contact)));
    } else {
      setContacts([...contacts, updatedContact]);
    }
    toast.success("Successfully created!", {
      position: "bottom-right"
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter(contact => contact._id !== id));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated') {
    return <p>Please log in to view your contacts.</p>;
  }

  return (
    <div className="p-4 relative z-40">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <div className="ml-auto relative z-40">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-40 ">
            <HiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4 z-40">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-1 pl-10 rounded-full text-2xl border border-gray-400 focus:outline-none focus:ring focus:border-blue-300 z-40"
            />
            <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-3 text-sm py-2 rounded z-40">
              Create New Contact
            </button>
          </div>
        </div>
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
          {filteredContacts.map(contact => (
            <tr key={contact._id}>
              <td className="border border-gray-400 p-1">{contact.name}</td>
              <td className="border border-gray-400 p-1">{contact.email}</td>
              <td className="border border-gray-400 p-1">{contact.phone}</td>
              <td className="border border-gray-400 p-1">{contact.status}</td>
              <td className="border border-gray-400 p-1 space-x-2">
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
