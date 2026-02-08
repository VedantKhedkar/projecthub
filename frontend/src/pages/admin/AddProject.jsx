import React, { useState } from "react";
import { Upload, Plus } from "lucide-react"; 
import { CATEGORIES } from "../../data/projects";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); 

  const [formData, setFormData] = useState({
    title: "",
    category: "MERN Stack",
    price: "",
    description: "",
    techStack: "",
    demoLink: "",
    image: "",         // Will be URL from Cloudinary
    sourceCodeZip: "", // Will be URL
    assetsZip: "",     // Will be URL
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      
      if (res.ok) {
        setFormData(prev => ({ ...prev, [fieldName]: result.url }));
        alert(`${fieldName} Uploaded Successfully!`);
      } else {
        alert("Upload Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading file");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedData = {
        ...formData,
        techStack: formData.techStack.split(',').map(t => t.trim()),
        salesCount: 0
    };

    try {
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedData)
        });

        if (res.ok) {
            alert("Project Created Successfully!");
            navigate("/"); 
        } else {
            alert("Failed to create project");
        }
    } catch (error) {
        console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="title" onChange={handleChange} placeholder="Project Title" className="border p-3 rounded" required />
              <input name="price" type="number" onChange={handleChange} placeholder="Price" className="border p-3 rounded" required />
              <select name="category" onChange={handleChange} className="border p-3 rounded">
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input name="techStack" onChange={handleChange} placeholder="Tech Stack (comma separated)" className="border p-3 rounded" required />
          </div>
          <textarea name="description" onChange={handleChange} placeholder="Description" rows="4" className="w-full border p-3 rounded" required></textarea>
          
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-lg mb-4">Project Files {uploading && <span className="text-sm text-primary animate-pulse ml-2">Uploading...</span>}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className={`border-2 border-dashed ${formData.image ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-xl p-6 text-center`}>
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Thumbnail Image</span>
                    <input type="file" accept="image/*" className="hidden" id="thumb-upload" onChange={(e) => handleFileUpload(e, 'image')} />
                    <label htmlFor="thumb-upload" className="block mt-2 text-xs text-primary font-bold cursor-pointer hover:underline">
                        {formData.image ? "Change Image" : "Choose File"}
                    </label>
                </div>

                <div className={`border-2 border-dashed ${formData.sourceCodeZip ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-xl p-6 text-center`}>
                    <Upload className="mx-auto h-8 w-8 text-blue-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Source Code (ZIP)</span>
                    <input type="file" accept=".zip,.rar" className="hidden" id="code-upload" onChange={(e) => handleFileUpload(e, 'sourceCodeZip')} />
                    <label htmlFor="code-upload" className="block mt-2 text-xs text-primary font-bold cursor-pointer hover:underline">
                         {formData.sourceCodeZip ? "Change File" : "Choose File"}
                    </label>
                </div>

                <div className={`border-2 border-dashed ${formData.assetsZip ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-xl p-6 text-center`}>
                    <Upload className="mx-auto h-8 w-8 text-purple-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Assets/Setup</span>
                    <input type="file" accept=".zip,.mp4" className="hidden" id="assets-upload" onChange={(e) => handleFileUpload(e, 'assetsZip')} />
                    <label htmlFor="assets-upload" className="block mt-2 text-xs text-primary font-bold cursor-pointer hover:underline">
                        {formData.assetsZip ? "Change File" : "Choose File"}
                    </label>
                </div>

            </div>
          </div>

        <div className="bg-gray-50 p-6 flex justify-end gap-4 border-t border-gray-100">
            <button type="submit" disabled={loading || uploading} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-600 flex items-center gap-2 disabled:opacity-50">
                {loading ? "Creating..." : <><Plus size={20} /> Publish Project</>}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;