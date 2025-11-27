import React, { useState } from "react";
import axios from "axios";

const VerifyQR = () => {
  const [showModal, setShowModal] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [idCardNumber, setIdCardNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeStatus, setTimeStatus] = useState(""); // new state for time validation

  const [isSameDate, setIsSameDate] = useState(true);

  

  const handleScan = async (e) => {
    if (e.key === "Enter") {
      const scannedText = e.target.value.trim();
      e.target.value = "";

      if (scannedText.startsWith("APPOINTMENT:")) {
        const id = scannedText.split(":")[1];

        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/verify/${id}`
          );

          const data = res.data;
          setAppointment(data);
          // ---- Date Comparison ----
const today = new Date().toISOString().split("T")[0];  // YYYY-MM-DD
const appointmentDay = data.appointment_date;

if (today !== appointmentDay) {
  setIsSameDate(false);
  setTimeStatus("❌ This QR is not valid for today.");
} else {
  setIsSameDate(true);
}
          setShowModal(true);

          // --- Time Validation ---
const now = new Date();
const appointmentDate = new Date(data.appointment_date + "T" + data.appointment_time);
const validTill = data.visiting_till
  ? new Date(data.appointment_date + "T" + data.visiting_till)
  : new Date(data.appointment_date + "T" + data.appointment_time); // fallback

const diffMs = now < appointmentDate ? appointmentDate - now : now - validTill;

// Convert ms to days, hours, minutes
const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

if (now < appointmentDate) {
  setTimeStatus(`Too early! Visit starts in ${diffDays} day(s), ${diffHours} hour(s), ${diffMinutes} minute(s).`);
} else if (now > validTill) {
  setTimeStatus(`Late! Visit expired ${diffDays} day(s), ${diffHours} hour(s), ${diffMinutes} minute(s) ago.`);
} else {
  setTimeStatus("✅ Visitor is within valid appointment time.");
}

          console.log("Visitor QR scanned successfully!");
        } catch (err) {
          console.error("Verification failed:", err);
          alert("Invalid or expired QR code.");
        }
      }
    }
  };

  const handleConfirmEntry = async () => {
    if (!idCardNumber.trim()) {
      alert("Please enter an ID Card Number.");
      return;
    }
    if (!appointment) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/checkin/${appointment.id}?card_no=${idCardNumber}`
      );
      console.log("Check-in success:", res.data);
      alert("Visitor successfully checked in!");
      setShowModal(false);
      setIdCardNumber("");
      setTimeStatus("");
    } catch (err) {
      console.error("Check-in failed:", err);
      if (err.response?.status === 400) {
        const message = err.response.data?.detail || "Check-in error";
        if (message.includes("already in use")) {
          alert("❌ This ID Card number is already assigned to another visitor who is still inside.");
        } else {
          alert(message);
        }
      } else {
        alert("Failed to check in visitor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-3">Scan QR Code</h2>
      <input
        type="text"
        placeholder="Scan QR here..."
        onKeyDown={handleScan}
        autoFocus
        className="border p-2 w-full rounded"
      />

      {showModal && appointment && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white p-6 rounded-lg w-[600px] shadow-xl flex flex-col relative"
            style={{ maxHeight: "85vh", overflowY: "auto" }}
          >
            <button
              onClick={() => { setShowModal(false); setTimeStatus(""); }}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>

            <div className="flex justify-center mb-4">
              <img
                src={`${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/qr/appointment_${appointment.id}.png`}
                alt="QR"
                className="w-36 h-36 rounded-lg"
              />
            </div>

            <hr className="my-3" />

            <p><b>Visitor Name:</b> {appointment.visitor_name}</p>
            <p><b>Meeting With:</b> {appointment.emp_name}</p>
            <p><b>Date:</b> {appointment.appointment_date}</p>
            <p><b>Valid from:</b> {appointment.appointment_time}</p>
            <p><b>Valid till:</b> {appointment.valid_till}</p>
            <p><b>Meeting Floor and Room:</b> {appointment.meeting_floor}, {appointment.meeting_room}</p>

            {/* New Time Status */}
            <p className="mt-2 font-semibold text-red-600">{timeStatus}</p>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-1">ID Card Number:</label>
              <input
                type="text"
                value={idCardNumber}
                onChange={(e) => setIdCardNumber(e.target.value)}
                placeholder="Enter ID Card Number"
                className="border p-2 w-full rounded"
              />
            </div>

            <div className="flex justify-center mt-5">
            <button
  className={`px-5 py-2 rounded text-white text-lg ${
    loading || !isSameDate ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
  }`}
  onClick={handleConfirmEntry}
  disabled={loading || !isSameDate}
>
  {loading ? "Checking in..." : "Confirm Entry"}
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyQR;
