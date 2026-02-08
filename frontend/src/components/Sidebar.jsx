import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Info,
  Code2,
  FileCode,
  Hammer,
  LogOut,
  UserCheck,
  CreditCard,
  PlusSquare,
  LogIn,
  ClipboardList
} from "lucide-react";
import AuthContext from "../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const userRole = !user ? "guest" : user.isAdmin ? "admin" : "user";

  const menus = {
    guest: [
      { name: "Home", path: "/", icon: <Home size={20} /> },
      { name: "About Us", path: "/about", icon: <Info size={20} /> },
      { name: "Login / Register", path: "/login", icon: <LogIn size={20} /> },
    ],

    user: [
      { name: "Home", path: "/", icon: <Home size={20} /> },
      { name: "Build Custom Project", path: "/request-custom", icon: <Code2 size={20} /> },
      { name: "My Custom Projects", path: "/my-custom-requests", icon: <Hammer size={20} /> },
      { name: "My Project Files", path: "/my-files", icon: <FileCode size={20} /> },
    ],

    admin: [
      { name: "Home", path: "/", icon: <Home size={20} /> },
      { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={20} /> },
      { name: "User Approvals", path: "/admin/approvals", icon: <UserCheck size={20} /> },
      { name: "Custom Requests", path: "/admin/requests", icon: <ClipboardList size={20} /> },
      { name: "Add Prebuilt Project", path: "/admin/add-project", icon: <PlusSquare size={20} /> },
      { name: "Payment Logs", path: "/admin/payments", icon: <CreditCard size={20} /> },
    ]
  }[userRole];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && window.innerWidth < 768 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isOpen ? "260px" : "80px",
          x: window.innerWidth < 768 ? (isOpen ? 0 : "-100%") : 0
        }}
        transition={{ type: "spring", damping: 20, stiffness: 180 }}
        className="h-screen bg-[#0B0F1A] text-white fixed top-0 left-0 z-50 flex flex-col justify-between shadow-xl"
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="min-w-[40px] h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl">
            P
          </div>

          {isOpen && (
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-black text-xl"
            >
              Project<span className="text-primary">Hub</span>
            </motion.h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-6">
          {menus.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link to={item.path} key={item.name}>
                <div
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    active
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}

                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-semibold text-sm"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-white/10">
          {user && (
            <>
              {isOpen && (
                <div className="flex items-center gap-3 p-3 mb-2 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.isAdmin ? "Admin" : "User"}</p>
                  </div>
                </div>
              )}

              <button
                onClick={logout}
                className={`w-full p-3 flex items-center gap-3 text-red-400 font-bold rounded-xl hover:bg-red-500/10 ${
                  !isOpen && "justify-center"
                }`}
              >
                <LogOut size={18} />
                {isOpen && "Logout"}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
