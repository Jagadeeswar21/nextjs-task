'use client';
import React, { useEffect, useState } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import LeaveForm from './LeaveForm';
import RemoveLeave from './RemoveLeave';
import toast from 'react-hot-toast';

interface Leave {
  _id?: string;
  date: string;
  startDate: string;
  endDate: string;
  numberofleaves: number;
  numberofdays: number;
  dateRange: string;
  status: 'active' | 'inactive';
  reason: string;
}
const LeavesPage: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/leaves');
      const data: Leave[] = await res.json();
      setLeaves(data);
    } catch (error) {
      console.error('Failed to fetch leaves', error);
    }
  };
  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleEdit = (leave: Leave) => {
    setEditingLeave(leave);
    setShowForm(true);
  };

  const handleSave = async (newLeave: Leave) => {
    try {
      if (editingLeave) {
        await fetch(`/api/leaves/${newLeave._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLeave),
        });
        setLeaves(leaves.map(leave => (leave._id === newLeave._id ? newLeave : leave)));
        toast.success("Successfully edited!",{
          position:"bottom-right"
        });
      } else {
      
        const res = await fetch('/api/leaves', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLeave),
        });
        fetchLeaves()
        
      }
    } catch (error) {
      console.error('Failed to save leave', error);
    } finally {
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/leaves/${id}`, { method: 'DELETE' });
      setLeaves(leaves.filter(leave => leave._id !== id));
    } catch (error) {
      console.error('Failed to delete leave', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leaves</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-3 text-sm py-2 rounded">
          Request leave
        </button>
      </div>
      <table className="min-w-full border-collapse border border-gray-400 leading-normal">
        <thead>
          <tr>
            <th className="border w-[8%] border-gray-400 p-1">Date</th>
            <th className="border w-[8%] border-gray-400 p-1">Number of Leaves</th>
            <th className="border w-[8%] border-gray-400 p-1">Number of Days</th>
            <th className="border w-[14%] border-gray-400 p-1">Date Range</th>
            <th className="border w-[8%] border-gray-400 p-1">Status</th>
            <th className="border w-[20%] border-gray-400 p-1">Reason</th>
            <th className="border w-[8%] border-gray-400 p-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave._id}>
              <td className="border border-gray-400 p-1">{new Date(leave.date).toLocaleDateString()}</td>
              <td className="border border-gray-400 p-1">{leave.numberofleaves}</td>
              <td className="border border-gray-400 p-1">{leave.numberofdays}</td>
              <td className="border border-gray-400 p-1">{leave.dateRange}</td>
              <td className="border border-gray-400 p-1">{leave.status}</td>
              <td className="border border-gray-400 p-1"> <p className=''>{leave.reason}</p> </td>
              <td className=" border border-gray-400 p-1">
                <button onClick={() => handleEdit(leave)} className="text-blue-500 hover:text-blue-700 p-2">
                  <HiPencilAlt />
                </button>
                <RemoveLeave id={leave._id!} onDelete={() => handleDelete(leave._id!)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <LeaveForm
          leave={editingLeave}
          onClose={() => {
            setEditingLeave(null);
            setShowForm(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default LeavesPage;
