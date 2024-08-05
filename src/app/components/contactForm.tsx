'use client'
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{contact ? 'Edit Contact' : 'Create New Contact'}</h2>
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
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
