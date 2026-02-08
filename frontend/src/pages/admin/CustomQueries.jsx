import React, { useState } from "react";
import { Eye, Download, CheckCircle, Clock, X, DollarSign, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data for Requests
const MOCK_QUERIES = [
  {
    id: 101,
    user: "John Doe",
    title: "Food Delivery App",
    category: "MERN Stack",
    budget: "₹45,000",
    status: "Pending", // Options: Pending, Payment Pending, In Progress, Completed
    date: "2024-03-10",
    description: "I need a Zomato clone with a driver app and admin panel.",
    techStack: "React Native, Node.js",
    hosting: "Yes",
  },
  {
    id: 102,
    user: "Sarah Smith",
    title: "Portfolio Website",
    category: "Frontend",
    budget: "₹5,000",
    status: "In Progress",
    date: "2024-03-08",
    description: "A clean 3D portfolio using Three.js.",
    techStack: "React, Three.js, Tailwind",
    hosting: "No",
  },
];

const CustomQueries = () => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [estimate, setEstimate] = useState("");

  const handleDownloadPDF = () => {
    alert(`Downloading PDF for Request #${selectedQuery.id}...`);
  };

  const handleSendQuote = () => {
    alert(`Quote of ₹${estimate} sent to ${selectedQuery.user}. Status updated to 'Payment Pending'.`);
    setSelectedQuery(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Custom Project Requests</h1>
        <p className="text-gray-500 mt-1">Manage incoming requirements and send estimates.</p>
      </div>

      {/* Queries Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">ID</th>
                <th className="p-4 font-semibold text-gray-600">Client</th>
                <th className="p-4 font-semibold text-gray-600">Project</th>
                <th className="p-4 font-semibold text-gray-600">Budget</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_QUERIES.map((query) => (
                <tr key={query.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">#{query.id}</td>
                  <td className="p-4">{query.user}</td>
                  <td className="p-4">{query.title}</td>
                  <td className="p-4 text-green-600 font-medium">{query.budget}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        query.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : query.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {query.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{query.date}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedQuery(query)}
                      className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedQuery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
                  <p className="text-sm text-gray-500">ID: #{selectedQuery.id} • {selectedQuery.date}</p>
                </div>
                <button
                  onClick={() => setSelectedQuery(null)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* User Info Grid */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Client Name</p>
                        <p className="font-semibold">{selectedQuery.user}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Category</p>
                        <p className="font-semibold">{selectedQuery.category}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Client Budget</p>
                        <p className="font-semibold text-green-600">{selectedQuery.budget}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Hosting Needed</p>
                        <p className="font-semibold">{selectedQuery.hosting}</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed bg-white border border-gray-100 p-4 rounded-xl">
                        {selectedQuery.description}
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 mb-2">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedQuery.techStack.split(",").map((tech, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                {tech.trim()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Admin Actions Area */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <CheckCircle size={20} className="text-primary" /> Admin Actions
                    </h3>
                    
                    <button 
                        onClick={handleDownloadPDF}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                        <Download size={18} /> Download Details as PDF
                    </button>

                    {selectedQuery.status === "Pending" && (
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                            <label className="block text-sm font-bold text-primary mb-2">
                                Set Final Cost & Request Payment
                            </label>
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="number" 
                                        placeholder="Enter Amount (e.g. 50000)" 
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                                        value={estimate}
                                        onChange={(e) => setEstimate(e.target.value)}
                                    />
                                </div>
                                <button 
                                    onClick={handleSendQuote}
                                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors"
                                >
                                    Send Quote
                                </button>
                            </div>
                        </div>
                    )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomQueries;