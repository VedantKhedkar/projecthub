import React, { useState, useEffect, useContext } from "react";
import { Clock, Loader, CheckCircle, DollarSign, FileText, Lock, RefreshCcw, FolderOpen } from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const MyCustomRequests = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch fresh data from DB
  const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/custom-requests/my', {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
      setLoading(false);
  };

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  // --- PDF RECEIPT GENERATOR ---
  const downloadReceipt = (req, type) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text(`PAYMENT RECEIPT: ${type === 'final' ? 'Final Balance' : 'Advance Payment'}`, 20, 20);
    
    // Details
    doc.setFontSize(12);
    doc.text(`Project Title: ${req.title}`, 20, 40);
    doc.text(`Transaction Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Amount Paid: Rs. ${(req.adminQuote / 2).toLocaleString()}`, 20, 60);
    doc.text(`Payment Status: Verified & Paid`, 20, 70);
    
    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for choosing ProjectHub.", 20, 100);

    doc.save(`${type}_receipt_${req._id}.pdf`);
  };

  const handlePayAdvance = (req) => {
    navigate("/checkout", { 
        state: { 
            projectId: req._id,
            title: `Advance for: ${req.title}`, 
            price: req.adminQuote / 2,
            type: "custom_advance" 
        } 
    });
  };

  const handlePayBalance = (req) => {
    navigate("/checkout", { 
        state: { 
            projectId: req._id,
            title: `Final Payment for: ${req.title}`, 
            price: req.adminQuote / 2,
            type: "custom_final" 
        } 
    });
  };

  if (loading && requests.length === 0) return <div className="flex justify-center py-20"><Loader className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">My Custom Projects</h1>
            <p className="text-gray-500 mt-1">Track status, pay quotes, and manage deliveries.</p>
        </div>
        <button 
            onClick={fetchRequests} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition"
        >
            <RefreshCcw size={16} /> Refresh Status
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        {requests.length > 0 ? (
          requests.map((req) => {
            // --- LOGIC: Calculation ---
            const totalCost = Number(req.adminQuote) || 0;
            const totalPaid = Number(req.paidAmount) || 0;
            const isFullyPaid = totalPaid >= totalCost && totalCost > 0;
            const displayProgress = req.status === "Completed" ? 100 : (req.progress || 0);

            return (
            <div key={req._id} className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden transition-all hover:shadow-xl">
              
              {/* Card Header */}
              <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900 text-lg">{req.title}</h3>
                    <span className="text-xs text-gray-400 font-mono">#{req._id.substr(-6)}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      req.status === "Completed" ? "bg-green-100 text-green-700" : 
                      req.status === "In Progress" ? "bg-purple-100 text-purple-700" :
                      "bg-blue-100 text-blue-700"
                  }`}>
                      {req.status}
                  </span>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column: Details */}
                  <div className="md:col-span-2 space-y-4">
                      <p className="text-gray-600 leading-relaxed">{req.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="block text-gray-400 text-xs font-bold uppercase">Budget</span>
                                <span className="font-semibold text-gray-800">₹{req.budget}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="block text-gray-400 text-xs font-bold uppercase">Deadine</span>
                                <span className="font-semibold text-gray-800">{req.deadline || "Flexible"}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-indigo-50">
                                <span className="block text-indigo-400 text-xs font-bold uppercase">Total Cost</span>
                                <span className="font-bold text-indigo-700 text-lg">
                                    {totalCost > 0 ? `₹${totalCost.toLocaleString()}` : "Pending Quote"}
                                </span>
                            </div>
                            <div className={`p-3 rounded-lg border ${isFullyPaid ? "bg-green-50 border-green-100" : "bg-orange-50 border-orange-100"}`}>
                                <span className={`block text-xs font-bold uppercase ${isFullyPaid ? "text-green-600" : "text-orange-500"}`}>Amount Paid</span>
                                <span className={`font-bold text-lg ${isFullyPaid ? "text-green-700" : "text-orange-600"}`}>
                                    ₹{totalPaid.toLocaleString()}
                                </span>
                            </div>
                      </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="md:col-span-1 border-l border-gray-100 pl-8 flex flex-col justify-center">
                    
                    {/* SCENARIO 1: PENDING */}
                    {req.status === "Pending" && (
                        <div className="text-center text-gray-500">
                            <Clock className="mx-auto mb-2 text-yellow-500" size={32}/> 
                            <p>Waiting for Admin Quote</p>
                        </div>
                    )}

                    {/* SCENARIO 2: QUOTE SENT */}
                    {req.status === "Quote Sent" && (
                        <div className="text-center space-y-3">
                            <DollarSign className="mx-auto text-blue-500" size={32} />
                            <p className="font-bold text-lg">Quote Received!</p>
                            <button onClick={() => handlePayAdvance(req)} className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition">
                                Pay Advance (50%)
                            </button>
                        </div>
                    )}

                    {/* SCENARIO 3: IN PROGRESS */}
                    {req.status === "In Progress" && (
                        <div className="text-center space-y-4">
                             <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${displayProgress}%` }}></div>
                            </div>
                            <p className="text-xs font-bold text-purple-700">{displayProgress}% Complete</p>
                            
                            <button onClick={() => downloadReceipt(req, 'advance')} className="text-xs flex items-center justify-center gap-2 w-full py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600">
                                <FileText size={12}/> Download Advance Receipt
                            </button>
                        </div>
                    )}

                    {/* SCENARIO 4: COMPLETED */}
                    {req.status === "Completed" && (
                        <div className="text-center space-y-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                            </div>
                            <p className="text-xs font-bold text-green-600">100% Complete</p>

                            {!isFullyPaid ? (
                                <div className="bg-white p-4 rounded-xl border-2 border-orange-100 shadow-sm">
                                    <p className="text-xs font-bold text-orange-600 uppercase mb-1">Project Ready</p>
                                    <p className="text-sm font-bold text-gray-900 mb-3">Balance Due: ₹{(totalCost / 2).toLocaleString()}</p>
                                    <button 
                                        onClick={() => handlePayBalance(req)}
                                        className="w-full py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 shadow-md"
                                    >
                                        <Lock size={14} /> Pay Balance & Unlock
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="bg-green-50 p-2 rounded-lg text-green-700 text-xs font-bold flex items-center justify-center gap-2 border border-green-100">
                                        <CheckCircle size={14}/> Paid in Full
                                    </div>
                                    
                                    {/* --- REDIRECT BUTTON (Redirects to My Files for download) --- */}
                                    <button 
                                        onClick={() => navigate('/my-files')} 
                                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition transform hover:-translate-y-1"
                                    >
                                        <FolderOpen size={18} /> Go to My Files
                                    </button>
                                    
                                    <button onClick={() => downloadReceipt(req, 'final')} className="text-xs text-gray-400 hover:text-gray-600 underline">
                                        Download Final Receipt
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                  </div>
              </div>
            </div>
          );
        })
        ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No projects yet.</p>
                <button onClick={() => navigate('/request-custom')} className="mt-4 text-primary font-bold hover:underline">
                    Start your first project
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default MyCustomRequests;