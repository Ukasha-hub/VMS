import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryVisit = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    axios
      .get("/api/v1/appointments/appointments/", {
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
    setSelectedQR(`http://172.16.9.98:8000/${qrPath}`);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQR("");
  };

  return (
    <>
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
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Visitor Name</th>
            <th>Employee Name</th>
            <th>Appointment Date</th>
            <th>Appointment Time</th>
            <th>Status</th>
            <th>QR Code</th>
          </tr>
        </thead>
        <tbody>
          {appointments?.map((item) => (
            <tr key={item.id}>
              <td>{item.visitor_name}</td>
              <td>{item.emp_name}</td>
              <td>{item.appointment_date}</td>
              <td>{item.appointment_time}</td>
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
          ))}
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
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>QR Code</h3>
            <img src={selectedQR} alt="QR Code" width="200" height="200" />
            <br />
            <button
              onClick={closeModal}
              style={{
                marginTop: "10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryVisit;
