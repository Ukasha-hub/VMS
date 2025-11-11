import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "antd";

const VerifyVisitor = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isGuard, setIsGuard] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 1️⃣ Fetch appointment info
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/appointments/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Not found", err));

    // 2️⃣ Detect if logged-in guard
    const token = localStorage.getItem("token");
    if (token) setIsGuard(true);
  }, [id]);

  const handleCheckin = async () => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/appointments/${id}`, { checkin_time: new Date() }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    alert("Check-in successful!");
    setVisible(false);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10 text-center">
      <h2 className="text-2xl font-bold mb-4">KFG Visitor Verification</h2>
      <div className="p-4 border rounded-lg bg-white shadow-md">
        <p><strong>Visitor:</strong> {data.visitor_name}</p>
        <p><strong>Organization:</strong> {data.visitor_organization}</p>
        <p><strong>Email:</strong> {data.visitor_email}</p>
        <p><strong>Appointment With:</strong> {data.emp_name}</p>
        <p><strong>Date:</strong> {data.appointment_date}</p>
        <p><strong>Time:</strong> {data.appointment_time}</p>
      </div>

      {isGuard && (
        <div className="mt-5">
          <Button type="primary" onClick={() => setVisible(true)}>Check-in</Button>
          <Modal open={visible} onCancel={() => setVisible(false)} footer={null}>
            <h3>Confirm Check-in</h3>
            <Button type="primary" onClick={handleCheckin}>Confirm</Button>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default VerifyVisitor; 