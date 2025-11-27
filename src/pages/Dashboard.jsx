import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import vmsLogo from "../assets/vmsLogo.png";
import dashboardIcon from "../assets/dashboard.png";
import MakeAppointment from "../assets/MakeAppointment.png";
import verify from "../assets/verify.png";
import scan from "../assets/scan.png";
import history from "../assets/history.png";
import { decryptAES } from "../utils/decryptAES";
import { UserContext } from "../context/UserContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const { currentUser, updateUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  
            // Update localStorage and context
            localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
            localStorage.setItem("isAuthenticated", "true");
            updateUser(storedUser);
            setUser(storedUser);
            userData = storedUser;
          }
        } catch (err) {
          console.error("Decryption failed:", err);
        }
      }
  
      // If no URL payload or decryption failed, fallback to localStorage
      if (!userData) {
        const storedUser = localStorage.getItem("loggedInUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          updateUser(parsedUser);
        }
      }
  
      setLoadingUser(false);
    };
  
    loadUser();
  }, [location.search]);

// Redirect if no user and no URL payload
useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const jsonParam = queryParams.get("json");
  if (!currentUser && !jsonParam && !loadingUser) {
    navigate("/");
  }
}, [currentUser, location.search, loadingUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  // Sidebar menus
  const allMenus = [
    { name: "Home", path: "", icon: dashboardIcon },
    { name: "Make Appointment", path: "makeappointment", icon: MakeAppointment },
    { name: "Visitor History", path: "history", icon: history },
    { name: "Scan Visitor Info", path: "scanqrcode", icon: scan },
    { name: "Checked In Visitors", path: "checkedin", icon: verify },
   // { name: "HistoryVersionTwo", path: "historytwo", icon: verify },
  ];

  // Filter menus based on user type
  let menus = allMenus;

  if (user) {
    if (user.emp_name) {
      // Employee: hide "Scan Visitor Info"
      menus = allMenus.filter((menu) => menu.name !== "Scan Visitor Info");
    } else if (user.guard_name) {
      // Guard: hide "Make Appointment"
      menus = allMenus.filter((menu) => menu.name !== "Make Appointment");
    }
  }

  const routeTitleMap = {
    "/dashboard/home": "Home",
    "/dashboard/makeappointment": "Make Appointment",
    "/dashboard/history": "Visitor History",
    "/dashboard/scanqrcode": "Scan Visitor Info",
    "/dashboard/checkedin": "Checked In Visitors",
    "/dashboard/historytwo": "HistoryVersionTwo",
  };

  const pageTitle = routeTitleMap[location.pathname] || "Dashboard";

  if (loadingUser) return null;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
  className={`bg-red-600 text-white fixed top-0 left-0 h-full w-64 flex flex-col 
  transform transition-transform duration-300 z-30
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
  md:translate-x-0`}
>
        <div className="pt-2 border-b-2 border-red-400 pb-1 pl-4 flex flex-row gap-2 items-center">
          <img src={vmsLogo} alt="VMS Logo" className="h-12 w-auto" />
          <div className="flex flex-col leading-tight">
            <p className="text-white font-bold">Kazi Farms</p>
            <p className="text-white font-bold">VMS</p>
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex-1 p-2 mt-2 space-y-2">
          {menus.map((menu) => (
            <Link
              key={menu.name}
              to={menu.path}
              className="flex items-center p-2 rounded hover:bg-gray-100 hover:text-red-600 transition"
            >
              {menu.icon && (
                <img
                  src={menu.icon}
                  alt={menu.name}
                  className="h-5 w-5 object-contain mr-2"
                />
              )}
              <span>{menu.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        {!user?.emp_name && (
          <button
            onClick={handleLogout}
            className="m-4 p-2 bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        {/* Header */}
        <header
          className={`h-16 bg-white border-b-4 border-red-200 flex items-center justify-between px-4 md:px-6 fixed z-20 transition-all duration-300
          ${
            sidebarOpen ? "w-[calc(100%-16rem)]" : "w-full"
          } md:w-[calc(100%-16rem)]`}
        >
          <div className="flex items-center gap-2">
            <RxHamburgerMenu
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-red-600 text-2xl md:hidden cursor-pointer"
            />
            <h1 className="text-red-500 font-bold capitalize text-xs md:text-xl">
              {pageTitle}
            </h1>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4 md:gap-6">
           

            <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-4 md:gap-6 relative" ref={dropdownRef}>
      <button
        className="relative bg-yellow-200 p-2 rounded-full hover:bg-gray-200"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <FaUserCircle className="h-8 w-8 md:h-10 md:w-10 text-red-600" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-3 top-10 mt-2 w-60 bg-white shadow-lg rounded-md border border-gray-200 z-50 p-4">
          {/* Pointy arrow */}
          <div className="absolute top-[-6px] right-4 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-b-6 border-b-white"></div>

          {user?.emp_name ? (
            <>
              <p className="font-bold text-red-600">{user.emp_name}</p>
              <p className="text-sm text-gray-700">ID: {user.emp_id}</p>
              <p className="text-sm text-gray-700">Designation: {user.emp_designation}</p>
              <p className="text-sm text-gray-700">Email: {user.email}</p>
              <p className="text-sm text-gray-700">Department: {user.department}</p>
              <p className="text-sm text-gray-700">Organization: {user.organization}</p>
            </>
          ) : user?.guard_name ? (
            <>
              <p className="font-bold text-red-600">{user.guard_name}</p>
              <p className="text-sm text-gray-700">Designation: {user.designation}</p>
              <p className="text-sm text-gray-700">Username: {user.username}</p>
            </>
          ) : (
            <p className="text-sm text-gray-700">Guest</p>
          )}

         
        </div>
      )}
    </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.emp_name || user?.guard_name || "Guest"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.emp_designation || user?.designation}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 mt-16 p-6 overflow-y-auto bg-yellow-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
