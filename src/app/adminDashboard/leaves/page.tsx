import LeaveList from "@/app/components/leaveslist"
export default function UserDetails(){
  const user = { role: "admin" }
    return <div>
      <LeaveList role={user.role}/>


      
    </div>
}