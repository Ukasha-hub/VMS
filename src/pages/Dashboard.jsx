import React from "react";
import { useNavigate, Outlet } from "react-router-dom";

const Dashboard = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  // Define sidebar menus based on role
  const menus = {
    admin: [
      { name: "Home", path: "/dashboard/home" },
      { name: "Users", path: "/dashboard/users" },
      { name: "Settings", path: "/dashboard/settings" },
    ],
    manager: [
      { name: "Home", path: "/dashboard/home" },
      { name: "Projects", path: "/dashboard/projects" },
    ],
    user: [{ name: "Home", path: "/dashboard/home" }],
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white fixed top-0 left-0 h-full flex flex-col">
        <div className="p-4 text-2xl font-bold">VMS</div>
        <nav className="flex-1 p-2 space-y-2">
          {menus[userRole]?.map((menu) => (
            <a
              key={menu.name}
              href={menu.path}
              className="block p-2 rounded hover:bg-gray-700"
            >
              {menu.name}
            </a>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 p-2 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center px-6 fixed w-full ml-64 z-10">
          <h1 className="text-xl font-bold">Dashboard - {userRole}</h1>
        </header>

        {/* Content area */}
        <main className="flex-1 mt-16 p-6 overflow-y-auto bg-gray-100">
          {/* Replace this with dynamic content */}
          <Outlet />
          
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
