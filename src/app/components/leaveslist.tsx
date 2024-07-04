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
  const leavesPerPage = 2;

  const getLeaves = async (page: number) => {
    try {
      const res = await fetch(`/api/leaves/edit?page=${page}&limit=${leavesPerPage}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch leaves");
      }
      const data = await res.json();
      setLeaves(data.leaves || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log("Error loading leave details: ", error);
    }
  };

  useEffect(() => {
    getLeaves(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="p-4">
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
            {leaves?.map((leave: Leave) => (
              <tr key={leave._id}>
                <td className="border border-gray-400 p-1">{new Date(leave.date).toLocaleDateString()}</td>
                <td className="border border-gray-400 p-1">{leave.numberofdays}</td>
                <td className="border border-gray-400 p-1">{leave.dateRange}</td>
                <td className="border border-gray-400 p-1">{leave.status}</td>
                <td className="border border-gray-400 p-1">{leave.reason}</td>
                {(role === "admin" || role === "manager") && (
                  <td className=" p-1 flex justify-center items-center">
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
