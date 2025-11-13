import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const MakeAppointment = () => {
  const [empName, setEmpName] = useState("");
  const [empDesignation, setEmpDesignation] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empOrganization, setEmpOrganization] = useState("");
  const [empId, setEmpId] = useState("");
  const [empDepartment, setEmpDepartment] = useState("");

  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorOrganization, setVisitorOrganization] = useState("");
  const [visitorDesignation, setVisitorDesignation] = useState("");

  const [visitingDate, setVisitingDate] = useState("");
  const [visitingTime, setVisitingTime] = useState("");
  const [visitingPurpose, setVisitingPurpose] = useState("");

  const [user, setUser] = useState(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
const createdBy = storedUser?.emp_name || storedUser?.guard_name || "Unknown";

const { currentUser, updateUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      emp_name: empName,
      emp_organization: empOrganization,
      emp_designation: empDesignation,
      emp_id: empId,
      emp_email:empEmail,
      emp_department: empDepartment,
      visitor_name: visitorName,
      visitor_phone: visitorPhone,
      visitor_email: visitorEmail,
      visitor_organization: visitorOrganization,
      visitor_designation: visitorDesignation,
      appointment_date: visitingDate,
      appointment_time: visitingTime,
      status: "Pending", // optional default
      qr_code_path: "string", // optional placeholder
      created_by: createdBy, // optional
      purpose: visitingPurpose,
    };
    
    try {
      const token = localStorage.getItem("access_token"); // get token from login
      
      axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'erp-payload': JSON.stringify({
              employee_id: empId,
              name: empName,
              department: empDepartment
            })
          }
        }
     );
    
      alert("Appointment created successfully!");
      console.log("API Response →");
    } catch (err) {
      console.error("API POST Error →", err);
      alert("Failed to create appointment");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jsonParam = params.get("json");
    async function loadUserData() {
    if (jsonParam) {
      try {
        // Fix spaces and decode
        let decoded = decodeURIComponent(jsonParam.replace(/\+/g, " "));
  
        // Auto-fix missing closing quotes or braces
        if (decoded.endsWith('"') === false && !decoded.endsWith('"}')) {
          decoded = decoded + '"}';
        }
        if (!decoded.endsWith("}")) {
          decoded += "}";
        }
  
        // Try parsing
        let data;
        try {
          data = JSON.parse(decoded);
        } catch {
          // Last attempt: remove last bad character
          data = JSON.parse(decoded.slice(0, decoded.lastIndexOf("}") + 1));
        }
  
        console.log("Extracted JSON →", data);
  
        // Set form state
        setEmpName(data.empName || "");
        setEmpDesignation(data.empDesig || "");
        setEmpEmail(data.empEmail || "");
        setEmpOrganization(data.empOrg || "");
        setEmpId(data.empID || "");
        setEmpDepartment(data.empDept || "");
  
        // Save in localStorage
        const storedUser = {
          emp_name: data.empName || "",
          emp_designation: data.empDesig || "",
          department: data.empDept || "",
          organization: data.empOrg || "",
          emp_id: data.empID || "",
          email: data.empEmail || "",
        };
        console.log(storedUser)
        localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
        setUser(storedUser);
        updateUser(storedUser);
        localStorage.setItem("isAuthenticated", "true"); // optional
  
      } catch (err) {
        console.error("❌ JSON extraction failed →", err);
      }
    } 
    
      // Load from localStorage (even if URL JSON failed)
    const local = localStorage.getItem("loggedInUser");
    if (local) {
      const parsedUser = JSON.parse(local);
      setUser(parsedUser);

      // Prefill form
      setEmpName(parsedUser.emp_name || "");
      setEmpDesignation(parsedUser.emp_designation || "");
      setEmpEmail(parsedUser.email || "");
      setEmpOrganization(parsedUser.organization || "");
      setEmpId(parsedUser.emp_id || "");
      setEmpDepartment(parsedUser.department || "");
    }

    setIsLoading(false); // ✅ Now safe to render form
  }

  loadUserData();
   
  }, [location.search]);

  
  if (isLoading) {
    return (
      <div className="text-center p-8 text-red-600 font-semibold">
        Loading Employee Info...
      </div>
    );
  }

  return (
    
    <div className="flex justify-center">
      <div className="bg-white/70 backdrop-blur-lg shadow-lg p-8 rounded-xl w-full max-w-5xl">
        <h2 className="text-lg font-bold text-red-600 mb-4">Employee Info</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Employee Name</label>
              <input
                type="text"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Designation</label>
              <input
                type="text"
                value={empDesignation}
                onChange={(e) => setEmpDesignation(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Organization</label>
              <input
                type="text"
                value={empOrganization}
                onChange={(e) => setEmpOrganization(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Employee Email</label>
              <input
                type="text"
                value={empEmail}
                onChange={(e) => setEmpEmail(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Employee ID</label>
              <input
                type="text"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Department</label>
              <input
                type="text"
                value={empDepartment}
                onChange={(e) => setEmpDepartment(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
              />
            </div>
          </div>

          <div className="my-6 border-t-2 border-red-300"></div>

          <h2 className="text-lg font-bold text-red-600 mb-4">Visitor Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block font-semibold mb-1">Visiting Date</label>
              <input
                type="date"
                value={visitingDate}
                onChange={(e) => setVisitingDate(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Visiting Time</label>
              <input
                type="time"
                value={visitingTime}
                onChange={(e) => setVisitingTime(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Visitor Name</label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone No.</label>
              <input
                type="tel"
                value={visitorPhone}
                onChange={(e) => setVisitorPhone(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                value={visitorEmail}
                onChange={(e) => setVisitorEmail(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Visitor Organization</label>
              <input
                type="text"
                value={visitorOrganization}
                onChange={(e) => setVisitorOrganization(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
             
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Visitor Designation</label>
              <input
                type="text"
                value={visitorDesignation}
                onChange={(e) => setVisitorDesignation(e.target.value)}
                className="w-full p-2 border rounded focus:outline-red-500"
                
              />
            </div>
           
            <div className="col-span-2">
              <label className="block font-semibold mb-1">Visiting Purpose</label>
              <textarea
                value={visitingPurpose}
                onChange={(e) => setVisitingPurpose(e.target.value)}
                placeholder="Enter purpose of visit"
                className="w-full p-2 border rounded focus:outline-red-500"
                rows={4}
              ></textarea>
            </div>
          </div>


          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Submit Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeAppointment;
