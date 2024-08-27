"use client";
import * as React from "react";
import { HiPencilAlt, HiTrash ,HiDotsHorizontal} from "react-icons/hi";
import LeaveForm from "./LeaveForm";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { leaveService } from "@/services/userleaveService";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
  const leavesPerPage = 2;

  const fetchLeaves = async (page: number) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/leaves?page=${page}&limit=${leavesPerPage}`);
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
        toast.success("Successfully edited!", { position: "bottom-right" });
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

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    if (status === "") {
      setTotalPages(Math.ceil(leaves.length / leavesPerPage));
    } else {
      const filteredLeaves = leaves.filter((leave) => leave.status === status);
      setTotalPages(Math.ceil(filteredLeaves.length / leavesPerPage));
    }
    setCurrentPage(1);
  };

  const filteredLeaves = statusFilter === "" ? leaves : leaves.filter((leave) => leave.status === statusFilter);

  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated") {
    return <p>Please log in to view your leaves.</p>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leaves</h1>
        <div className="flex items-center">
          <Button onClick={() => setShowForm(true)}>Request Leave</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                Filter by Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleStatusFilterChange("")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleStatusFilterChange("approved")}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleStatusFilterChange("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleStatusFilterChange("rejected")}>
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="bg-white p-[15px] rounded shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Number of Days</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeaves.map((leave) => (
              <TableRow key={leave._id}>
                <TableCell>{new Date(leave.date).toLocaleDateString()}</TableCell>
                <TableCell>{leave.numberofdays}</TableCell>
                <TableCell>{leave.dateRange}</TableCell>
                <TableCell>{leave.status}</TableCell>
                <TableCell>{leave.reason}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <HiDotsHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => handleEdit(leave)}>
                        <HiPencilAlt className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleDelete(leave._id!)}>
                        <HiTrash className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationPrevious
            onClick={currentPage === 1 ? undefined : () => handlePageChange(currentPage - 1)}
            className={cn({ "pointer-events-none opacity-50": currentPage === 1 })}
          />
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext
            onClick={currentPage === totalPages ? undefined : () => handlePageChange(currentPage + 1)}
            className={cn({ "pointer-events-none opacity-50": currentPage === totalPages })}
          />
        </PaginationContent>
      </Pagination>
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
