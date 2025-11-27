import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import CryptoJS from "crypto-js";
import { decryptAES } from "../../utils/decryptAES";

const OutlinedInput = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  readOnly = false,
  as = "input", // "input" | "textarea" | "select"
  options = [], // only for select
}) => {
  const commonClasses =
    "w-full border border-gray-400 rounded-md px-3 pt-5 pb-2 focus:outline-none focus:border-red-600";

  return (
    <div className="relative w-full mt-4">
      {/* Floating Label */}
      <label className="absolute -top-2 left-3 px-1 bg-white text-sm font-bold text-black">
        {label} {required && "*"}
      </label>

      {/* Input / Textarea / Select */}
      {as === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
          rows={4}
          className={`${commonClasses} ${readOnly ? "bg-gray-100 cursor-not-allowed" : "text-xs"}`}
        />
      ) : as === "select" ? (
        <select
          value={value}
          onChange={onChange}
          required={required}
          disabled={readOnly}
          className={`${commonClasses} ${readOnly ? "bg-gray-100 cursor-not-allowed" : "h-15 text-xs"}`}
        >
          <option value="">Select {label}</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
          className={`${commonClasses} ${readOnly ? "bg-gray-100 h-10 text-xs cursor-not-allowed" : "h-10 text-xs"}`}
        />
      )}
    </div>
  );
};

// ====================================================================
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
 const [meetingFloor, setMeetingFloor] = useState("")
 const [visitingTill, setVisitingTill] = useState("")

 const [roomType, setRoomType] = useState("")

  

  const [user, setUser] = useState(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
const createdBy = storedUser?.emp_name || storedUser?.guard_name || "Unknown";

const { currentUser, updateUser } = useContext(UserContext);
const navigate = useNavigate();



function urlSafeBase64ToBase64(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return str;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  // --- TIME VALIDATION ---
  if (visitingTime && visitingTill) {
    if (visitingTill <= visitingTime) {
      alert("Visiting Till time must be later than Visiting Time.");
      setSubmitting(false);
      return;
    }
  }

  // --- BLOCK PAST TIME BOOKING FOR TODAY ---
  const today = new Date().toISOString().split("T")[0];
  if (visitingDate === today) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    if (visitingTime <= currentTime || visitingTill <= currentTime) {
      alert("You cannot book an appointment for a past time today.");
      setSubmitting(false);
      return;
    }
  }

  const payload = {
    emp_name: empName,
    emp_organization: empOrganization,
    emp_designation: empDesignation,
    emp_id: empId,
    emp_email: empEmail,
    emp_department: empDepartment,
    visitor_name: visitorName,
    visitor_phone: visitorPhone,
    visitor_email: visitorEmail,
    visitor_organization: visitorOrganization,
    visitor_designation: visitorDesignation,
    appointment_date: visitingDate,
    appointment_time: visitingTime,
    status: "Pending",
    qr_code_path: "string",
    created_by: createdBy,
    meeting_floor: meetingFloor,
    meeting_room: roomType,
    valid_till: visitingTill,
    purpose: visitingPurpose,
  };

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/appointments/appointments/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "erp-payload": JSON.stringify({
            employee_id: empId,
            name: empName,
            department: empDepartment,
          }),
        },
      }
    );

    alert("✅ Appointment created successfully!");
    // Reset form
    setVisitorName("");
    setVisitorPhone("");
    setVisitorEmail("");
    setVisitorOrganization("");
    setVisitorDesignation("");
    setVisitingDate("");
    setVisitingTime("");
    setVisitingTill("");
    setVisitingPurpose("");
    setMeetingFloor("");
    setRoomType("self");

    console.log("API Response →", response.data);
  } catch (err) {
    console.error("API POST Error →", err);
    // Show backend error detail if available
    const errorDetail = err.response?.data?.detail || "Failed to create appointment";
    alert(`❌ ${errorDetail}`);
  } finally {
    setSubmitting(false);
  }
};


  function urlSafeBase64ToBase64(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return str;
  }
  
  const secretKey = "1234567890123456";
  const iv = "abcdefghijklmnop";
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const jsonParam = queryParams.get("json");
  
    const loadUser = async () => {
      let userData = null;
  
      // If encrypted payload exists in URL, try to decrypt
      if (jsonParam) {
        try {
          const decodedParam = decodeURIComponent(jsonParam); // decode URL-encoded string
          const standardBase64 = urlSafeBase64ToBase64(decodedParam); // URL-safe → Base64
          const decrypted = decryptAES(standardBase64, secretKey, iv);
  
          if (decrypted) {
            const storedUser = {
              emp_name: decrypted.empName || "",
              emp_designation: decrypted.empDesig || "",
              department: decrypted.empDept || "",
              organization: decrypted.empOrg || "",
              emp_id: decrypted.empID || "",
              email: decrypted.empEmail || "",
            };
          
            // Save to localStorage
            localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
            localStorage.setItem("isAuthenticated", "true");
          
            // Update context
            updateUser(storedUser);
            setUser(storedUser);
          
            // ⭐ PREFILL FORM FIELDS IMMEDIATELY ⭐
            setEmpName(storedUser.emp_name);
            setEmpDesignation(storedUser.emp_designation);
            setEmpEmail(storedUser.email);
            setEmpOrganization(storedUser.organization);
            setEmpId(storedUser.emp_id);
            setEmpDepartment(storedUser.department);
          
            userData = storedUser;
          }
        } catch (err) {
          console.error("Decryption failed:", err);
        }
      }
  
      setEmpName(storedUser.emp_name);
            setEmpDesignation(storedUser.emp_designation);
            setEmpEmail(storedUser.email);
            setEmpOrganization(storedUser.organization);
            setEmpId(storedUser.emp_id);
            setEmpDepartment(storedUser.department);
  
      setIsLoading(false);
    };
  
    loadUser();
  }, [location.search]);

   // Redirect if no user and no URL payload
   useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const jsonParam = queryParams.get("json");
    if (!currentUser && !jsonParam && !isLoading) {
      navigate("/");
    }
  }, [currentUser, location.search, isLoading, navigate]);
  
  
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
        
        <form className="space-y-5" onSubmit={handleSubmit}>
  {/* ---------------- EMPLOYEE INFO ---------------- */}
 
  <h2 className="text-lg font-bold text-red-600 mb-4">Visitor Info</h2>

