import UsersList from "@/app/components/usersList"
export default function UserDetails(){
  const user = { role: "admin" }
    return <div>
      <UsersList role={user.role}/>
    </div>
    
    
}