import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Loader, RefreshCcw, Download, Upload, CheckCircle, X, DollarSign, Send, FileCode, Video, Package } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminCustomRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track uploading state per file type per request
  // Format: { "reqId_type": true } (e.g., "123_video": true)
  const [uploadingState, setUploadingState] = useState({});

  // --- STATE FOR QUOTE MODAL ---
  const [selectedReq, setSelectedReq] = useState(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  // --- 1. FETCH REQUESTS ---
  const fetchAdminRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/custom-requests/admin/all', {
          headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && user.isAdmin) fetchAdminRequests();
  }, [user]);

  // --- 2. SEND QUOTE FUNCTION ---
  const sendQuote = async () => {
    if (!quoteAmount || isNaN(quoteAmount)) return alert("Please enter a valid amount");
    setProcessing(true);

    try {
        const res = await fetch(`/api/custom-requests/${selectedReq._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
                adminQuote: Number(quoteAmount),
                status: "Quote Sent" 
            })
        });

        if (res.ok) {
            alert("✅ Quote Sent!");
            setSelectedReq(null);
            setQuoteAmount("");
            fetchAdminRequests();
        } else {
            alert("Failed to update request");
        }
    } catch (error) {
        alert("Server Error");
    }
    setProcessing(false);
  };

  // --- 3. UPDATE STATUS FUNCTION ---
  const handleStatusChange = async (reqId, newStatus) => {
    try {
        const body = { status: newStatus };
        // If marking as completed, imply 100% progress
        if (newStatus === "Completed") body.progress = 100;

        const res = await fetch(`/api/custom-requests/${reqId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(body)
        });

        if(res.ok) {
            fetchAdminRequests();
        } else {
            alert("Failed to update status");
        }
    } catch (error) {
        console.error(error);
    }
  };

  // --- 4. FILE UPLOAD FUNCTION (Handles Code, Video, Assets) ---
  const handleFileUpload = async (reqId, file, type) => {
    if (!file) return;
    
    // Set specific loader active
    const key = `${reqId}_${type}`;
    setUploadingState(prev => ({ ...prev, [key]: true }));

    const formData = new FormData();
    // Field name must match backend config (projectCode, video, or assets)
    formData.append(type, file); 

    try {
        const res = await fetch(`/api/custom-requests/${reqId}/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${user.token}` },
            body: formData
        });
        
        const data = await res.json();

        if (res.ok) {
            alert(`✅ ${type} Uploaded Successfully!`);
            fetchAdminRequests(); // Refresh to show success state
        } else {
            alert("❌ Upload Failed: " + data.message);
        }
    } catch (error) {
        console.error("Upload Error:", error);
        alert("Server Error during upload.");
    }
    
    // Turn off loader
    setUploadingState(prev => ({ ...prev, [key]: false }));
  };

  // --- 5. PDF EXPORT ---
  const exportToPDF = (req) => {
    const doc = new jsPDF();
    doc.text("ProjectHub Request", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Details']],
      body: [
        ['Client', req.user?.name],
        ['Email', req.user?.email],
        ['Project', req.title],
        ['Category', req.category],
        ['Budget', req.budget],
        ['Tech Stack', req.techStack],
        ['Description', req.description],
        ['Status', req.status],
      ],
    });
    doc.save(`Request_${req._id}.pdf`);
  };

  if (loading) return <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Incoming Requests & Projects</h1>
            <p className="text-gray-500 text-sm">Manage quotes, update status, and upload project deliverables.</p>
        </div>
        <button onClick={fetchAdminRequests} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
            <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-gray-500 text-xs uppercase font-bold">
                <tr>
                    <th className="p-4">Client / Project</th>
                    <th className="p-4">Financials</th>
                    <th className="p-4 w-1/4">Status</th>
                    <th className="p-4 w-1/3 text-center">Deliverables</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {requests.map(req => (
                    <tr key={req._id} className="hover:bg-gray-50">
                        
                        {/* 1. Client & Project Info */}
                        <td className="p-4 align-top">
                            <p className="font-bold text-gray-900">{req.title}</p>
                            <p className="text-xs text-gray-500 mb-1">User: {req.user?.name}</p>
                            <p className="text-[10px] text-gray-400 truncate w-32">{req.category}</p>
                        </td>

                        {/* 2. Financials */}
                        <td className="p-4 align-top">
                            <p className="text-xs text-gray-500">User Budget: ₹{req.budget}</p>
                            {req.adminQuote ? (
                                <div className="mt-1">
                                    <p className="font-bold text-indigo-600">Quote: ₹{req.adminQuote}</p>
                                    <div className="text-[10px] mt-1">
                                        {req.paidAmount ? (
                                            <span className="text-green-600 font-bold bg-green-50 px-1 py-0.5 rounded flex items-center gap-1 w-fit">
                                                <CheckCircle size={10} /> Paid: ₹{req.paidAmount}
                                            </span>
                                        ) : (
                                            <span className="text-orange-500 bg-orange-50 px-1 py-0.5 rounded">Unpaid</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 mt-2">
                                     <span className="text-xs text-gray-400 italic block mb-1">No quote sent</span>
                                     <button 
                                        onClick={() => { setSelectedReq(req); setQuoteAmount(""); }}
                                        className="px-3 py-1 bg-primary text-white text-xs font-bold rounded hover:bg-indigo-700"
                                    >
                                        Send Quote
                                    </button>
                                </div>
                            )}
                             <button onClick={() => exportToPDF(req)} className="mt-2 p-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-600" title="Download PDF">
                                <Download size={14} />
                            </button>
                        </td>

                        {/* 3. Status Dropdown */}
                        <td className="p-4 align-top">
                            <select 
                                value={req.status} 
                                onChange={(e) => handleStatusChange(req._id, e.target.value)}
                                className={`w-full p-2 rounded-lg border text-xs font-bold uppercase cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none ${
                                    req.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                    req.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                    req.status === 'Quote Sent' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Quote Sent">Quote Sent</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </td>

                        {/* 4. Deliverables (3 Upload Buttons) */}
                        <td className="p-4 align-top space-y-2">
                            {(req.status === 'Completed' || req.status === 'In Progress') ? (
                                <>
                                    {/* 1. CODE UPLOAD */}
                                    <label className={`flex items-center justify-between px-3 py-2 border rounded-lg cursor-pointer hover:bg-blue-50 transition ${req.finalProjectCode ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                            {uploadingState[`${req._id}_projectCode`] ? <Loader size={14} className="animate-spin text-blue-500"/> : <FileCode size={14} className="text-blue-500"/>}
                                            {uploadingState[`${req._id}_projectCode`] ? "Uploading..." : "Project Code"}
                                        </div>
                                        {req.finalProjectCode ? <CheckCircle size={14} className="text-green-600"/> : <Upload size={14} className="text-gray-400"/>}
                                        <input 
                                            type="file" className="hidden" 
                                            disabled={uploadingState[`${req._id}_projectCode`]}
                                            onChange={(e) => handleFileUpload(req._id, e.target.files[0], 'projectCode')} 
                                        />
                                    </label>

                                    {/* 2. VIDEO UPLOAD */}
                                    <label className={`flex items-center justify-between px-3 py-2 border rounded-lg cursor-pointer hover:bg-purple-50 transition ${req.finalVideo ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                            {uploadingState[`${req._id}_video`] ? <Loader size={14} className="animate-spin text-purple-500"/> : <Video size={14} className="text-purple-500"/>}
                                            {uploadingState[`${req._id}_video`] ? "Uploading..." : "Setup Video"}
                                        </div>
                                        {req.finalVideo ? <CheckCircle size={14} className="text-green-600"/> : <Upload size={14} className="text-gray-400"/>}
                                        <input 
                                            type="file" className="hidden" 
                                            disabled={uploadingState[`${req._id}_video`]}
                                            onChange={(e) => handleFileUpload(req._id, e.target.files[0], 'video')} 
                                        />
                                    </label>

                                    {/* 3. ASSETS UPLOAD */}
                                    <label className={`flex items-center justify-between px-3 py-2 border rounded-lg cursor-pointer hover:bg-orange-50 transition ${req.finalAssets ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                            {uploadingState[`${req._id}_assets`] ? <Loader size={14} className="animate-spin text-orange-500"/> : <Package size={14} className="text-orange-500"/>}
                                            {uploadingState[`${req._id}_assets`] ? "Uploading..." : "Assets / DB"}
                                        </div>
                                        {req.finalAssets ? <CheckCircle size={14} className="text-green-600"/> : <Upload size={14} className="text-gray-400"/>}
                                        <input 
                                            type="file" className="hidden" 
                                            disabled={uploadingState[`${req._id}_assets`]}
                                            onChange={(e) => handleFileUpload(req._id, e.target.files[0], 'assets')} 
                                        />
                                    </label>
                                </>
                            ) : (
                                <p className="text-xs text-gray-400 text-center italic mt-2">
                                    Set status to "In Progress"<br/>to enable uploads.
                                </p>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* --- QUOTE MODAL --- */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg">Send Project Quote</h3>
                    <button onClick={() => setSelectedReq(null)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-sm text-blue-600 font-bold mb-1">Project: {selectedReq.title}</p>
                        <p className="text-xs text-gray-600">User's Estimated Budget: <span className="font-mono">₹{selectedReq.budget}</span></p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Total Project Cost (₹)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="number" 
                                className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-primary"
                                placeholder="e.g. 15000"
                                value={quoteAmount}
                                onChange={(e) => setQuoteAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    {quoteAmount > 0 && (
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <div className="flex justify-between items-center text-green-800">
                                <span className="text-sm font-bold">50% Advance Payment:</span>
                                <span className="text-xl font-bold">₹{(quoteAmount / 2).toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button onClick={() => setSelectedReq(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium">Cancel</button>
                    <button 
                        onClick={sendQuote} 
                        disabled={processing}
                        className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2"
                    >
                        {processing ? "Sending..." : <><Send size={16} /> Send Quote</>}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminCustomRequests;