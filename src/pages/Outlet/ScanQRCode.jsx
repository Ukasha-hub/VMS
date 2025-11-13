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
      alert("Failed to check in visitor.");
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
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div
            className="bg-white p-6 rounded-lg w-96 shadow-lg flex flex-col"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            <img
              src={`${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/qr/appointment_${appointment.id}.png`}
              alt="QR"
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <hr className="my-3" />
            <p><b>Name:</b> {appointment.visitor_name}</p>
            <p><b>Meeting:</b> {appointment.emp_name}</p>
            <p><b>Date:</b> {appointment.appointment_date}</p>
            <p><b>Time:</b> {appointment.appointment_time}</p>

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

            <div className="text-right mt-5">
              <button
                className={`px-4 py-2 rounded text-white ${
                  loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
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
