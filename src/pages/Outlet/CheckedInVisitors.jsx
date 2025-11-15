import React, { useEffect, useState } from "react";
import axios from "axios";

const CheckedInVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all visitors who are currently inside premises — after QR scanned
  const fetchOnPremVisitors = async () => {
    try {
      const token = localStorage.getItem("access_token");
  
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/onpremises/now`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // backend: { count: X, visitors: [...] }
      setVisitors(res.data?.visitors || []);
    } catch (err) {
      console.error("❌ Failed to fetch on-prem visitors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnPremVisitors();
  }, []);

  // Handle checkout — hit checkout/[id]
  const handleCheckOut = async (visitorId) => {
    try {
      const token = localStorage.getItem("access_token");
      const currentTime = new Date().toISOString();

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/checkout/${visitorId}`,
        { checkout_time: currentTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove or update from UI
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === visitorId
            ? { ...v, checkout_time: currentTime, status: "Checked Out" }
            : v
        )
      );

      alert("✔ Visitor checked out successfully!");
    } catch (err) {
      console.error("❌ Failed to check out visitor:", err);
      alert("Checkout failed!");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-red-600 text-white">
            <th className="py-2 px-4">Visitor Name</th>
            <th className="py-2 px-4">Employee Name</th>
            <th className="py-2 px-4">Check-in Date</th>
            <th className="py-2 px-4">Check-in Time</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Card ID</th>
            <th className="py-2 px-4">Check Out</th>
          </tr>
        </thead>

        <tbody>
          {visitors.map((visitor) => (
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

              <td className="py-2 px-4">
                {visitor.status === "Checked Out" ? (
                  <span className="text-green-600 font-semibold">
                    Checked Out
                  </span>
                ) : (
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleCheckOut(visitor.id)}
                  >
                    Check Out
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckedInVisitors;
