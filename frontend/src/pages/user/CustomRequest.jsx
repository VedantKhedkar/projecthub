import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Calendar, DollarSign, Code, Upload, Server, FileText } from "lucide-react";
import { CATEGORIES } from "../../data/projects";

const CustomRequest = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "Full Stack",
    description: "",
    techStack: "",
    hosting: "no",
    extraFeatures: "",
    budget: "",
    deadline: "",
    attachments: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: e.target.files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Custom Request Data:", formData);
    alert("Request Sent! Status: Pending Admin Review.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Build Your Dream Project</h1>
        <p className="text-gray-500 mt-2">
          Fill out the details below. We will review your requirements and provide a cost estimate within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Project Basics */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative z-10"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <FileText size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">1. Project Basics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-semibold text-gray-700 text-sm">Project Name</label>
              <input
                type="text"
                name="title"
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                placeholder="e.g. My Startup App"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="font-semibold text-gray-700 text-sm">Category</label>
              <select
                name="category"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                onChange={handleChange}
              >
                 {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="col-span-full space-y-2">
              <label className="font-semibold text-gray-700 text-sm">Detailed Description</label>
              <textarea
                name="description"
                required
                rows="4"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                placeholder="Describe features, pages, user flow, and overall goal..."
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </motion.div>

        {/* SECTION 2: Technical Requirements */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative z-10"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                <Code size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">2. Technical Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="font-semibold text-gray-700 text-sm">Preferred Tech Stack</label>
                <input
                    type="text"
                    name="techStack"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all"
                    placeholder="e.g. React, Node, AWS (Optional)"
                    onChange={handleChange}
                />
            </div>
            <div className="space-y-2">
                <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                    <Server size={14} /> Need Hosting/Domain Setup?
                </label>
                <select
                    name="hosting"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all bg-white"
                    onChange={handleChange}
                >
                    <option value="no">No, I have my own.</option>
                    <option value="yes">Yes, please handle it.</option>
                </select>
            </div>
            <div className="col-span-full space-y-2">
                <label className="font-semibold text-gray-700 text-sm">Extra Integrations (Payment Gateways, SMS, Maps)</label>
                <input
                    type="text"
                    name="extraFeatures"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all"
                    placeholder="e.g. Razorpay, Google Maps API, Twilio..."
                    onChange={handleChange}
                />
            </div>
          </div>
        </motion.div>

        {/* SECTION 3: Budget & Files */}
        <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative z-10"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <DollarSign size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">3. Budget & Assets</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="font-semibold text-gray-700 text-sm">Budget Estimate (INR)</label>
                <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500 font-bold">₹</span>
                    <input
                        type="number"
                        name="budget"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                        placeholder="25000"
                        onChange={handleChange}
                    />
                </div>
             </div>

             <div className="space-y-2">
                <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                    <Calendar size={14} /> Deadline
                </label>
                <input
                    type="date"
                    name="deadline"
                    required
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-gray-600"
                    onChange={handleChange}
                />
             </div>

             <div className="col-span-full">
                <label className="font-semibold text-gray-700 text-sm mb-2 block">Reference Files / Designs (Images or Zip)</label>
                
                {/* FIX APPLIED HERE: Added 'relative' class. 
                   This prevents the absolute 'label' from escaping this box 
                */}
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                    <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-primary transition-colors mb-3" />
                    <span className="text-sm font-medium text-gray-600">Click to Upload (Max 5 images or 1 Zip)</span>
                    <input type="file" name="attachments" multiple className="hidden" id="custom-upload" onChange={handleFileChange} />
                    {/* This label now stays INSIDE the relative div */}
                    <label htmlFor="custom-upload" className="absolute inset-0 cursor-pointer"></label>
                </div>
                
                {formData.attachments && (
                    <p className="mt-2 text-sm text-green-600 font-semibold">
                        {formData.attachments.length} file(s) selected
                    </p>
                )}
             </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
            <button
                type="submit"
                className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 relative z-20"
            >
                Submit Request <Send size={20} />
            </button>
        </div>

      </form>
    </div>
  );
};

export default CustomRequest;