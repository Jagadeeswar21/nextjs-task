"use client";
import { useEffect, useState } from "react";
import EditLeaveBtn from "./editleavebtn";
import RemoveLeave from "./removeleavebtn";
import Pagination from './pagination';

interface LeaveListProps {
  role: string;
}

export interface Leave {
  _id: string;
  date: string;
  numberofleaves: number;
  numberofdays: number;
  startDate: string;
  endDate: string;
  dateRange: string;
  status: string;
  reason: string;
}

export default function LeaveList({ role }: LeaveListProps) {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const leavesPerPage = 2;

  const getLeaves = async () => {
    try {
      const res = await fetch(`/api/leaves/edit`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch leaves");
      }
      const data = await res.json();
      setLeaves(data.leaves || []);
      setTotalPages(Math.ceil(data.leaves.length / leavesPerPage));
    } catch (error) {
      console.log("Error loading leave details: ", error);
    }
  };

  useEffect(() => {
    getLeaves();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filterValue=e.target.value
    setStatusFilter(filterValue);
    if(filterValue===""){
      setTotalPages(Math.ceil(leaves.length/leavesPerPage))
    }else{
      const filteredLeaves=leaves.filter((leave)=>leave.status===filterValue)
      setTotalPages(Math.ceil(filteredLeaves.length/leavesPerPage))
    }
    setCurrentPage(1)
  };

  const filteredLeaves =statusFilter===""?leaves: leaves.filter(leave =>
     leave.status === statusFilter 
  );
 
  return (
    <>
      <div className="p-4">
        <div className="mb-4  flex items-center justify-between">
        <h2 className="text-xl font-semibold">Leave List</h2>
        <div className="flex items-center">
          
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="p-2 border border-gray-400 rounded w-fit"
          >
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        </div>
        <table className="min-w-full border-collapse border border-gray-400 leading-normal">
          <thead>
            <tr>
              <th className="border w-[8%] border-gray-400 p-1">Date</th>
              <th className="border w-[8%] border-gray-400 p-1">Number of Days</th>
              <th className="border w-[16%] border-gray-400 p-1">Date Range</th>
              <th className="border w-[8%] border-gray-400 p-1">Status</th>
              <th className="border w-[20%] border-gray-400 p-1">Reason</th>
              {(role === "admin" || role === "manager") && (
                <th className="border w-[8%] border-gray-400 p-1">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.slice((currentPage-1)* leavesPerPage,currentPage*leavesPerPage)
              .map((leave: Leave) => (
              <tr key={leave._id}>
                <td className="border border-gray-400 p-1">{new Date(leave.date).toLocaleDateString()}</td>
                <td className="border border-gray-400 p-1">{leave.numberofdays}</td>
                <td className="border border-gray-400 p-1">{leave.dateRange}</td>
                <td className="border border-gray-400 p-1">{leave.status}</td>
                <td className="border border-gray-400 p-1">{leave.reason}</td>
                {(role === "admin" || role === "manager") && (
                  <td className="border border-gray-400 px-20">
                    <div className="flex gap-2">
                      {role === "admin" && <RemoveLeave id={leave._id} />}
                      <EditLeaveBtn id={leave._id} currentStatus={leave.status} />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
