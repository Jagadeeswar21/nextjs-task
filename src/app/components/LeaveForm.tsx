import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface LeaveFormProps {
  leave: Leave | null;
  onClose: () => void;
  onSave: (leave: Leave) => void;
}

interface Leave {
  _id?: string;
  date: string;
  numberofleaves: number;
  numberofdays: number;
  dateRange: string;
  startDate?: string;
  endDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  user?: string
}
const currentDate = new Date().toISOString().split('T')[0];

const LeaveForm: React.FC<LeaveFormProps> = ({ leave, onClose, onSave }) => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<Leave>({
    _id: leave?._id || '',
    date: leave?.date ||  currentDate ,
    numberofleaves: leave?.numberofleaves || 0,
    numberofdays: leave?.numberofdays || 0,
    dateRange: leave?.dateRange || '',
    startDate: leave?.startDate || '',
    endDate: leave?.endDate || '',
    status: leave?.status || 'pending',
    reason: leave?.reason || '',
  });

  useEffect(() => {
    if (leave) {
      setFormData(leave);
    }
  }, [leave]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updateDateRange = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      setFormData(prevState => ({
        ...prevState,
        dateRange: `${startDate} - ${endDate}`,
      }));
    }
  };

  useEffect(() => {
    updateDateRange(formData.startDate!, formData.endDate!);
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session) {
      onSave({ ...formData, user: session.user.id });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl mb-4">{leave ? 'Edit Leave' : 'Create New Leave'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border rounded p-1 w-full"
              required
            />
          </div>
          
          <div className="mb-2">
            <label>Number of Days</label>
            <input
              type="number"
              name="numberofdays"
              value={formData.numberofdays}
              onChange={handleChange}
              className="border rounded p-1 w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border rounded p-1 w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border rounded p-1 w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label>Date Range</label>
            <input
              type="text"
              name="dateRange"
              value={formData.dateRange}
              readOnly
              className="border rounded p-1 w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded p-1 w-full"
              required
            >

              <option value="pending">pending</option>
            </select>
          </div>
          <div className="mb-2">
            <label>Reason</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="border rounded p-1 w-full"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-3 py-1 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;
