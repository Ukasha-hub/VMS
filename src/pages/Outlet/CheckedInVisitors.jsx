import React, { useEffect, useState } from "react";
import axios from "axios";

const CheckedInVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const empId = loggedInUser?.emp_id;

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const url = empId
          ? `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/employee/${empId}`
          : `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVisitors(res.data); // assuming res.data is an array of visitors
      } catch (err) {
        console.error("Failed to fetch checked-in visitors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, [empId]);

  const handleCheckOut = async (visitorId) => {
    try {
      const token = localStorage.getItem("access_token");
      const currentTime = new Date().toISOString(); // current timestamp
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/${visitorId}/checkout`,
        { checkout_time: currentTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the local state to reflect checkout time
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === visitorId ? { ...v, checkout_time: currentTime, status: "Checked Out" } : v
        )
      );
    } catch (err) {
      console.error("Failed to check out visitor:", err);
      alert("Failed to check out. Please try again.");
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
            <th className="py-2 px-4">Visiting Card ID</th>
            <th className="py-2 px-4">Check Out</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((v) => (
            <tr key={v.id} className="text-center border-b">
              <td className="py-2 px-4">{v.visitor_name}</td>
              <td className="py-2 px-4">{v.emp_name}</td>
              <td className="py-2 px-4">{v.checkin_date}</td>
              <td className="py-2 px-4">{v.checkin_time}</td>
              <td className="py-2 px-4">{v.status}</td>
              <td className="py-2 px-4">{v.card_id}</td>
              <td className="py-2 px-4">
                {v.status === "Checked Out" ? (
                  <span className="text-green-600 font-semibold">Checked Out</span>
                ) : (
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleCheckOut(v.id)}
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
