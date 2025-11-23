import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryVisit = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const empId = loggedInUser?.emp_id; // ✅ Extract emp_id

    // If emp_id exists, call user-specific API, otherwise call all-appointment API
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
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
      });
  }, []);

  const openModal = (qrPath) => {
    const fileName = qrPath.split("/").pop(); // <-- Extract only the file name
    setSelectedQR(`${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/qr/${fileName}`);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQR("");
  };

  return (
    <div style={{ maxHeight: "100%", overflowY: "auto", overflowX: "hidden" }}>
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
          <tr className="sticky" style={{ backgroundColor: "#f2f2f2" }}>
            <th>Visitor Name</th>
            <th>Employee Name</th>
            <th>Appointment Date</th>
            <th>Appointment Time</th>
            <th>Valid Till</th>
            <th>Status</th>
            <th>QR Code</th>
          </tr>
        </thead>
        <tbody>
  {appointments?.map((item) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    let rowStyle = {};

    if (item.appointment_date === today) {
      // Today's meetings: greenish
      rowStyle = { backgroundColor: "#d1fae5" };
    } else if (item.appointment_date > today) {
      // Upcoming meetings: blueish
      rowStyle = { backgroundColor: "#bfdbfe" };
    } else {
      // Past meetings: white
      rowStyle = { backgroundColor: "#ffffff" };
    }

    return (
      <tr key={item.id} style={rowStyle}>
        <td>{item.visitor_name}</td>
        <td>{item.emp_name}</td>
        <td>{item.appointment_date}</td>
        <td>{item.appointment_time}</td>
        <td>{item.valid_till}</td>
        <td>{item.status}</td>
        <td>
          {item.qr_code_path ? (
            <button
              onClick={() => openModal(item.qr_code_path)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Show QR Code
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

      {/* Modal */}
      {showModal && (
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
      zIndex: 2000,
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
      {/* ✅ Scrollable QR container */}
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
  </div>
)}
    </div>
  );
};

export default HistoryVisit;
