import React, { useEffect, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";

const HistoryVisit = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState("");

  const [statusFilter, setStatusFilter] = useState(""); // "", "Pending", "On_Premises", "Completed"
  const [sortOrder, setSortOrder] = useState(""); // asc or desc
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const empId = loggedInUser?.emp_id; 

    const url = empId
      ? `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/employee/${empId}`
      : `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAppointments(res.data);
        setFilteredAppointments(res.data);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
      });
  }, []);

  // ----------------- FILTER & SORT -----------------
  const [searchTerm, setSearchTerm] = useState("");

  const [showToday, setShowToday] = useState(false);
const [showUpcoming, setShowUpcoming] = useState(false);

  // Modify the FILTER & SORT useEffect
  useEffect(() => {
    let sorted = [...appointments].sort((a, b) => {
      if (a.appointment_date !== b.appointment_date) {
        return sortOrder === "asc"
          ? a.appointment_date.localeCompare(b.appointment_date)
          : b.appointment_date.localeCompare(a.appointment_date);
      }
  
      return b.appointment_time.localeCompare(a.appointment_time);
    });
  
    const today = new Date().toISOString().split("T")[0];
  
    // --- TODAY FILTER ---
    if (showToday) {
      sorted = sorted.filter((ap) => ap.appointment_date === today);
    }
  
    // --- UPCOMING FILTER (future dates only) ---
    if (showUpcoming) {
      sorted = sorted.filter((ap) => ap.appointment_date > today);
    }
  
    // Status filter
    if (statusFilter) {
      sorted = sorted.filter((ap) => ap.status === statusFilter);
    }
  
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      sorted = sorted.filter(
        (ap) =>
          ap.visitor_name.toLowerCase().includes(term) ||
          ap.emp_name.toLowerCase().includes(term)
      );
    }
  
    setFilteredAppointments(sorted);
    setCurrentPage(1);
  }, [
    statusFilter,
    sortOrder,
    searchTerm,
    appointments,
    showToday,
    showUpcoming,
  ]);
  
  

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const dt = new Date(isoString);
    return dt.toLocaleString("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const openModal = (qrPath) => {
    const fileName = qrPath.split("/").pop();
    setSelectedQR(
      `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/qr/${fileName}`
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQR("");
  };

  // ----------------- PAGINATION -----------------
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = React.useMemo(() => {
    const last = currentPage * rowsPerPage;
    const first = last - rowsPerPage;
    return filteredAppointments.slice(first, last);
  }, [filteredAppointments, currentPage]);
  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);

  return (
    <div style={{ height: "100%", overflowY: "auto", overflowX: "hidden", position: "relative"}} className="sticky">
      {/* ---------------- FILTER & SORT UI ---------------- */}
      <div className="flex flex-row justify-between bg-white p-3 rounded-md shadow-lg border border-gray-100" style={{
      position: "sticky",
      top: 0,
      
      backgroundColor: "white",
    }}>

  {/* LEFT — Filter + Sort + Today/Upcoming */}
  <div className="flex gap-4 mb-4 items-center">
      
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border p-1 text-xs rounded shadow-sm"
    >
      <option value="">⏳ Filter Status</option>
      <option value="Pending">Pending</option>
      <option value="On_Premises">On Premises</option>
      <option value="Completed">Completed</option>
    </select>

    <button
      onClick={() =>
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
      }
      className="bg-red-600 text-white text-xs px-2 py-1 rounded shadow-sm hover:bg-red-700 transition"
    >
      Sort {sortOrder === "asc" ? "↑" : "↓"}
    </button>

    <div className="flex items-center gap-3 ml-2 text-xs">
      <label className="flex items-center gap-1 text-red-600 font-bold">
        <input
          type="checkbox"
          checked={showToday}
        
          onChange={(e) => {
            setShowToday(e.target.checked);
            if (e.target.checked) setShowUpcoming(false);
          }}
        />
        Today
      </label>

      <label className="flex items-center gap-1 text-red-600 font-bold">
        <input
          type="checkbox"
          checked={showUpcoming}
          onChange={(e) => {
            setShowUpcoming(e.target.checked);
            if (e.target.checked) setShowToday(false);
          }}
        />
        Upcoming
      </label>
    </div>

  </div>

  {/* CENTER — Search */}
  <div className="flex justify-center gap-1 flex-grow">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mt-[2px]">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>

    <input
      type="text"
      placeholder="Search visitor or employee..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border-2 p-1 mb-3 text-xs rounded w-80 shadow-sm"
    />
  </div>

  {/* RIGHT — Pagination */}
  <div className="flex justify-end mb-2 gap-2">

    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="bg-red-600 text-white text-xs px-1 py-1 rounded shadow-sm hover:bg-red-700 disabled:opacity-50 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
    </button>

    <span className="px-2 py-2 text-xs border rounded text-red-700 font-semibold bg-white shadow-sm">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="bg-red-600 text-white text-xs px-1 py-1 rounded shadow-sm hover:bg-red-700 disabled:opacity-50 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </button>

  </div>
</div>
<div style={{ overflowY: "auto", maxHeight: "calc(100% - 80px)" }}>
      <table
        border="1"
        cellPadding="8"
        style={{
          width: "100%",
          textAlign: "center",
          backgroundColor: "white",
          borderCollapse: "collapse",
         
        }}
      >
        <thead>
          <tr className="sticky" style={{ top: "0", backgroundColor: "#f2f2f2",  }}>
            <th>Visitor</th>
            <th>Employee</th>
            <th>Appt Date</th>
            <th>Appt Time</th>
            <th>Valid Till</th>
            <th>Check in</th>
            <th>Check out</th>
            <th>Status</th>
            <th>QR Code</th>
          </tr>
        </thead>
        <tbody key={sortOrder + statusFilter + searchTerm} className="h-50">
          {currentRows.map((item) => {
            const today = new Date().toISOString().split("T")[0];
            let rowStyle = {};

            if (item.appointment_date === today) {
              rowStyle = { backgroundColor: "#d1fae5" };
            } else if (item.appointment_date > today) {
              rowStyle = { backgroundColor: "#bfdbfe" };
            } else {
              rowStyle = { backgroundColor: "#ffffff" };
            }

            return (
              <tr key={item.id} style={rowStyle}>
                <td>{item.visitor_name}</td>
                <td>{item.emp_name}</td>
                <td>{item.appointment_date}</td>
                <td>{item.appointment_time}</td>
                <td>{item.valid_till}</td>
                <td>{formatDateTime(item.checkin_time)}</td>
                <td>{formatDateTime(item.checkout_time)}</td>
                <td>{item.status}</td>
                <td>
                  {item.qr_code_path ? (
                    <button
                      onClick={() => openModal(item.qr_code_path)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "3px 5px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      title="Scan QR Code"
                    >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
</svg>

                    </button>
                  ) : (
                    "No QR"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
     

      {/* ---------------- MODAL ---------------- */}
      {showModal &&
  createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
      onClick={closeModal}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          textAlign: "center",
          width: "80vw",
          height: "90vh",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "20px",
          }}
        >
          <img
            src={selectedQR}
            alt="QR Code"
            style={{
              width: "auto",
              minWidth: "600px",
              height: "auto",
              minHeight: "800px",
              objectFit: "contain",
            }}
          />
        </div>

        <button
          onClick={closeModal}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "6px",
            cursor: "pointer",
            width: "120px",
            alignSelf: "center",
            marginTop: "12px",
          }}
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  )}
    </div>
  );
};

export default HistoryVisit;
