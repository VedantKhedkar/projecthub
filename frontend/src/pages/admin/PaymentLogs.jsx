import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Loader, CreditCard, Search, Filter, ArrowUpDown } from "lucide-react";

const PaymentLogs = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-desc"); // Default: Newest First

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('/api/payment/all', {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        setPayments(data);
        setFilteredPayments(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    if (user && user.isAdmin) fetchPayments();
  }, [user]);

  // --- HANDLE SEARCH & SORT ---
  useEffect(() => {
    let result = [...payments];

    // 1. Search Logic
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(pay => 
        (pay.user?.name || "").toLowerCase().includes(lowerTerm) ||
        (pay.projectName || "").toLowerCase().includes(lowerTerm) ||
        (pay.razorpay_payment_id || "").toLowerCase().includes(lowerTerm)
      );
    }

    // 2. Sort Logic
    switch (sortOption) {
        case "date-desc":
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case "date-asc":
            result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case "amount-desc":
            result.sort((a, b) => (b.amount || 0) - (a.amount || 0));
            break;
        case "amount-asc":
            result.sort((a, b) => (a.amount || 0) - (b.amount || 0));
            break;
        default:
            break;
    }

    setFilteredPayments(result);
  }, [searchTerm, sortOption, payments]);

  if (loading) return <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="text-primary" /> Payment History
        </h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all transaction records.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        
        {/* Search Input */}
        <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search by Name, Project, or Payment ID..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 min-w-[200px]">
            <ArrowUpDown size={18} className="text-gray-500" />
            <select 
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
            >
                <option value="date-desc">Date: Newest First</option>
                <option value="date-asc">Date: Oldest First</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
            </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-gray-500 text-xs uppercase font-bold">
                <tr>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">User Details</th>
                    <th className="p-4">Project Name</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment ID</th>
                    <th className="p-4">Type</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {filteredPayments.length > 0 ? filteredPayments.map(pay => (
                    <tr key={pay._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                            <p className="font-bold text-gray-900">{new Date(pay.createdAt).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500">{new Date(pay.createdAt).toLocaleTimeString()}</p>
                        </td>
                        <td className="p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                                    {pay.user?.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-xs">{pay.user?.name || "Unknown"}</p>
                                    <p className="text-[10px] text-gray-500">{pay.user?.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-4 font-medium text-indigo-600">
                            {pay.projectName || "N/A"}
                        </td>
                        <td className="p-4 font-bold text-green-600">
                            ₹{pay.amount ? pay.amount.toLocaleString() : "0"}
                        </td>
                        <td className="p-4">
                            <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded select-all border border-gray-200">
                                {pay.razorpay_payment_id}
                            </span>
                        </td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                pay.type === 'prebuilt' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {pay.type === 'prebuilt' ? 'Purchase' : 'Advance'}
                            </span>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="6" className="p-10 text-center text-gray-500">
                            <Filter className="mx-auto mb-2 text-gray-300" size={32} />
                            <p>No payments match your search.</p>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
      
      {/* Footer Stat */}
      <div className="text-right text-xs text-gray-400">
        Showing {filteredPayments.length} records
      </div>
    </div>
  );
};

export default PaymentLogs;