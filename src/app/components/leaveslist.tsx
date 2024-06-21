"use client";
import { useEffect, useState } from "react";
import EditLeaveBtn from "./editleavebtn";
import RemoveLeave from "./removeleavebtn";
import Pagination from './pagination';

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

export default function LeaveList() {
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
      {leaves?.map((leave: Leave) => (
        <div
          key={leave._id}
          className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start"
        >
          <div>
            <h2 className="font-bold text-2xl">Leave Request</h2>
            <div>Number of Leaves: {leave.numberofleaves}</div>
            <div>Date: {new Date(leave.date).toLocaleDateString()}</div>
            <div>Number of Leaves: {leave.numberofleaves}</div>
            <div>Number of Days: {leave.numberofdays}</div>
            <div>
              Start Date: {new Date(leave.startDate).toLocaleDateString()}
            </div>
            <div>End Date: {new Date(leave.endDate).toLocaleDateString()}</div>
            <div>Date Range: {leave.dateRange}</div>
            <div>Status: {leave.status}</div>
            <div>Reason: {leave.reason}</div>
          </div>
          <div className="flex gap-2">
            <RemoveLeave id={leave._id} />
            <EditLeaveBtn id={leave._id} currentStatus={leave.status} />
          </div>
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
