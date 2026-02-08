import React, { useState, useEffect, useContext } from "react";
import { Search, Loader, ArrowRight, Code, Sparkles, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import { CATEGORIES } from "../data/projects";
import AuthContext from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { query, setQuery } = useContext(SearchContext);
  const navigate = useNavigate();

  const userRole = user ? (user.isAdmin ? "admin" : "user") : "guest";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const isSearching = query.length > 0;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const text = query.toLowerCase();
    const matchesSearch =
      project.title.toLowerCase().includes(text) ||
      project.description?.toLowerCase().includes(text) ||
      project.techStack.some((t) => t.toLowerCase().includes(text));

    const matchesCategory =
      selectedCategory === "All" || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <AnimatePresence>
        {!isSearching && (
          <motion.section
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-[50vh] flex items-center justify-center rounded-3xl bg-[#0B0F1A] text-white p-8 md:p-16 shadow-2xl"
          >
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-4xl text-center space-y-8">

              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-primary font-medium text-sm">
                <Sparkles size={16} /> Premium Project Marketplace
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                Build Smarter,
                <br />
                <span className="bg-gradient-to-r from-primary to-indigo-400 text-transparent bg-clip-text">
                  Launch Faster.
                </span>
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                {/* Explore Button (Always visible) */}
                <button
                  onClick={() =>
                    document.getElementById("marketplace").scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-indigo-600"
                >
                  Explore Marketplace <ArrowRight size={20} />
                </button>

                {/* Custom Request Button (Only for users, not admin) */}
                {userRole !== "admin" && (
                  <button
                    onClick={() => navigate("/request-custom")}
                    className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-white font-bold flex items-center gap-2 hover:bg-white/20"
                  >
                    <Code size={20} />
                    Custom Request
                  </button>
                )}

                {/* Admin Dashboard Button (Only for admin) */}
                {userRole === "admin" && (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="w-full sm:w-auto px-8 py-4 bg-yellow-400 text-black font-bold rounded-2xl flex items-center gap-2 hover:bg-yellow-500"
                  >
                    Admin Dashboard
                  </button>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Marketplace Section */}
      <div id="marketplace" className="space-y-8">

        {/* Active Search Header */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-primary/20 shadow-sm flex justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Search size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Search Results</h2>
                <p className="text-sm text-gray-500">
                  {filteredProjects.length} results for "{query}"
                </p>
              </div>
            </div>

            <button
              onClick={() => setQuery("")}
              className="text-sm font-bold text-gray-500 hover:text-red-500 flex items-center gap-2"
            >
              <XCircle size={16} /> Clear Search
            </button>
          </motion.div>
        )}

        {/* Categories */}
        {!isSearching && (
          <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#0B0F1A] text-white scale-105"
                    : "bg-white border border-gray-300 text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects */}
        {loading ? (
          <div className="py-32 flex justify-center">
            <Loader size={42} className="animate-spin text-primary" />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence>
              {filteredProjects.length ? (
                filteredProjects.map((p) => (
                  <ProjectCard key={p._id} project={p} userRole={userRole} />
                ))
              ) : (
                <motion.div className="col-span-full p-20 bg-gray-50 border border-dashed border-gray-300 text-center rounded-3xl">
                  <p className="text-xl text-gray-500">
                    No results found.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;