import UsersList from "@/app/components/usersList"
const UserDetails=()=>{
    const user = { role: "manager" }
    return <div>
      <UsersList role={user.role}/>
    </div>
}
export default UserDetails