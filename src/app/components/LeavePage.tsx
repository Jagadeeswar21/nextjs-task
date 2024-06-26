'use client';
import React, { useEffect, useState } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import LeaveForm from './LeaveForm';
import RemoveLeave from './RemoveLeave';
import Pagination from './pagination';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Leave {
  _id?: string;
  date: string;
  numberofleaves: number;
  numberofdays: number;
  startDate?: string;
  endDate?: string;
  dateRange: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  user?: string
}

const LeavesPage: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const { data: session, status } = useSession()
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const leavesPerPage = 5

  const fetchLeaves = async (page: number) => {
    if (!session) return
    try {
      const res = await fetch(`/api/leaves?page=${page}&limit=${leavesPerPage}`);
      const data = await res.json();
      setLeaves(data.leaves || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch leaves', error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchLeaves(currentPage);
    }
  }, [session, currentPage]);

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
        setLeaves(prevLeaves =>
          prevLeaves.map(leave => (leave._id === newLeave._id ? newLeave : leave))
        );
        toast.success("Successfully edited!", {
          position: "bottom-right"
        });
      } else {
        await fetch('/api/leaves', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLeave),
        });
        fetchLeaves(currentPage);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (status === 'loading') return <p>Loading...</p>;

  if (status === 'unauthenticated') {
    return <p>Please log in to view your leaves.</p>;
  }


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
            <th className="border w-[16%] border-gray-400 p-1">Date Range</th>
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
              <td className="border border-gray-400 p-1"><p className=''>{leave.reason}</p></td>
              <td className="border border-gray-400 p-1">
                <button onClick={() => handleEdit(leave)} className="text-blue-500 hover:text-blue-700 p-2">
                  <HiPencilAlt />
                </button>
                <RemoveLeave id={leave._id!} onDelete={() => handleDelete(leave._id!)} />
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
