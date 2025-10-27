import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import vmsLogo from "../assets/vmsLogo.png";
import bgImage from "../assets/murgi.png";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Save user data in localStorage (just for demo purposes)
    localStorage.setItem(
      "user",
      JSON.stringify({ fullName, companyName, organizationName, email, phone, password, photo })
    );

    alert("Registration successful! Please log in.");
    navigate("/login");
  };

  return (
    <div className="relative flex justify-center items-start  bg-cover bg-center min-h-screen overflow-y-auto"  style={{ backgroundImage: `url(${bgImage})` }}>
         {/* Red transparent overlay */}
      <div className="absolute inset-0 bg-red-600/40 z-0 "></div>
      {/* Logo at top-left */}
      <div className="absolute top-4 left-4 flex flex-row gap-2 z-10">
        <img src={vmsLogo} alt="VMS Logo" className="h-12 w-auto" />
        <div className="flex flex-col">
        <p className="text-white font-bold ">Kazi Farms</p>
        <p className="text-white font-bold "> VMS</p>
        </div>
       
      </div>
      <div className="relative bg-gray-100 p-8 lg:mx-20 rounded-2xl lg:my-10 my-20   backdrop-blur-sm z-10 ">
      <form
        onSubmit={handleRegister}
        className="space-y-4"
      >
        <h2 className="text-4xl font-bold mb-4 text-center text-red-500">Create Account</h2>
        <p className="text-black text-center mb-6 px-3">
            Please enter your credentials to get signed in
          </p>

        <div>
        <label className="text-sm font-semibold text-gray-700 ">Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full h-10 border p-2 rounded-lg"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        </div>
        
        <div>
        <label className="text-sm font-semibold text-gray-700">Company Name</label>
        <input
          type="text"
          placeholder="Company Name"
          className="w-full  h-10 border p-2 rounded-lg"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        </div>
        
        <div>
        <label className="text-sm font-semibold text-gray-700">Organization Name</label>
        <input
          type="text"
          placeholder="Organization Name"
          className="w-full h-10 border p-2 rounded-lg"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          required
        />
        </div>
        
     <div>
     <label className="text-sm font-semibold text-gray-700">Email</label>
     <input
          type="email"
          placeholder="Email"
          className="w-full h-10 border p-2 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
     </div>
        
      <div>
      <label className="text-sm font-semibold text-gray-700">Phone Number</label>
      <input
          type="tel"
          placeholder="Phone Number"
          className="w-full h-10 border p-2 rounded-lg"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
        

        <div>
        <label className="text-sm font-semibold text-gray-700">Upload your Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full h-10 border p-2 rounded-lg mt-1"
          />
        </div>
        
        <div>
        <label className="text-sm font-semibold text-gray-700">Create Password</label>
        <input
          type="password"
          placeholder="Create Password"
          className="w-full h-10 border p-2 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        
        <div>
        <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full h-10 border p-2 rounded-lg"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        </div>
        

        <button
          type="submit"
          className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
        >
          Register
        </button>
        <p className="text-sm mt-2 text-center">
          By signing up you accept our{" "}
          <Link to="/" className="text-red-600 hover:underline">
            Terms &Conditions
          </Link>
        </p>
        <p className="text-sm mt-2 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-red-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
      </div>
     
    </div>
  );
};

export default RegisterPage;
