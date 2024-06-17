import React, { useState, useEffect } from 'react';

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
  status: 'active' | 'inactive';
  reason: string;
}

const LeaveForm: React.FC<LeaveFormProps> = ({ leave, onClose, onSave }) => {
  const [formData, setFormData] = useState<Leave>({
    _id: leave?._id || '',
    date: leave?.date || '',
    numberofleaves: leave?.numberofleaves || 0,
    numberofdays: leave?.numberofdays || 0,
    dateRange: leave?.dateRange || '',
    status: leave?.status || 'active',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
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
            <label>Number of Leaves</label>
            <input
              type="number"
              name="numberofleaves"
              value={formData.numberofleaves}
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
            <label>Date Range</label>
            <input
              type="text"
              name="dateRange"
              value={formData.dateRange}
              onChange={handleChange}
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
