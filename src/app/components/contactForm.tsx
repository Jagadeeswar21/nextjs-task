import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';

interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  sharedBy?: string;
  createdBy?: string;
}

interface ContactFormProps {
  contact: Contact | null;
  onClose: () => void;
  onSave: (contact: Contact) => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Email is invalid').required('Email is required'),
  phone: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone is required'),
  status: Yup.string().oneOf(['active', 'inactive'], 'Invalid status').required('Status is required'),
});

const ContactForm: React.FC<ContactFormProps> = ({ contact, onClose, onSave }) => {
  const { data: session } = useSession();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      status: 'active' as 'active' | 'inactive',
    },
    validationSchema,
    onSubmit: (values) => {
      const newContact: Contact = {
        ...values,
        _id: contact?._id,
        createdBy: contact?.sharedBy ? contact.sharedBy : session?.user?.id,
      };
      onSave(newContact);
    },
  });

  useEffect(() => {
    if (contact) {
      formik.setValues({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        status: contact.status,
      });
    }
  }, [contact]);

  return (
    <Sheet open={true}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{contact ? 'Edit Contact' : 'Create New Contact'}</SheetTitle>
          <SheetDescription>
            {contact ? 'Update the contact details below.' : 'Fill in the details to create a new contact.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Name"
              className="border rounded px-3 py-2 w-full"
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            ) : null}
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Email"
              className="border rounded px-3 py-2 w-full"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            ) : null}
          </div>
          <div>
            <input
              type="text"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Phone"
              className="border rounded px-3 py-2 w-full"
            />
            {formik.touched.phone && formik.errors.phone ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            ) : null}
          </div>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <SheetFooter>
            <Button type="button" onClick={onClose} className="px-4 py-2  text-white rounded">
              Cancel
            </Button>
            <Button type="submit" className="px-4 py-2 text-white rounded">
              Save
            </Button>
          </SheetFooter>
        </form>
        <SheetClose />
      </SheetContent>
    </Sheet>
  );
};

export default ContactForm;
