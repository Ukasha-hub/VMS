import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/murgi.png";
import vmsLogo from "../assets/vmsLogo.png";
import setupDummyUsers from "../api/setupDummyUsers";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  setupDummyUsers();
}, []);

  const handleLogin = (e) => {
  e.preventDefault();

  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  const registeredUser = allUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (registeredUser) {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("loggedInUser", JSON.stringify(registeredUser));
    navigate("/dashboard");
  } else {
    alert("Invalid credentials. Try again.");
  }
};


  return (
    <div
      className="relative flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Red transparent overlay */}
      <div className="absolute inset-0 bg-red-600/40"></div>

      {/* Logo at top-left */}
      <div className="absolute top-4 left-4 flex flex-row gap-2">
        <img src={vmsLogo} alt="VMS Logo" className="h-12 w-auto" />
        <div className="flex flex-col">
        <p className="text-white font-bold ">Kazi Farms</p>
        <p className="text-white font-bold "> VMS</p>
        </div>
       
      </div>

      {/* Login card */}
      <div className="relative bg-white p-8 rounded-2xl shadow-lg w-96 backdrop-blur-sm z-10">
        <form onSubmit={handleLogin}>
          <h2 className="text-4xl font-bold text-red-500 mb-6 text-center">Welcome</h2>
          <p className="text-black text-center mb-6 px-3">
            Please enter your credentials to get signed in
          </p>

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Remember Me + Forgot Password */}
          <div className="flex flex-row justify-between items-center mb-4">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-blue-500"
              />
              <span>Remember Me</span>
            </label>

            <Link to="/forgot-password" className="text-sm text-red-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Login
          </button>
          {/*<p className="text-sm mt-4 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-red-600 hover:underline">
              Register
            </Link>
          </p> */}
          
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
