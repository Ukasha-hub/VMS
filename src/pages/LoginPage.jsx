import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/murgi.png";
import vmsLogo from "../assets/vmsLogo.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/api/v1/auth/auth/guard_login",
        {
          username,
          password,
        }
      );

      // If login is successful
      const { access_token, guard_name, designation } = res.data;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("access_token", access_token);
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ guard_name, designation, username })
      );

      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      console.error("Login API Error →", err);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="relative flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-red-600/40"></div>

      <div className="absolute top-4 left-4 flex flex-row gap-2">
        <img src={vmsLogo} alt="VMS Logo" className="h-12 w-auto" />
        <div className="flex flex-col">
          <p className="text-white font-bold">Kazi Farms</p>
          <p className="text-white font-bold">VMS</p>
        </div>
      </div>

      <div className="relative bg-white p-8 rounded-2xl shadow-lg w-96 backdrop-blur-sm z-10">
        <form onSubmit={handleLogin}>
          <h2 className="text-4xl font-bold text-red-500 mb-6 text-center">Welcome</h2>
          <p className="text-black text-center mb-6 px-3">
            Please enter your credentials to get signed in
          </p>

          <input
            type="text"
            placeholder="Username"
            className="w-full border p-2 rounded mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        </form>
      </div>
    </div>
  );
};

export default LoginPage;