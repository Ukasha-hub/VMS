import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryVisitVersionTwo = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Search + Filters
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Sorting
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch appointments
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments(res.data);
      setFilteredData(res.data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter + Search + Sort
  useEffect(() => {
    let data = [...appointments];

    // Search by visitor/employee name
    if (searchValue.trim()) {
      data = data.filter(
        (item) =>
          item.visitor_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.emp_name?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      data = data.filter((item) => item.status === statusFilter);
    }

    // Sort by date + time combined
    data.sort((a, b) => {
      const dateA = new Date(a.checkin_time);
      const dateB = new Date(b.checkin_time);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredData(data);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchValue, statusFilter, sortDirection, appointments]);

  // Pagination slice
  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      {/* ---------- HEADER ---------- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 text-danger">
          <i className="fas fa-clock mr-2"></i>
          Visitor History
        </h4>

        {/* SEARCH */}
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search visitor or employee..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* ---------- FILTERS ---------- */}
      <div className="d-flex justify-content-start gap-3 mb-3">
        {/* STATUS FILTER */}
        <select
          className="form-control w-25"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Checked In">Checked In</option>
          <option value="Checked Out">Checked Out</option>
        </select>

        {/* SORT BUTTON */}
        <button className="btn btn-danger" onClick={toggleSort}>
          Sort by Check-in Date & Time{" "}
          {sortDirection === "asc" ? "↑" : "↓"}
        </button>
      </div>

      {/* ---------- TABLE ---------- */}
      <div style={{ overflowX: "auto" }}>
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="py-2 px-4">Visitor Name</th>
              <th className="py-2 px-4">Employee Name</th>
              <th className="py-2 px-4">Check-in Date</th>
              <th className="py-2 px-4">Check-in Time</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Card ID</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((visitor) => (
                <tr key={visitor.id} className="text-center border-b">
                  <td className="py-2 px-4">{visitor.visitor_name}</td>
                  <td className="py-2 px-4">{visitor.emp_name}</td>
                  <td className="py-2 px-4">
                    {visitor.checkin_time?.split("T")[0]}
                  </td>
                  <td className="py-2 px-4">
                    {visitor.checkin_time?.split("T")[1]?.slice(0, 8)}
                  </td>
                  <td className="py-2 px-4">{visitor.status}</td>
                  <td className="py-2 px-4">{visitor.card_no}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-3 text-muted"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- PAGINATION ---------- */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>
          Showing{" "}
          {totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0}{" "}
          to {Math.min(currentPage * pageSize, totalRecords)} of{" "}
          {totalRecords} entries
        </span>

        {/* PAGINATION BUTTONS */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span className="px-3 py-2 border rounded">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-outline-danger btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryVisitVersionTwo;
