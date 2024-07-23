'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);

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

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = moment(currentDate).add(direction === 'prev' ? -1 : 1, 'month').toDate();
    setCurrentDate(newDate);
  };

  const formattedMonthYear = moment(currentDate).format('MMMM YYYY');

  return (
    <div className="calendar-container bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            className="bg-[#ececec] text-black font-bold p-2 mx-1 rounded"
            onClick={() => handleMonthChange('prev')}
          >
            <FaChevronLeft />
          </button>
          <span className="mx-4 flex items-center gap-2 text-[17px] font-semibold">
            <FaCalendarAlt /> {formattedMonthYear}
          </span>
          <button
            className="bg-[#ececec] text-black font-bold p-2 mx-1 rounded"
            onClick={() => handleMonthChange('next')}
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="flex items-center">
          <button
            className={`${view === Views.DAY ? "bg-[#292929] text-white" : "bg-[#ececec] text-black"} px-4 py-1 mx-1 rounded`}
            onClick={() => setView(Views.DAY)}
          >
            Today
          </button>
          <button
            className={`${view === Views.WEEK ? "bg-[#292929] text-white" : "bg-[#ececec] text-black"} px-4 py-1 mx-1 rounded`}
            onClick={() => setView(Views.WEEK)}
          >
            Week
          </button>
          <button
            className={`${view === Views.MONTH ? "bg-[#292929] text-white" : "bg-[#ececec] text-black"} px-4 py-1 mx-1 rounded`}
            onClick={() => setView(Views.MONTH)}
          >
            Month
          </button>
        </div>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width: '100%' }}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        toolbar={false}
        view={view}
        onView={(newView) => setView(newView)}
        popup
      />
    </div>
  );
};

export default LeaveCalendar;
