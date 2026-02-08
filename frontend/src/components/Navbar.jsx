import React, { useContext, useEffect, useState, useRef } from "react";
import { Search, Mail, PlayCircle, Bell, User, Menu, X, LogOut, Settings, Package } from "lucide-react";
import AuthContext from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const { query, setQuery } = useContext(SearchContext);
  const navigate = useNavigate();
  const location = useLocation();

  // API base URL - adjust this based on your backend URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ------------------- Notifications -------------------
  const [notifications, setNotifications] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [loading, setLoading] = useState(false);

  // ------------------- Profile Dropdown -------------------
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const notiRef = useRef(null);

  // Close ALL dropdowns if clicking outside
  useEffect(() => {
    function handleClick(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Search Handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (location.pathname !== "/") navigate("/");
  };

  // Contact Section
  const goToContactSection = () => {
    navigate("/about#contact");
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  // Fetch Notifications
  const fetchNotifications = async () => {
    if (!user || !user.token) return;
    
    setLoading(true);
    try {
      const endpoint = user.isAdmin 
        ? `${API_BASE_URL}/notifications/admin`
        : `${API_BASE_URL}/notifications`;
      
      const res = await fetch(endpoint, {
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      // Handle both array response and object with success field
      const notificationList = Array.isArray(data) ? data : (data.data || data.notifications || []);
      
      setNotifications(notificationList);
      
      // Check if there are any unread notifications
      const unreadExists = notificationList.some((n) => !n.isRead);
      setHasUnread(unreadExists);
      
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // If API fails, use mock data for demo
      setNotifications(getMockNotifications());
      setHasUnread(true); // Show indicator for demo
    } finally {
      setLoading(false);
    }
  };

  // Get mock notifications for demo
  const getMockNotifications = () => {
    return [
      {
        _id: '1',
        message: 'Welcome to ProjectHub! Start exploring our projects.',
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        message: 'New project added: E-commerce Platform',
        type: 'project',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        _id: '3',
        message: 'Payment completed successfully for Portfolio Website',
        type: 'payment',
        isRead: true,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setHasUnread(false);
      return;
    }

    fetchNotifications();
    
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Mark notification as read
  const markAsRead = async (id) => {
    if (!user || !user.token) return;
    
    try {
      // Update UI immediately
      setNotifications(prev => 
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );

      // Try to update on server
      const response = await fetch(`${API_BASE_URL}/notifications/read/${id}`, {
        method: "PUT",
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok && response.status !== 404) {
        console.warn('Could not mark notification as read on server');
      }

      // Recalculate hasUnread
      const updatedHasUnread = notifications.some(n => 
        n._id !== id && !n.isRead
      );
      setHasUnread(updatedHasUnread);

    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark All as Read
  const markAllRead = async () => {
    if (!user || !user.token) return;
    
    try {
      // Update UI immediately
      setNotifications(prev => 
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setHasUnread(false);

      // Try to update on server
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PUT",
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok && response.status !== 404) {
        console.warn('Could not mark all notifications as read on server');
      }

      // Close dropdown after a delay
      setTimeout(() => setDropdown(false), 500);
      
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors hover:shadow-sm"
          >
            <Menu size={22} />
          </button>

          {/* SEARCH BAR */}
          <div className="relative w-full max-w-md hidden sm:block group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />

            <input
              type="text"
              placeholder="Search projects by name, tech stack, or category..."
              className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-300
              rounded-xl focus:ring-3 focus:ring-primary/20 focus:border-primary transition-all 
              text-sm placeholder-gray-400 shadow-sm"
              value={query}
              onChange={handleSearchChange}
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* Demo Button */}
          <button
            onClick={() => navigate("/demo")}
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-primary 
            font-semibold text-sm hover:bg-gray-100 rounded-xl transition-colors"
          >
            <PlayCircle size={18} />
            Watch Demo
          </button>

          {/* Contact */}
          <button
            onClick={goToContactSection}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-indigo-600 
            text-white rounded-xl font-semibold text-sm hover:from-primary/90 hover:to-indigo-600/90 
            shadow-md hover:shadow-lg transition-all"
          >
            <Mail size={16} />
            <span className="hidden md:inline">Contact</span>
          </button>

          <div className="hidden md:block w-[1px] h-8 bg-gray-300"></div>

          {/* NOTIFICATIONS */}
          <div className="relative" ref={notiRef}>
            <button
              onClick={() => setDropdown(!dropdown)}
              className="p-2.5 text-gray-600 hover:text-primary hover:bg-gray-100 
              rounded-xl transition-colors relative group"
              disabled={loading}
            >
              <Bell size={20} />
              {hasUnread && unreadCount > 0 && (
                <>
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs 
                  rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </>
              )}
              {loading && (
                <span className="absolute -top-1 -right-1 w-5 h-5 border-2 border-primary border-t-transparent 
                rounded-full animate-spin"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {dropdown && (
              <div className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-2xl p-4 border border-gray-200 z-50 
              animate-in slide-in-from-top-5 duration-200">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                  </div>
                  {hasUnread && (
                    <button
                      onClick={markAllRead}
                      className="text-sm text-primary font-semibold hover:text-primary/80 
                      hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto pr-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell size={40} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No notifications yet</p>
                      <p className="text-sm text-gray-400 mt-1">We'll notify you when something arrives</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => markAsRead(n._id)}
                          className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md
                            ${!n.isRead 
                              ? "bg-gradient-to-r from-primary/5 to-blue-50 border-l-4 border-primary" 
                              : "hover:bg-gray-50"
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0
                              ${!n.isRead ? "bg-primary" : "bg-gray-300"}`}></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800 font-medium">{n.message}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">
                                  {new Date(n.createdAt).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                                {n.type && (
                                  <span className={`text-xs px-2 py-1 rounded-full
                                    ${n.type === 'payment' ? 'bg-green-100 text-green-800' :
                                      n.type === 'project' ? 'bg-blue-100 text-blue-800' :
                                      n.type === 'admin' ? 'bg-purple-100 text-purple-800' :
                                      'bg-gray-100 text-gray-800'}`}>
                                    {n.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setDropdown(false);
                      navigate("/notifications");
                    }}
                    className="w-full text-center text-sm text-primary font-medium hover:text-primary/80 
                    hover:bg-gray-50 py-2 rounded-lg transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-600
              flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl 
              hover:scale-105 transition-all"
            >
              {user?.name?.charAt(0).toUpperCase() || <User size={18} />}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-2xl rounded-2xl border border-gray-200 z-50 
              animate-in slide-in-from-top-5 duration-200 py-3">
                
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-gray-900 text-lg">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                      ${user?.isAdmin 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-primary/10 text-primary'}`}>
                      {user?.isAdmin ? '⚡ Admin' : '👤 User'}
                    </span>
                  </div>
                </div>

                {/* Profile Options */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 
                    transition-colors text-sm font-medium"
                  >
                    <User size={18} className="text-gray-500" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/my-projects");
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 
                    transition-colors text-sm font-medium"
                  >
                    <Package size={18} className="text-gray-500" />
                    My Projects
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/settings");
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 
                    transition-colors text-sm font-medium"
                  >
                    <Settings size={18} className="text-gray-500" />
                    Settings
                  </button>

                  {user?.isAdmin && (
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/admin/dashboard");
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-yellow-700 hover:bg-yellow-50 
                      transition-colors text-sm font-medium"
                    >
                      🚀 Admin Dashboard
                    </button>
                  )}

                  <div className="border-t border-gray-100 my-2"></div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 
                    transition-colors text-sm font-semibold"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;