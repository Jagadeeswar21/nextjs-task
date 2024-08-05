'use client'
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface Leave {
  _id?: string;
  date: string;
  numberofdays: number;
  startDate: string;
  endDate: string;
  dateRange: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  user?: string;
}

interface LeaveFormProps {
  leave: Leave | null;
  onClose: () => void;
  onSave: (leave: Leave) => void;
}

const validationSchema = Yup.object({
  date: Yup.date().required('Date is required'),
  numberofdays: Yup.number().positive('Must be positive').integer('Must be an integer').required('Number of days is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().min(Yup.ref('startDate'), 'End date must be after start date').required('End date is required'),
  reason: Yup.string().required('Reason is required'),
});

const LeaveForm: React.FC<LeaveFormProps> = ({ leave, onClose, onSave }) => {
  const { data: session } = useSession();
  const currentDate = new Date().toISOString().split('T')[0];

  const formik = useFormik({
    initialValues: {
      date: currentDate,
      numberofdays: 0,
      startDate: '',
      endDate: '',
      dateRange: '',
      status: 'pending' as 'pending' | 'approved' | 'rejected',
      reason: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const newLeave: Leave = {
        ...values,
        _id: leave?._id,
        user: session?.user?.id,
      };
      onSave(newLeave);
    },
  });

  useEffect(() => {
    if (leave) {
      formik.setValues({
        date: leave.date,
        numberofdays: leave.numberofdays,
        startDate: leave.startDate,
        endDate: leave.endDate,
        dateRange: leave.dateRange,
        status: leave.status,
        reason: leave.reason,
      });
    }
  }, [leave]);

  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      formik.setFieldValue('dateRange', `${formik.values.startDate} - ${formik.values.endDate}`);
    }
  }, [formik.values.startDate, formik.values.endDate]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl mb-4">{leave ? 'Edit Leave' : 'Create New Leave'}</h2>
        <form onSubmit={formik.handleSubmit} >
          <div className="mb-2">
            <label>Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border w-fullrounded p-1 w-full"
              required
            />
            {formik.touched.date && formik.errors.date ? (
              <p className="mt-2 text-sm text-red-600">{formik.errors.date}</p>
            ) : null}
          </div>

          <div className="mb-2">
            <label>Number of Days</label>
            <input
              type="number"
              id="numberofdays"
              name="numberofdays"
              value={formik.values.numberofdays}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded p-1 w-full"
            />
            {formik.touched.numberofdays && formik.errors.numberofdays ? (
              <p className="mt-2 text-sm text-red-600">{formik.errors.numberofdays}</p>
            ) : null}
          </div>

          <div className="mb-2">
            <label>Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border w-fullrounded p-1 w-full"
              required
            />
            {formik.touched.startDate && formik.errors.startDate ? (
              <p className="mt-2 text-sm text-red-600">{formik.errors.startDate}</p>
            ) : null}
          </div>

          <div className="mb-2">
            <label>End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border w-fullrounded p-1 w-full"
              required
            />
            {formik.touched.endDate && formik.errors.endDate ? (
              <p className="mt-2 text-sm text-red-600">{formik.errors.endDate}</p>
            ) : null}
          </div>

          <div className="mb-2">
            <label>Date Range</label>
            <input
              type="text"
              id="dateRange"
              name="dateRange"
              value={formik.values.dateRange}
              readOnly
              className="border w-fullrounded p-1 w-full"
              required
            />
          </div>

          <div className="mb-2">
            <label>Status</label>
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border w-fullrounded p-1 w-full"
              required
            >
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="mb-2">
            <label>Reason</label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border w-fullrounded p-1 w-full"
              required
            />
            {formik.touched.reason && formik.errors.reason ? (
              <p className="mt-2 text-sm text-red-600">{formik.errors.reason}</p>
            ) : null}
          </div>

          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;