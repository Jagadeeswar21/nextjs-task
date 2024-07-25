import React, { useState } from "react";
import LeaveCalendar from "@/app/components/calendar";

export default function Calendar() {
  const [statusFilter, setStatusFilter] = useState<string>("");

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
  };

  return (
    <div>
      <div className="mb-4 flex items-center">
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="p-2 border border-[#eaedf1] rounded bg-white"
        >
          <option value="">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <LeaveCalendar statusFilter={statusFilter} />
    </div>
  );
}
