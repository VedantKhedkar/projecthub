import React, { useState, useEffect, useContext } from "react";
import { Users, ShoppingBag, DollarSign, TrendingUp, Package, Loader } from "lucide-react";
import AuthContext from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    userCount: 0,
    orderCount: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/users/admin/stats", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (error) {
        console.error("Admin stats error:", error);
      }
      setLoading(false);
    };

    if (user && user.isAdmin) fetchStats();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total revenue */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">₹{stats.totalRevenue}</h3>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        {/* Total sales */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Total Sales</p>
              <h3 className="text-2xl font-bold">{stats.orderCount}</h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <ShoppingBag size={24} />
            </div>
          </div>
        </div>

        {/* Total users */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.userCount}</h3>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* Growth */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Growth</p>
              <h3 className="text-2xl font-bold">+12%</h3>
            </div>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow border">
        <div className="p-6 border-b">
          <h2 className="font-bold text-gray-900">Recent Transactions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4">Project</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length ? (
                stats.recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="p-4">{o.project?.title || "Deleted Project"}</td>
                    <td className="p-4">{o.user?.name}</td>
                    <td className="p-4">₹{o.amount}</td>
                    <td className="p-4">{o.status}</td>
                    <td className="p-4">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-8 text-center" colSpan="5">
                    No Transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
