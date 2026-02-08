import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, User, Mail, Lock, Clock, AlertCircle } from "lucide-react";
import AuthContext from "../context/AuthContext"; // Import

const Register = () => {
  const { register } = useContext(AuthContext); // Get register function
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Call Backend
    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  // View: After Registration Success (No changes needed to UI here)
  if (isSubmitted) {
    return (
        // ... (Keep the existing success UI code)
        <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center border border-green-100"
        >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
                Your account has been created and is currently <strong>pending admin approval</strong>. 
                You will be notified once your account is active.
            </p>
            <Link to="/" className="text-primary font-bold hover:underline">
                Return to Home
            </Link>
        </motion.div>
      </div>
    );
  }

  // View: Registration Form
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-secondary">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join ProjectHub today</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 mb-4 text-sm font-semibold">
                <AlertCircle size={16} /> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ... (Keep existing Input Fields for Name, Email, Password) ... */}
           {/* Name Input */}
           <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-purple-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-200 mt-2 disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary font-bold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;