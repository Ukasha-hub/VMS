import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { FaBell, FaUserCircle, FaBars  } from "react-icons/fa";
import vmsLogo from "../assets/vmsLogo.png";
import { Link } from "react-router-dom";
import {   useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import dashboardIcon from "../assets/dashboard.png";
import MakeAppointment from "../assets/MakeAppointment.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(3); 
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  // Sidebar menus by user category
  const menusByCategory = {
   
    employee: [
      { name: "Home", path: "", icon:dashboardIcon},

      { name: "Make Appointment", path: "dashboard/makeappointment", icon:MakeAppointment },
     { name: "Scanned Visitor Info", path: "dashboard/scanqrcode", icon:"" },
    ],
    
  };

  // Get the user's category safely
  const userCategory = user?.category?.toLowerCase?.() || "employee";
  const menus = menusByCategory[userCategory] || menusByCategory.employee;
   // ✅ Convert current path to readable page name
   const routeTitleMap = {
    "/dashboard/home": "Home",
    "/dashboard/makeappointment": "Make Appointment",
  };

  const pageTitle = routeTitleMap[location.pathname] || "Dashboard";

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-red-600 text-white fixed top-0 left-0 h-full w-64 flex flex-col transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}     // visible on desktop
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
      <img src={menu.icon} alt={menu.name} className="h-5 w-5 object-contain mr-2" />
    )}
    <span>{menu.name}</span>
  </Link>
))}
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 p-2 bg-yellow-400 text-red-500 rounded hover:bg-red-200"
        >
          Back to ERP
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="m-4 p-2 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

       {/* ✅ Overlay for mobile when sidebar is open */}
       {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300
  ${sidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        {/* Header */}
        <header
  className={`h-16 bg-white border-b-4 border-red-200 flex items-center justify-between px-4 md:px-6 fixed z-20 transition-all duration-300
  ${sidebarOpen ? "w-[calc(100%-16rem)]" : "w-full"} md:w-[calc(100%-16rem)]`}
>
  {/* Hamburger icon visible only on mobile */}
  <div className="flex items-center gap-2">
    <RxHamburgerMenu
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="text-red-600 text-2xl md:hidden cursor-pointer"
    />
    <h1 className="text-red-500 font-bold capitalize text-xs md:text-xl">
      {pageTitle}
    </h1>
  </div>

  {/* Right section: notifications & user */}
  <div className="flex items-center gap-4 md:gap-6">
    {/* Bell icon */}
    <button className="relative bg-yellow-200 p-2 rounded-full hover:bg-gray-200">
      <FaBell className="h-5 w-5 text-red-600" />
      {notifications > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5">
          {notifications}
        </span>
      )}
    </button>

    {/* User info */}
    <div className="flex items-center gap-2 md:gap-3">
      <FaUserCircle className="h-8 w-8 md:h-10 md:w-10 text-red-600" />
      <div className="text-left hidden md:block">
        <p className="text-sm font-semibold text-gray-800">Mr.ABC</p>
        <p className="text-xs text-gray-500">abc@gmail.com</p>
      </div>
    </div>
  </div>
</header>

        {/* Page Content */}
        <main className="flex-1 mt-16 p-6 overflow-y-auto bg-yellow-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
