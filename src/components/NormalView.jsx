import React, { useState } from "react";
import briefcase from "../assets/briefcase.png";
import calendar from "../assets/calendar.png";
import location from "../assets/location.png";

// Mock Data → Replace with API or state
const currentlyPresentGuests = [
  {
    id: 1,
    name: "John Doe",
    company: "ABC Corp",
    designation: "Manager",
    department: "Sales",
    visitingDate: "2025-11-02",
    visitingTime: "10:00 AM",
    img: "https://randomuser.me/api/portraits/women/1.jpg",
    location: "Room 101",
  },
  {
    id: 2,
    name: "Jane Smith",
    company: "XYZ Ltd",
    designation: "Director",
    department: "Marketing",
    visitingDate: "2025-11-02",
    visitingTime: "11:30 AM",
    img: "https://randomuser.me/api/portraits/men/2.jpg",
    location: "Room 102",
  },
];

const upcomingMeetings = [
  {
    id: 1,
    name: "Michael Brown",
    company: "DEF Inc",
    designation: "CEO",
    department: "Operations",
    visitingDate: "2025-11-05",
    visitingTime: "2:00 PM",
    img: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

const todaysMeetings = [
  {
    id: 1,
    name: "Alice Johnson",
    company: "GHI Co",
    visitingDate: "2025-11-02",
    visitingTime: "1:00 PM",
    meetingWith: {
      name: "Mr. ABC",
      designation: "Manager",
      department: "Finance",
      organization: "XYZ Ltd",
    },
    img: "https://randomuser.me/api/portraits/men/4.jpg",
  },
];

const Card = ({ visitor, showMeetingWith, showLocation, buttonLabel }) => (
  <div className="bg-white shadow-lg rounded-xl p-5 flex gap-4 justify-center w-full sm:w-[48%] lg:w-[30%]">
    <img
      src={visitor.img}
      alt={visitor.name}
      className="h-16 w-16 rounded-full object-cover"
    />
    <div className="flex-1 flex flex-col gap-1">
      <p className="font-semibold text-gray-800">{visitor.name}</p>
      {visitor.designation && <p className="text-gray-500"> {visitor.designation}</p>}
      <p className="text-gray-500 flex flex-row gap-1"><img src={briefcase} alt="" />{visitor.company}</p>
      
     
      <p className="text-gray-500 text-xs flex flex-row gap-1">
        <img src={calendar} alt="" />{visitor.visitingDate}, {visitor.visitingTime}
      </p>
      {showLocation && visitor.location && (
        <p className="text-red-600 flex flex-row gap-1 italic"><img src={location} alt="" /> {visitor.location}</p>
      )}
      <button className="bg-red-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-red-700 transition">
      {buttonLabel}
    </button>
      {showMeetingWith && visitor.meetingWith && (
        <div className="text-gray-600 italic">
            <p className="font-semibold">Meeting with:</p>
          <p> {visitor.meetingWith.name}</p>
          <p>Organization: {visitor.meetingWith.organization}</p>
          <p>Designation: {visitor.meetingWith.designation}</p>
        
        </div>
      )}
    </div>
    
  </div>
);

const NormalView = () => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter today's meetings based on search query (name, company, or meetingWith name)
    const filteredTodaysMeetings = todaysMeetings.filter((meeting) =>
      meeting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (meeting.meetingWith?.name &&
        meeting.meetingWith.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return (
        <div className="space-y-8">
          {/* Currently Present Guests */}
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Currently Present Guests
            </h2>
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
              className="mb-4 p-2 border rounded w-full "
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
              {filteredTodaysMeetings.length === 0 && (
                <p className="text-gray-500">No meetings found.</p>
              )}
            </div>
          </div>
        </div>
      );
};

export default NormalView;
