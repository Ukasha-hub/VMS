import React, { useState } from 'react'

const ScanQRCode = () => {
    const [visitorData, setVisitorData] = useState(null);

  // Temporary mock function → replace with actual QR scanner logic later
  const handleScan = () => {
    // Simulated scanned visitor data
    setVisitorData({
        name: "John Doe",
        phone: "017xxxxxxxx",
        designation: "Manager",
        department: "Sales",
        email: "john@example.com",
        organization: "ABC Corp",
        purpose: "Business Meeting",
        visitingDate: "2025-02-05",
        visitingTime: "11:00 AM",
  
        meetingWith: "Alice Smith",
        employeeDesignation: "Senior Executive",
        employeeOrg: "XYZ Company",
        employeeDept: "Operations",
    });
  };
  return (
    <div className="flex justify-center items-center w-full">

      {/* container */}
      <div className="bg-white/70 backdrop-blur-lg shadow-lg p-8 rounded-xl w-full max-w-5xl">

      

        {/* ✅ If no QR scanned yet */}
        {!visitorData && (
          <div className="text-center text-gray-600 p-6 border rounded-lg bg-gray-100">
            <button onClick={handleScan} className="text-lg">No visitor QR scanned yet </button>

            {/* */}
            
          </div>
        )}

        {/* ✅ Show visitor info form AFTER QR Scan */}
        {visitorData && (
          <>
            {/* ✅ Visitor Information Section */}
            <h2 className="text-xl font-bold mb-3 text-gray-800">Visitor Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6">

              <p><span className="font-semibold">Visitor Name:</span> {visitorData.name}</p>
              <p><span className="font-semibold">Phone Number:</span> {visitorData.phone}</p>

              <p><span className="font-semibold">Email:</span> {visitorData.email}</p>
              <p><span className="font-semibold">Organization:</span> {visitorData.organization}</p>

              <p><span className="font-semibold">Designation:</span> {visitorData.designation}</p>
              <p><span className="font-semibold">Department:</span> {visitorData.department}</p>

              <p><span className="font-semibold">Visiting Time:</span> {visitorData.visitingTime}</p>
              <p><span className="font-semibold">Visiting Date:</span> {visitorData.visitingDate}</p>

              <p><span className="font-semibold">Purpose:</span> {visitorData.purpose}</p>

              
            </div>

            {/* ✅ Employee / Meeting Section */}
            <h2 className="text-xl font-bold mb-3 text-gray-800">Employee / Meeting Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">

              <p><span className="font-semibold">Meeting With:</span> {visitorData.meetingWith}</p>
              <p><span className="font-semibold">Designation:</span> {visitorData.employeeDesignation}</p>

              <p><span className="font-semibold">Organization:</span> {visitorData.employeeOrg}</p>
              <p><span className="font-semibold">Department:</span> {visitorData.employeeDept}</p>

            </div>
          </>
        )}


      </div>
    </div>
  )
}

export default ScanQRCode