{/* Visitor Row 1 */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>
   
    <OutlinedInput
      type="date"
      label="Visiting Date"
      value={visitingDate}
      onChange={(e) => setVisitingDate(e.target.value)}
      
      required
    />
  </div>

  <div>
  
    <OutlinedInput
      type="time"
      label="Visiting Time"
      value={visitingTime}
      onChange={(e) => setVisitingTime(e.target.value)}
     
      required
    />
  </div>

  <div>
   
    <OutlinedInput
      type="time"
      label="Visiting Till"
      value={visitingTill}
      onChange={(e) => setVisitingTill(e.target.value)}
     
      required
    />
  </div>
</div>

{/* Visitor Row 2 */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>
   
    <OutlinedInput
    type="text"
    label="Visitor Name"
    value={visitorName}
    onChange={(e) => setVisitorName(e.target.value)}
    required
/>
  </div>

  <div>
   
    <OutlinedInput
      type="tel"
      label= "Phone No."
      value={visitorPhone}
      onChange={(e) => setVisitorPhone(e.target.value)}
      
      required
    />
  </div>

  <div>
   
    <OutlinedInput
      type="text"
      label="Visitor Organization"
      value={visitorOrganization}
      onChange={(e) => setVisitorOrganization(e.target.value)}
      
    />
  </div>
</div>

{/* Visitor Row 3 */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
  
    <OutlinedInput
      type="email"
      label="Email"
      value={visitorEmail}
      onChange={(e) => setVisitorEmail(e.target.value)}
     
      required
    />
  </div>

  <div>
    
    <OutlinedInput
      type="text"
      label="Visitor Designation"
      value={visitorDesignation}
      onChange={(e) => setVisitorDesignation(e.target.value)}
      
    />
  </div>
</div>

{/* Meeting Floor & Room */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    
    <OutlinedInput
label="Meeting Floor"
value={meetingFloor}
onChange={(e) => setMeetingFloor(e.target.value)}
as="select"
options={["1", "4", "8", "9", "10", "11", "12"]}
required
/>
  </div>

  <div>
   
    <OutlinedInput
    label="Meeting Room"
      value={roomType}
      onChange={(e) => setRoomType(e.target.value)}
       as="select"
      options={["Self", "Conference"]}
      required
      />
  </div>
</div>

{/* Purpose */}
<div>
  
  <OutlinedInput label="Purpose" value={visitingPurpose} onChange={(e) => setVisitingPurpose(e.target.value)} as="textarea" />
</div>

  

  {/* ---------------- VISITOR INFO ----------------
  <div className="my-6 border-t-2 border-red-300"></div>
   */}

   {/* 
   <h2 className="text-lg font-bold text-red-600 mb-4">Employee Info</h2>

 
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
     
      <OutlinedInput
        type="text"
        label="Employee Name"
        value={empName}
        readOnly
        
      />
    </div>

    <div>
     
      <OutlinedInput
        type="text"
        label="Employee ID"
        value={empId}
        readOnly
       
      />
    </div>

    <div>
     
      <OutlinedInput
        type="text"
        label="Designation"
        value={empDesignation}
        readOnly
      
      />
    </div>
  </div>

 
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
     
      <OutlinedInput
        type="text"
        label="Employee Email"
        value={empEmail}
        readOnly
        hidden
      />
    </div>

    <div>
     
      <OutlinedInput
        type="text"
      
        label="Department"
        value={empDepartment}
        readOnly
       
      />
    </div>

    <div>
     
      <OutlinedInput
        type="text"
        label="Organization"
        value={empOrganization}
        readOnly
       
      />
    </div>
  </div> 
  */}
 
 
  <div className="flex justify-center mt-4">
  <button
  type="submit"
  disabled={submitting}
  className={`bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition ${
    submitting && "opacity-50 cursor-not-allowed"
  }`}
>
  {submitting ? "Submitting…" : "Submit Appointment"}
</button>
  </div>
</form>

      </div>
    </div>
  );
};

export default MakeAppointment;
