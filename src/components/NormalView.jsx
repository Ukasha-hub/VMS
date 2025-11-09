import React, { useState, useEffect } from "react";
import axios from "axios";
import briefcase from "../assets/briefcase.png";
import calendar from "../assets/calendar.png";
import location from "../assets/location.png";

const Card = ({ visitor, showMeetingWith, showLocation, buttonLabel }) => (
  <div className="bg-white shadow-lg rounded-xl p-5 flex gap-4 justify-center w-full sm:w-[48%] lg:w-[30%]">
    <img
      src={visitor.img || "https://randomuser.me/api/portraits/lego/1.jpg"}
      alt={visitor.visitor_name || visitor.name}
      className="h-16 w-16 rounded-full object-cover"
    />
    <div className="flex-1 flex flex-col gap-1">
      <p className="font-semibold text-gray-800">{visitor.visitor_name || visitor.name}</p>
      {visitor.visitor_designation && <p className="text-gray-500">{visitor.visitor_designation}</p>}
      <p className="text-gray-500 flex flex-row gap-1">
        <img src={briefcase} alt="" />
        {visitor.visitor_organization || visitor.company}
      </p>
      <p className="text-gray-500 text-xs flex flex-row gap-1">
        <img src={calendar} alt="" />
        {visitor.appointment_date}, {visitor.appointment_time}
      </p>
      {showLocation && visitor.location && (
        <p className="text-red-600 flex flex-row gap-1 italic">
          <img src={location} alt="" /> {visitor.location}
        </p>
      )}
      {/* Employee Info */}
      {visitor.emp_name && (
        <div className="text-gray-600 italic mt-2">
          <p className="font-semibold">Employee Info:</p>
          <p>Name: {visitor.emp_name}</p>
          <p>Organization: {visitor.emp_organization}</p>
          <p>Department: {visitor.emp_department}</p>
          {visitor.emp_email && <p>Email: {visitor.emp_email}</p>}
        </div>
      )}
      {/* QR Code */}
     
     
    </div>
  </div>
);

const NormalView = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token"); // if auth is required
    axios
      .get("/api/v1/appointments/appointments/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  const currentlyPresentGuests = appointments.filter((a) => a.status === "CheckedIn");
  const upcomingMeetings = appointments.filter((a) => new Date(a.appointment_date) > new Date(todayStr));
  const todaysMeetings = appointments.filter((a) => a.appointment_date === todayStr);

  const filteredTodaysMeetings = todaysMeetings.filter((meeting) =>
    (meeting.visitor_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (meeting.visitor_organization || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (meeting.emp_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Currently Present Guests */}
      <div>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Currently Present Guests</h2>
        <div className="flex flex-wrap gap-4">
          {currentlyPresentGuests.map((guest) => (
            <Card
              key={guest.id}
              visitor={guest}
              showMeetingWith={false}
              showLocation={true}
              buttonLabel="View Profile"
            />
          ))}
          {currentlyPresentGuests.length === 0 && <p className="text-gray-500">No guests currently present.</p>}
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Upcoming Meetings</h2>
        <div className="flex flex-wrap gap-4">
          {upcomingMeetings.map((meeting) => (
            <Card
              key={meeting.id}
              visitor={meeting}
              showMeetingWith={false}
              showLocation={false}
              buttonLabel="View Profile"
            />
          ))}
          {upcomingMeetings.length === 0 && <p className="text-gray-500">No upcoming meetings.</p>}
        </div>
      </div>

      {/* Today's Meetings */}
      <div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Today's Meetings</h2>
        <input
          type="text"
          placeholder="Search today's meetings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        <div className="flex flex-wrap gap-4">
          {filteredTodaysMeetings.map((meeting) => (
            <Card
              key={meeting.id}
              visitor={meeting}
              showMeetingWith={true}
              showLocation={false}
              buttonLabel="Assign Card"
            />
          ))}
          {filteredTodaysMeetings.length === 0 && <p className="text-gray-500">No meetings found.</p>}
        </div>
      </div>
    </div>
  );
};

export default NormalView;
