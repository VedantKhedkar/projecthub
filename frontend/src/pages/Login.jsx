import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import AuthContext from "../context/AuthContext"; // Import Context

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check role handles redirect in sidebar/layout usually, but we can force it here
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo.isAdmin) {
          navigate("/admin/dashboard");
      } else {
          navigate("/");
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to access your projects</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 mb-4 text-sm font-semibold">
                <AlertCircle size={16} /> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white"
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
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Sign In"} 
            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;