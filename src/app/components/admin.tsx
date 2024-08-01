
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditLeaveBtn from "./editleavebtn";
import RemoveLeave from "./removeleavebtn";
import {
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type LeaveRequest = {
  numberofdays: string;
  _id: string;
  user: { name: string };
  date: string;
  status: string;
  reason: string;
};

export interface Leave {
  _id: string;
  date: string;
  numberofleaves: number;
  numberofdays: number;
  startDate: string;
  endDate: string;
  dateRange: string;
  status: string;
  reason: string;
}

const Admin = () => {
  const [userCount, setUserCount] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [approvedLeaves, setApprovedLeaves] = useState(0);
  const [rejectedLeaves, setRejectedLeaves] = useState(0);
  const [latestLeaves, setLatestLeaves] = useState<LeaveRequest[]>([]);
  const [dailyLeavesData, setDailyLeavesData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const router = useRouter();

  const getLeaves = async () => {
    try {
      const res = await fetch(`/api/leaves/edit`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch leaves");
      }
      const data = await res.json();
      setLeaves(data.leaves || []);
      //setTotalPages(Math.ceil(data.leaves.length / leavesPerPage));
    } catch (error) {
      console.log("Error loading leave details: ", error);
    }
  };
  console.log(getLeaves,"grt")
  
  useEffect(() => {
    getLeaves()
    
    const fetchData = async () => {
      try {
        const [userResponse, leaveResponse, approvedResponse, rejectedResponse, latestResponse,dailyResponse] = await Promise.all([
          fetch('/api/users/count'),
          fetch('/api/leaves/count'),
          fetch('/api/leaves/approved'),
          fetch('/api/leaves/rejected'),
          fetch('/api/leaves/latest?limit=5'),
          fetch(`/api/leaves/monthly?month=${selectedMonth}&year=${selectedYear}`),
        ]);

        if (!userResponse.ok || !leaveResponse.ok || !approvedResponse.ok || !rejectedResponse.ok || !latestResponse.ok|| !dailyResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const userCountData = await userResponse.json();
        const leaveCountData = await leaveResponse.json();
        const approvedCountData = await approvedResponse.json();
        const rejectedCountData = await rejectedResponse.json();
        const latestLeavesData = await latestResponse.json();
        const dailyLeavesData = await dailyResponse.json();

        setUserCount(userCountData.count);
        setTotalLeaves(leaveCountData.count);
        setApprovedLeaves(approvedCountData.count);
        setRejectedLeaves(rejectedCountData.count);
        setLatestLeaves(latestLeavesData.leaves);
        setDailyLeavesData(dailyLeavesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    
  }, [selectedMonth, selectedYear]);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const date = new Date(selectedYear, selectedMonth - 1, payload[0].payload.day);
        const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]}`;
        return (
          <div className="custom-tooltip">
            <p className="label">{`${formattedDate}`}</p>
            <p className="intro">{`${payload[0].value} Leaves`}</p>
          </div>
        );
      }
      return null;
    };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 p-4">
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaUsers className="text-5xl text-blue-500 mb-4" />
          <div>
            <h3 className="text-lg font-semibold text-blue-700 text-center">Number of Users</h3>
            <p className="text-3xl mt-2 text-blue-900 text-center">{userCount}</p>
          </div>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaCalendarAlt className="text-5xl text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-700 text-center">Total Leaves</h3>
            <p className="text-3xl mt-2 text-green-900 ">{totalLeaves}</p>
          </div>
          <div className="bg-purple-100 p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaCheckCircle className="text-5xl text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold text-purple-700 text-center">Approved Leaves</h3>
            <p className="text-3xl mt-2 text-purple-900 ">{approvedLeaves}</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaTimesCircle className="text-5xl text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-700 text-center">Rejected Leaves</h3>
            <p className="text-3xl mt-2 text-red-900">{rejectedLeaves}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Leave Requests</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Number of days</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Reason</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {latestLeaves.map((leave) => (
                <tr key={leave._id}>
                  <td className="py-2 px-4 border-b">{leave.user?.name}</td>
                  <td className="py-2 px-4 border-b">{new Date(leave.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{leave.numberofdays}</td>
                  <td className="border-b border-gray-300 py-2 px-4">
                  <span className={`inline-block py-1 px-3 rounded-full text-sm font-semibold ${
                    leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                    leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    leave.status === 'rejected' ? 'bg-red-100 text-red-800' : ''
                  }`}>{leave.status}</span>
                </td>
                  <td className="py-2 px-4 border-b">{leave.reason}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex gap-2">
                      <RemoveLeave id={leave._id} getLeaves={getLeaves} />
                      <EditLeaveBtn id={leave._id} currentStatus={leave.status} getLeaves={getLeaves}  />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => router.push('/adminDashboard/leaves')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View More
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Leaves in {monthNames[selectedMonth - 1]} {selectedYear}</h2>
            <div>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="mr-2 p-2 w-fit border rounded"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
              <input 
                type="number" 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="p-2 border rounded w-20"
              />
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={dailyLeavesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis  tickFormatter={(value: number) => Math.round(value).toString()}
                  allowDecimals={false}/>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="leaves" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  </div>
  );
};

export default Admin;