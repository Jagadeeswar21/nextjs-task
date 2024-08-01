"use client";
import { useEffect, useState } from "react";
import RemoveBtn from "./removeBtn";
import EditBtn from "./editBtn";
import { HiSearch } from "react-icons/hi";
import { userService } from "@/services/userService";

export interface User {
  _id: string;
  name: string;
  email: string;
  status: string;
  getUsers:any
}

interface UserListProps {
  role: string;
}
const UserList = ({ role }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.log("Error loading user details: ", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold">Users List</h2>
        <div className="ml-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 pl-10 pr-4 rounded-full border border-gray-400 focus:outline-none focus:ring focus:border-blue-300 bg-white"
          />
        </div>
      </div>
      <div className="bg-white p-[15px] rounded shadow-lg">
        <table className="min-w-full border-collapse border border-gray-400 bg-white leading-normal">
          <thead>
            <tr>
              <th className="border w-[25%] border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138]">
                Name
              </th>
              <th className="border w-[35%] border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138]">
                Email
              </th>
              <th className="border w-[20%] border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138]">
                Status
              </th>
              <th className="border w-[20%] border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138] text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: User) => (
              <tr key={user._id}>
                <td className="border border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138] px-5">
                  {user.name}
                </td>
                <td className="border border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138] px-10">
                  {user.email}
                </td>
                <td className="border border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138] px-20">
                  {user.status}
                </td>
                <td className="border border-[#eaedf1] p-1 font-medium text-[0.875rem] text-[#2e3138] px-20">
                  <div className="flex gap-2 px-20">
                    {role === "admin" && <RemoveBtn id={user._id} getUsers={getUsers} />}
                    {(role === "admin" || role === "manager") && (
                      <EditBtn id={user._id} currentStatus={user.status} getUsers={getUsers} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
