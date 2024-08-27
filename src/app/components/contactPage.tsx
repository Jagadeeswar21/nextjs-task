"use client"
import React, { useEffect, useState } from 'react';
import { HiPencilAlt, HiSearch, HiShare, HiTrash,HiDotsHorizontal } from 'react-icons/hi';
import ContactForm from './contactForm';
import RemoveContact from './removeContact';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { contactService } from '@/services/contactService';
import ShareContact from './shareContact';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

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

  const contactsPerPage = 2;

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
        const res = await contactService.addContact(newContact);
        toast.success("Successfully added!", {
          position: "bottom-right"
        });
        fetchContacts(currentPage);
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
      toast.error('Failed to delete contact', {
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
      <h1 className="text-2xl font-bold">Contacts</h1>
      <div className="ml-auto relative w-64">
  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
    <HiSearch className="text-gray-400 text-sm" />
  </div>
  <input
    type="text"
    placeholder="Search by name"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="p-1 pl-8 text-sm rounded-md border border-gray-400 focus:outline-none focus:ring focus:border-blue-300 bg-white w-full"
  />
</div><nav></nav>
        <Button onClick={() => setShowForm(true)} variant="default">Create New Contact</Button>
      </div>

      <div className="bg-white p-[15px] rounded shadow-lg">
        <Table >
          <TableHeader>
            <TableRow>
              <TableHead >Name</TableHead>
              <TableHead >Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead >Status</TableHead>
              <TableHead >Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map(contact => (
              <TableRow key={contact._id}>
                <TableCell >{contact.name}</TableCell>
                <TableCell >{contact.email}</TableCell>
                <TableCell >{contact.phone}</TableCell>
                <TableCell >{contact.status}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <HiDotsHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => handleEdit(contact)}>
                        <HiPencilAlt className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleDelete(contact._id!)}>
                        <HiTrash className="mr-2" /> Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShareContactId(contact._id || '')}>
                        <HiShare className="mr-2" /> share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationPrevious
            onClick={currentPage === 1 ? undefined : () => handlePageChange(currentPage - 1)}
            className={cn({ "pointer-events-none opacity-50": currentPage === 1 })}
          />
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext
            onClick={currentPage === totalPages ? undefined : () => handlePageChange(currentPage + 1)}
            className={cn({ "pointer-events-none opacity-50": currentPage === totalPages })}
          />
        </PaginationContent>
      </Pagination>

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
