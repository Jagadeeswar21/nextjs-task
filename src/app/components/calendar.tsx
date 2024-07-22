'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const localizer = momentLocalizer(moment);

type LeaveData = {
  startDate: string;
  endDate: string;
  user: {
    name: string;
  };
};

const LeaveCalendar: React.FC = () => {
  const { data: session } = useSession();
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
          const formattedEvents: any[] = [];
          data.leaves.forEach((leave: LeaveData) => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            let currentDate = start;
            
            while (currentDate <= end) {
              formattedEvents.push({
                start: new Date(currentDate),
                end: new Date(currentDate),
                title: leave.user?.name,
                allDay: true,
              });
              currentDate.setDate(currentDate.getDate() + 1);
            }
          });
          
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
    <div className="calendar-container p-10">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width: '100%' }}
        views={['month']}
        popup
      />
    </div>
  );
};

export default LeaveCalendar;
