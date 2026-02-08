import React from "react";
import { motion } from "framer-motion";
import { Eye, ShoppingCart, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Pass userRole prop to check permissions
const ProjectCard = ({ project, userRole }) => {
  const navigate = useNavigate();

  // Handler for actions
// Handler for actions
  const handleAction = (actionType) => {
    if (userRole === "guest") {
      navigate("/login");
    } else {
      if (actionType === "demo") {
        // Use the real demo link from the database if available
        if (project.demoLink) {
             window.open(project.demoLink, "_blank");
        } else {
             alert(`Opening Live Demo for ${project.title}`);
        }
      } else if (actionType === "buy") {
        // IMPORTANT CHANGE HERE: Use _id instead of id
        navigate(`/project/${project._id}`); 
      }
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay for Guest Users indicating 'Login to View' */}
        {userRole === "guest" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-white font-semibold bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
              <Lock size={16} /> Login to Access
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wide">
            {project.category}
          </span>
          <span className="text-lg font-bold text-gray-900">
            ₹{project.price.toLocaleString("en-IN")}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tech}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button
            onClick={() => handleAction("demo")}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-medium hover:border-primary hover:text-primary transition-colors"
          >
            <Eye size={18} />
            Demo
          </button>
          
          <button
            onClick={() => handleAction("buy")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200"
          >
            <ShoppingCart size={18} />
            Buy
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;