"use client";
import { useEffect, useState } from "react";
import EditLeaveBtn from "./editleavebtn";
import RemoveLeave from "./removeleavebtn";
import Pagination from "./pagination";
import LeaveCalendar from "@/app/components/calendar";
import { FaCalendarAlt, FaList } from "react-icons/fa";
import { leaveService } from "@/services/userleaveService";

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
  const [view, setView] = useState<"list" | "calendar">("list");
  const leavesPerPage = 2;

  const getLeaves = async () => {
    try {
      const data = await leaveService.getLeaves();
      console.log(data)
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

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Leave List</h2>
        <div className="flex items-center">
          <button
            onClick={() => setView("list")}
            className={`flex items-center p-2 border border-[#eaedf1] rounded bg-white ${
              view === "list" ? "bg-blue-200" : ""
            }`}
          >
            <FaList className="ml-2" />
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center p-2 border border-[#eaedf1] rounded bg-white ${
              view === "calendar" ? "bg-blue-200" : ""
            } ml-2`}
          >
            <FaCalendarAlt className="ml-2" />
          </button>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="p-2 border border-[#eaedf1] rounded bg-white w-fit ml-2"
          >
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="mb-4">
          <LeaveCalendar statusFilter={statusFilter} />
        </div>
      ) : (
        <div className="bg-white p-[15px] rounded shadow-lg">
          <table className="min-w-full border-collapse border border-[#eaedf1] leading-normal">
            <thead>
              <tr>
                <th className="border w-[8%] border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138]">
                  Date
                </th>
                <th className="border w-[8%] border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138]">
                  Number of Days
                </th>
                <th className="border w-[16%] border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138]">
                  Date Range
                </th>
                <th className="border w-[8%] border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138]">
                  Status
                </th>
                <th className="border w-[20%] border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138]">
                  Reason
                </th>
                {(role === "admin" || role === "manager") && (
                  <th className="border w-[8%] border-[#eaedf1] p-1 text-[0.875rem] font-medium">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredLeaves
                .slice(
                  (currentPage - 1) * leavesPerPage,
                  currentPage * leavesPerPage
                )
                .map((leave: Leave) => (
                  <tr key={leave._id}>
                    <td className="border border-[#eaedf1] p-1">
                      {new Date(leave.date).toLocaleDateString()}
                    </td>
                    <td className="border border-[#eaedf1] p-1">
                      {leave.numberofdays}
                    </td>
                    <td className="border border-[#eaedf1] p-1">
                      {leave.dateRange}
                    </td>
                    <td className="border border-[#eaedf1] p-1">
                      {leave.status}
                    </td>
                    <td className="border border-[#eaedf1] p-1">
                      {leave.reason}
                    </td>
                    {(role === "admin" || role === "manager") && (
                      <td className="border border-[#eaedf1] px-20">
                        <div className="flex gap-2">
                          {role === "admin" && <RemoveLeave id={leave._id}  getLeaves={getLeaves} />}
                          <EditLeaveBtn
                            id={leave._id}
                            currentStatus={leave.status}
                            getLeaves={getLeaves}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {view === "list" && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
