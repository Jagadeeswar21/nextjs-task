'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer}  from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

type LeaveData = {
  date: string;
  user: {
    name: string;
  };
};

const LeaveCalendar: React.FC = () => {
  const { data: session } = useSession();
  const [leaveData, setLeaveData] = useState<LeaveData[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaveData = async () => {
      if (session) {
        try {
          const response = await fetch('/api/leaves/calendar');
          if (!response.ok) {
            throw new Error('Failed to fetch leave data');
          }
          const data = await response.json();
          setLeaveData(data.leaves);
          
          // Convert leave data to events format
          const formattedEvents = data.leaves.map((leave: LeaveData) => ({
            start: new Date(leave.date),
            end: new Date(leave.date),
            title: leave.user?.name,
            allDay: true,
          }));
          setEvents(formattedEvents);
        } catch (error) {
          console.error('Error fetching leave data:', error);
          toast.error('Failed to fetch leave data.', {
            position: 'bottom-right',
          });
        }
      }
    };
    fetchLeaveData();
  }, [session]);

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

export default LeaveCalendar;