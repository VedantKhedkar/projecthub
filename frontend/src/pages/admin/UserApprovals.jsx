import React, { useState, useEffect, useContext } from "react";
import { UserCheck, UserX, Loader, Search, CheckCircle, ShieldAlert } from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const UserApprovals = () => {
  const { user } = useContext(AuthContext);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ================================
  // FETCH ALL USERS (ADMIN)
  // ================================
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const res = await fetch("/api/users/admin/users", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const data = await res.json();

        // Filter ONLY pending users
        const unapproved = data.filter((u) => !u.isApproved);

        setPendingUsers(unapproved);
      } catch (error) {
        console.error("Error fetching pending users:", error);
      }
      setLoading(false);
    };

    if (user) fetchPendingUsers();
  }, [user]);

  // ================================
  // APPROVE USER
  // ================================
  const approveUser = async (userId) => {
  try {
    const res = await fetch(`/api/users/admin/approve/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (res.ok) {
      setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
    }
  } catch (err) {
    console.error("Error approving user:", err);
  }
};


  // ================================
  // (OPTIONAL) REJECT USER: You don't have backend route
  // ================================
  const rejectUser = async (userId) => {
  try {
    const res = await fetch(`/api/users/admin/reject/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (res.ok) {
      // Remove from UI
      setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
    }
  } catch (err) {
    console.error("Error rejecting user:", err);
  }
};


  const filteredUsers = pendingUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* HEADER */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <UserCheck className="text-primary" size={32} /> User Approvals
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Manage pending registrations and access requests.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* USER LIST */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((pUser) => (
              <motion.div
                key={pUser._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                    {pUser.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-gray-900 text-lg truncate">{pUser.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{pUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-md border border-amber-100">
                        Pending Approval
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => approveUser(pUser._id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-primary/20"
                  >
                    <UserCheck size={18} /> Approve
                  </button>

                  {/* Reject button (no backend) */}
                  <button
                    onClick={() => rejectUser(pUser._id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-red-500 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-50 transition-all"
                  >
                    <UserX size={18} /> Reject
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200"
            >
              <CheckCircle className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-bold">No pending approvals at the moment.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECURITY NOTICE */}
      <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-4">
        <ShieldAlert className="text-indigo-600 shrink-0" size={24} />
        <div className="text-sm text-indigo-900/70 leading-relaxed">
          <p className="font-bold text-indigo-900">Security Recommendation:</p>
          Verify the user's email before granting access.
        </div>
      </div>
    </div>
  );
};

export default UserApprovals;
