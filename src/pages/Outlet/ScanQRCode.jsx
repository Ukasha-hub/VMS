import React, { useState } from "react";
import QrScanner from "react-qr-barcode-scanner";
import { useNavigate } from "react-router-dom";

const ScanQRCode = () => {
  const [visitorData, setVisitorData] = useState(null);
  const navigate = useNavigate();

  // ✅ When QR Code is scanned
  const handleScan = (result) => {
    if (!result?.text) return;

    try {
      const scannedText = result.text;

      // ✅ If QR contains ?json= then redirect like:
      // http://example.com?json=encodedData
      if (scannedText.includes("?json=")) {
        const queryPart = scannedText.substring(scannedText.indexOf("?"));
        navigate(`/dashboard/home${queryPart}`);
        return;
      }

      // ✅ If QR contains JSON visitor data instead of URL
      const parsed = JSON.parse(scannedText);
      setVisitorData(parsed);
    } catch (err) {
      console.log("Invalid QR Data Format", err);
    }
  };

  const handleError = (error) => {
    console.error("QR Scan Error: ", error);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-white/70 backdrop-blur-lg shadow-lg p-8 rounded-xl w-full max-w-5xl">
        <h2 className="text-xl font-bold mb-3 text-gray-800 text-center">
          QR Code Scanner
        </h2>

        {/* ✅ QR CAMERA */}
        {!visitorData && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-md border-4 border-red-600 rounded-xl overflow-hidden shadow-lg">
              <QrScanner
               constraints={{
                video: {
                  width: 500,
                  height: 500,
                  facingMode: { ideal: "environment" }
                }
              }} // back camera
                scanDelay={300}
                onResult={handleScan}
                onError={handleError}
                style={{ width: "100%" }}
              />
            </div>

            <p className="text-gray-500 text-sm">
              Point your camera to a visitor QR code
            </p>
          </div>
        )}

        {/* ✅ Display visitor details once QR scanned */}
        {visitorData && (
          <>
            {/* ✅ Visitor Information */}
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              Visitor Information
            </h2>

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

            {/* ✅ Meeting / Employee Info */}
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              Employee / Meeting Information
            </h2>

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
  );
};

export default ScanQRCode;
