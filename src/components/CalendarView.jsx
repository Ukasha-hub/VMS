import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const empId = loggedInUser?.emp_id;

    // ✅ If emp_id exists → fetch appointments of that user else fetch all
    const url = empId
      ? `/api/v1/appointments/appointments/employee/${empId}`
      : "/api/v1/appointments/appointments/";

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Generate days for the month
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  
    return appointments
      .filter((a) => a.appointment_date === dateStr)
      .sort((a, b) => {
        // Compare times in HH:MM format
        const timeA = a.appointment_time.split(":").map(Number);
        const timeB = b.appointment_time.split(":").map(Number);
        return timeA[0] - timeB[0] || timeA[1] - timeB[1]; // sort by hour, then minute
      });
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="p-6">
      {/* Month & Year Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center font-semibold">
            {d}
          </div>
        ))}

        {days.map((day, idx) => {
          const dayEvents = getEventsForDate(day);

          return (
            <div
              key={idx}
              className="min-h-[80px] border p-1 rounded-lg flex flex-col"
            >
              {day && <span className="font-bold">{day}</span>}

              <div className="flex flex-col gap-1 mt-1 text-xs">
                {dayEvents.map((event) => (
                  <span
                    key={event.id}
                    className="bg-red-100 text-red-600 rounded px-1"
                  >
                    {event.emp_name} - {event.visitor_name} (
                    {event.appointment_time})
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
