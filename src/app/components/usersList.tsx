'use client';
import { useEffect, useState } from "react";
import RemoveBtn from './removeBtn';
import EditBtn from './editBtn';

export interface User {
  _id: string;
  name: string;
  email: string;
  status: string;
}

interface UserListProps {
  role: string;
}

const getUsers = async () => {
  try {
    const res = await fetch("/api/users", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading user details: ", error);
    return [];
  }
};

const UserList = ({ role }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data.users || []);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <table className="min-w-full border-collapse border border-gray-400 leading-normal">
        <thead>
          <tr>
            <th className="border w-[25%] border-gray-400 p-1">Name</th>
            <th className="border w-[35%] border-gray-400 p-1">Email</th>
            <th className="border w-[20%] border-gray-400 p-1">Status</th>
            <th className="border w-[20%] border-gray-400 p-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: User) => (
            <tr key={user._id}>
              <td className="border border-gray-400 p-1">{user.name}</td>
              <td className="border border-gray-400 p-1">{user.email}</td>
              <td className="border border-gray-400 p-1">{user.status}</td>
              <td className="border border-gray-400 p-1 flex justify-center items-center">
                <div className="flex gap-2">
                  {role === "admin" && <RemoveBtn id={user._id} />}
                  {(role === "admin" || role === "manager") && <EditBtn id={user._id} currentStatus={user.status} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
