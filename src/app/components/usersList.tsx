'use client'
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
    <>
      {users?.map((user: User) => (
        <div
          key={user._id}
          className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start"
        >
          <div>
            <h2 className="font-bold text-2xl">{user.name}</h2>
            <div>{user.email}</div>
            <div>{user.status}</div>
          </div>
          <div className="flex gap-2">
            {role === "admin" && <RemoveBtn id={user._id} />}
            <EditBtn id={user._id} currentStatus={user.status} />
          </div>
        </div>
      ))}
    </>
  );
};

export default UserList;
