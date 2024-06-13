
import RemoveBtn from './removeBtn';
import EditBtn from './editBtn';
export interface User {
    _id: string
    name: string
    email: string
    status:string
  }

const getUsers = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/users", {
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

export default async function usersList(){
    const {users}=await getUsers()
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
            <RemoveBtn id={user._id} />
            <EditBtn id={user._id} currentStatus={user.status} />
          </div>
        </div>
      ))}
    </>
  );
};