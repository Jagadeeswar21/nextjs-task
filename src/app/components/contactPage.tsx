'use client'
import React, { useEffect, useState } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import ContactForm from './contactForm';
import RemoveContact from './removeContact';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts');
        const data: Contact[] = await res.json();
        setContacts(data);
      } catch (error) {
        console.error('Failed to fetch contacts', error);
      }
    };

    fetchContacts();
  }, []);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSave = (newContact: Contact) => {
    if (editingContact) {
      setContacts(contacts.map(contact => (contact._id === newContact._id ? newContact : contact)));
    } else {
      setContacts([...contacts, newContact]);
    }
    setShowForm(false);
  };
  const handleDelete = (id: string) => {
      setContacts(contacts.filter(contact => contact._id !== id));
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
              <td className="border border-gray-400 p-1 flex space-x-2">
                <button onClick={() => handleEdit(contact)} className="text-blue-500 hover:text-blue-700 p-2">
                  <HiPencilAlt />
                </button>
                <RemoveContact id={contact._id} onDelete={()=>handleDelete(contact._id)}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
