import React, { useState } from "react";
import axios from "axios";

const VerifyQR = () => {
  const [showModal, setShowModal] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [idCardNumber, setIdCardNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Function triggered when scanner sends QR text
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
          setAppointment(res.data);
          setShowModal(true);
          console.log("Visitor QR scanned successfully!");
        } catch (err) {
          console.error("Verification failed:", err);
          alert("Invalid or expired QR code.");
        }
      }
    }
  };

  // Handle Confirm Entry (Check-In)
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
      {/* Close button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl font-bold"
      >
        &times;
      </button>

      {/* QR Image */}
      <div className="flex justify-center mb-4">
        <img
          src={`${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/qr/appointment_${appointment.id}.png`}
          alt="QR"
          className="w-36 h-36 rounded-lg"
        />
      </div>

      <hr className="my-3" />

      <p className="py-1"><b>Visitor Name:</b> {appointment.visitor_name}</p>
      <p className="py-1"><b>Meeting With:</b> {appointment.emp_name}</p>
      <p className="py-1"><b>Date:</b> {appointment.appointment_date}</p>
      <p className="py-1"><b>Time:</b> {appointment.appointment_time}</p>

      <div className="mt-4">
        <label className="block text-sm font-semibold mb-1">
          ID Card Number:
        </label>
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
            loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
          onClick={handleConfirmEntry}
          disabled={loading}
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
