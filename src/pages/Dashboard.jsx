import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import vmsLogo from "../assets/vmsLogo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(3); 

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/"); // Redirect if not logged in
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  // Sidebar menus by user category
  const menusByCategory = {
    admin: [
      { name: "Home", path: "/dashboard/home" },
      { name: "Users", path: "/dashboard/users" },
      { name: "Settings", path: "/dashboard/settings" },
      { name: "Reports", path: "/dashboard/reports" },
    ],
    employee: [
      { name: "Home", path: "/dashboard/home" },
      { name: "Appointment Approval", path: "/dashboard/projects" },
      { name: "Visit History", path: "/dashboard/tasks" },
    ],
    security: [
      { name: "Home", path: "/dashboard/home" },
      { name: "Visitors", path: "/dashboard/visitors" },
      { name: "Logs", path: "/dashboard/logs" },
    ],
  };

  // Get the user's category safely
  const userCategory = user?.category?.toLowerCase?.() || "employee";
  const menus = menusByCategory[userCategory] || menusByCategory.employee;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-red-600 text-white fixed top-0 left-0 h-full flex flex-col">
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
            <a
              key={menu.name}
              href={menu.path}
              className="block p-2 rounded hover:bg-gray-100 hover:text-red-600 transition"
            >
              {menu.name}
            </a>
          ))}
        </nav>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="m-4 p-2 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b-4 border-red-200 flex items-center justify-between px-6 fixed w-[calc(100%-16rem)] z-10">
          <h1 className="text-xl text-red-500 font-bold capitalize">
            {userCategory} Dashboard
          </h1>

          <div className="flex items-center gap-6">
            {/* Bell icon with number */}
            <button className="relative bg-yellow-200 p-2 rounded-full hover:bg-gray-200">
              <FaBell className="h-5 w-5 text-red-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5">
                  {notifications}
                </span>
              )}
            </button>

            {/* User info */}
            {user && (
              <div className="flex items-center gap-3">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="User"
                    className="h-10 w-10 rounded-full border-2 border-yellow-200 object-cover"
                  />
                ) : (
                  <FaUserCircle className="h-10 w-10 text-red-600" />
                )}
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}
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
