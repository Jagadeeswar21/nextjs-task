import LeaveList from "@/app/components/leaveslist"
const LeaveDetails=()=>{
    const user = { role: "manager" }
    return <div>
      <LeaveList role={user.role}/>
    </div>
}
export default LeaveDetails