import React, { useState, useContext } from "react";
import { Send, Code2, DollarSign, FileText, Calendar, Server, Layers, Paperclip } from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RequestCustom = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State for ALL fields matching your schema
  const [formData, setFormData] = useState({
    title: "",
    category: "Web Development",
    budget: "",
    deadline: "",
    techStack: "",
    hosting: "No",
    description: "",
    extraFeatures: "",
    attachments: "" 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setLoading(true);

    try {
        console.log("🚀 Submitting Request...", formData);
        
        const res = await fetch('/api/custom-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
            // Success!
            alert("✅ Request Sent Successfully!");
            
            // FORCE REDIRECT (Fixes the stuck page issue)
            window.location.href = "/my-custom-requests"; 
        } else {
            // Error from Server
            console.error("Server Error:", data);
            alert(`❌ Failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("❌ Network Error. Check console.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Request Custom Project</h1>
        <p className="text-gray-500 mt-2">
          Fill in the details below to get a quote for your custom build.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
        
        {/* --- SECTION 1: PROJECT DETAILS --- */}
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <Layers className="text-primary" size={20} /> 1. Project Overview
            </h3>

            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Project Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. E-Commerce App"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Category
                    </label>
                    <select
                        name="category"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option>Web Development</option>
                        <option>Mobile App (Android/iOS)</option>
                        <option>Desktop Software</option>
                        <option>AI/ML Model</option>
                        <option>Blockchain/Web3</option>
                    </select>
                </div>
            </div>
        </div>

        {/* --- SECTION 2: TECHNICAL DETAILS --- */}
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <Code2 className="text-primary" size={20} /> 2. Technical Details
            </h3>

            {/* Tech Stack & Hosting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Preferred Tech Stack
                    </label>
                    <input
                        type="text"
                        name="techStack"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. React, Node.js"
                        value={formData.techStack}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Need Hosting/Deployment?
                    </label>
                    <select
                        name="hosting"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.hosting}
                        onChange={handleChange}
                    >
                        <option>No, I have my own.</option>
                        <option>Yes, Standard Hosting</option>
                        <option>Yes, Cloud Setup (AWS/GCP)</option>
                    </select>
                </div>
            </div>

            {/* Extra Features */}
             <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Extra Integrations (Payment Gateways, SMS, Maps)
                </label>
                <input
                    type="text"
                    name="extraFeatures"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. Stripe, Google Maps, Twilio"
                    value={formData.extraFeatures}
                    onChange={handleChange}
                />
            </div>
        </div>

        {/* --- SECTION 3: BUDGET & DEADLINE --- */}
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <DollarSign className="text-primary" size={20} /> 3. Budget & Timeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Estimated Budget (₹) *
                    </label>
                    <input 
                        type="text"
                        name="budget"
                        required
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. 15000"
                        value={formData.budget}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Target Deadline
                    </label>
                    <input
                        type="date"
                        name="deadline"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.deadline}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>

        {/* --- SECTION 4: DESCRIPTION --- */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FileText size={16} /> Detailed Requirements *
          </label>
          <textarea
            name="description"
            required
            rows="5"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            placeholder="Describe features, pages, and flow..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
        >
          {loading ? "Submitting..." : <><Send size={18} /> Submit Request</>}
        </button>

      </form>
    </div>
  );
};

export default RequestCustom;