import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

// Mock events → Replace with API or state
const events = [
  { date: "2025-11-02", title: "John Doe Visit" },
  { date: "2025-11-02", title: "John Daaa Visit" },
  { date: "2025-11-02", title: "John Daaa Visit" },
  { date: "2025-11-02", title: "John Daaa Visit" },
  { date: "2025-11-05", title: "Michael Brown Meeting" },
  { date: "2025-11-10", title: "Alice Johnson Visit" },
];

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Generate days for the month
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null); // empty slots
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    setCurrentDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(year, month + 1, 1);
    setCurrentDate(next);
  };

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
              className={`min-h-[80px] border p-1 rounded-lg flex flex-col`}
            >
              {day && <span className="font-bold">{day}</span>}
              <div className="flex flex-col gap-1 mt-1">
                {dayEvents.map((event, i) => (
                  <span
                    key={i}
                    className="text-xs bg-red-100 text-red-600 rounded px-1"
                  >
                    {event.title}
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
