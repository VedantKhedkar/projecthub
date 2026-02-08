import React, { useState, useEffect, useContext } from "react";
import { Download, FileJson, Loader, Package, Briefcase, CheckCircle, Search, X, Video, FileCode } from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";

const MyFiles = () => {
  const { user } = useContext(AuthContext);
  const [prebuiltProjects, setPrebuiltProjects] = useState([]);
  const [customDeliveries, setCustomDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllFiles = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const resPre = await fetch('/api/users/profile', { headers });
        const dataPre = await resPre.json();
        setPrebuiltProjects(dataPre.purchasedProjects || []);

        const resCust = await fetch('/api/custom-requests/my', { headers });
        const dataCust = await resCust.json();
        
        // Filter Completed projects that have at least one upload
        const delivered = dataCust.filter(req => 
            req.status === "Completed" && 
            (req.finalProjectCode || req.finalVideo || req.finalAssets)
        );
        setCustomDeliveries(delivered);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
      setLoading(false);
    };
    if (user) fetchAllFiles();
  }, [user]);

  // --- FORCED BLOB DOWNLOAD LOGIC ---
  const handleDownload = async (url, fallbackName = "download") => {
    if (!url) return alert("File not available.");

    try {
      // Fetch as blob to prevent browser from interpreting binary as text
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Extract filename from the end of the URL
      const fileName = url.split('/').pop().split('?')[0] || fallbackName;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: If fetch is blocked by CORS, try direct window open
      window.open(url, "_blank");
    }
  };

  const filteredCustom = customDeliveries.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrebuilt = prebuiltProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-12">
      {/* HEADER */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Delivery Manager</h1>
            <p className="text-gray-500 mt-1">Download your project source code, videos, and assets.</p>
        </div>
        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search projects..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* CUSTOM PROJECT DELIVERIES */}
      <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Briefcase className="text-primary" size={22}/> Custom Deliveries</h2>
            {filteredCustom.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filteredCustom.map((project) => (
                        <div key={project._id} className="bg-white rounded-xl border border-indigo-100 shadow-sm p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 w-full">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0"><Package size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{project.title}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1"><CheckCircle size={12} className="text-green-500"/> Final Project Files</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                                <button onClick={() => handleDownload(project.finalProjectCode)} disabled={!project.finalProjectCode} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${project.finalProjectCode ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "bg-gray-50 text-gray-300"}`}>
                                    <FileCode size={16} /> Code
                                </button>
                                <button onClick={() => handleDownload(project.finalVideo)} disabled={!project.finalVideo} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${project.finalVideo ? "bg-purple-50 text-purple-700 hover:bg-purple-100" : "bg-gray-50 text-gray-300"}`}>
                                    <Video size={16} /> Video
                                </button>
                                <button onClick={() => handleDownload(project.finalAssets)} disabled={!project.finalAssets} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${project.finalAssets ? "bg-orange-50 text-orange-700 hover:bg-orange-100" : "bg-gray-50 text-gray-300"}`}>
                                    <Package size={16} /> Assets
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">No custom projects ready for download.</p>}
      </div>

      {/* PURCHASED PREBUILT TEMPLATES */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Package className="text-purple-600" size={22}/> Store Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrebuilt.map((project) => (
                <div key={project._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col hover:shadow-lg transition">
                    <div className="h-32 overflow-hidden relative group">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition" />
                        <div className="absolute inset-0 bg-black/40 p-4 flex items-end"><h3 className="text-white font-bold">{project.title}</h3></div>
                    </div>
                    <div className="p-4 space-y-2">
                        <button onClick={() => handleDownload(project.sourceCodeZip)} className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition font-semibold text-sm">
                            <span className="flex items-center gap-2 text-gray-700"><FileJson size={14} className="text-blue-600"/> Code</span>
                            <Download size={14} className="text-gray-400"/>
                        </button>
                        <button onClick={() => handleDownload(project.assetsZip)} className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-purple-50 transition font-semibold text-sm">
                            <span className="flex items-center gap-2 text-gray-700"><Package size={14} className="text-purple-600"/> Assets</span>
                            <Download size={14} className="text-gray-400"/>
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyFiles;