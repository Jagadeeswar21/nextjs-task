"use client";
import React, { useEffect, useState } from "react";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import LeaveForm from "./LeaveForm";
import RemoveLeave from "./RemoveLeave";
import Pagination from "./pagination";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { leaveService } from "@/services/userleaveService";

interface Leave {
  _id?: string;
  date: string;
  numberofdays: number;
  startDate: string;
  endDate: string;
  dateRange: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  user?: string;
}

const LeavesPage: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const leavesPerPage = 5;

  const fetchLeaves = async (page: number) => {
    if (!session) return;
    try {
      const res = await fetch(
        `/api/leaves?page=${page}&limit=${leavesPerPage}`
      );
      const data = await res.json();
      setLeaves(data.leaves || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch leaves", error);
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
        await leaveService.editLeaveRequest(newLeave);
        setLeaves((prevLeaves) =>
          prevLeaves.map((leave) =>
            leave._id === newLeave._id ? newLeave : leave
          )
        );
        toast.success("Successfully edited!", {
          position: "bottom-right",
        });
      } else {
        await leaveService.addLeaveRequest(newLeave);
        fetchLeaves(currentPage);
      }
    } catch (error) {
      console.error("Failed to save leave", error);
    } finally {
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    await leaveService.deleteLeaveRequest(id);
    setLeaves(leaves.filter((leave) => leave._id !== id));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const filterValue = e.target.value;
    setStatusFilter(filterValue);
    if (filterValue === "") {
      setTotalPages(Math.ceil(leaves.length / leavesPerPage));
    } else {
      const filteredLeaves = leaves.filter(
        (leave) => leave.status === filterValue
      );
      setTotalPages(Math.ceil(filteredLeaves.length / leavesPerPage));
    }
    setCurrentPage(1);
  };

  const filteredLeaves =
    statusFilter === ""
      ? leaves
      : leaves.filter((leave) => leave.status === statusFilter);

  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated") {
    return <p>Please log in to view your leaves.</p>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leaves</h1>
        <div className="flex items-center">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-3 text-sm py-2 rounded"
          >
            Request leave
          </button>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="p-2 border border-gray-400 rounded bg-white w-fit ml-2"
          >
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="bg-white p-[15px] rounded shadow-lg">
        <table className="min-w-full border-collapse border border-gray-400 leading-normal">
          <thead>
            <tr>
              <th className="border w-[8%] border-gray-400 p-1">Date</th>
              <th className="border w-[8%] border-gray-400 p-1">
                Number of Days
              </th>
              <th className="border w-[16%] border-gray-400 p-1">Date Range</th>
              <th className="border w-[8%] border-gray-400 p-1">Status</th>
              <th className="border w-[20%] border-gray-400 p-1">Reason</th>
              <th className="border w-[8%] border-gray-400 p-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((leave) => (
              <tr key={leave._id}>
                <td className="border border-gray-400 p-1">
                  {new Date(leave.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-400 p-1">
                  {leave.numberofdays}
                </td>
                <td className="border border-gray-400 p-1">
                  {leave.dateRange}
                </td>
                <td className="border border-gray-400 p-1">{leave.status}</td>
                <td className="border border-gray-400 p-1">
                  <p className="">{leave.reason}</p>
                </td>
                <td className="border border-gray-400 p-1">
                  <button
                    onClick={() => handleEdit(leave)}
                    className="text-blue-500 hover:text-blue-700 p-2"
                  >
                    <HiPencilAlt />
                  </button>
                  {/* <RemoveLeave id={leave._id!} onDelete={() => handleDelete(leave._id!)} /> */}
                  <button
                    onClick={() => handleDelete(leave._id!)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <HiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
