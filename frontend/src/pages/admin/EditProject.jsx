import React, { useState, useEffect, useContext } from "react";
import { 
  Upload, 
  Save, 
  Trash, 
  X, 
  Image as ImageIcon,
  FileText, 
  Video, 
  Package,
  DollarSign,
  Tag,
  Code,
  Globe,
  Layers,
  FileArchive,
  Sparkles,
  AlertCircle
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    techStack: "",
    description: "",
    detailedDescription: "",
    demoLink: "",
    thumbnail: null,
    galleryNew: [],
    sourceCodeZip: null,
    assetsZip: null,
    setupVideo: null,
    features: "",
    requirements: "",
    tags: "",
    discount: "",
    supportPeriod: "6",
    license: "Commercial"
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [galleryOld, setGalleryOld] = useState([]);
  const [previewGalleryNew, setPreviewGalleryNew] = useState([]);

  const categories = [
    "E-commerce",
    "Portfolio",
    "Dashboard",
    "Blog/CMS",
    "Social Media",
    "Learning Management",
    "Healthcare",
    "Real Estate",
    "Food & Restaurant",
    "Travel & Booking",
    "Finance",
    "SaaS",
    "Mobile App",
    "Desktop App",
    "Game"
  ];

  // ================================
  // LOAD EXISTING PROJECT
  // ================================
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
          headers: user?.token ? {
            'Authorization': `Bearer ${user.token}`
          } : {}
        });

        let data;
        if (res.ok) {
          const response = await res.json();
          data = response.project || response;
        } else {
          // Mock data for demo
          data = {
            _id: id,
            title: "E-commerce Platform",
            price: 4999,
            category: "E-commerce",
            techStack: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
            description: "Complete online store solution",
            detailedDescription: "A fully functional e-commerce platform built with MERN stack. Includes user authentication, product management, shopping cart, payment gateway integration, order management, and admin dashboard.",
            demoLink: "https://demo.projecthub.com/ecommerce",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
            images: [
              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
            ],
            features: ["User authentication", "Product catalog", "Shopping cart", "Payment integration"],
            requirements: ["Node.js 14+", "MongoDB", "Razorpay account"],
            tags: ["ecommerce", "mern", "fullstack"],
            discount: 10,
            supportPeriod: "6",
            license: "Commercial"
          };
        }

        setForm({
          ...form,
          title: data.title || "",
          price: data.price || "",
          category: data.category || "",
          techStack: Array.isArray(data.techStack) ? data.techStack.join(", ") : data.techStack || "",
          description: data.description || "",
          detailedDescription: data.detailedDescription || data.description || "",
          demoLink: data.demoLink || "",
          features: Array.isArray(data.features) ? data.features.join("\n") : data.features || "",
          requirements: Array.isArray(data.requirements) ? data.requirements.join("\n") : data.requirements || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
          discount: data.discount || "",
          supportPeriod: data.supportPeriod || "6",
          license: data.license || "Commercial"
        });

        setPreviewThumbnail(data.image || data.images?.[0] || "");
        setGalleryOld(data.images || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, user]);

  // ================================
  // VALIDATION
  // ================================
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.techStack.trim()) newErrors.techStack = "Tech stack is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================================
  // INPUT HANDLERS
  // ================================
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setForm({ ...form, thumbnail: file });
      setPreviewThumbnail(URL.createObjectURL(file));
    } else {
      alert("Please select an image file");
    }
  };

  const handleGalleryNew = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert("Please select image files only");
      return;
    }

    if (galleryOld.length + previewGalleryNew.length + imageFiles.length > 10) {
      alert("Maximum 10 images allowed in gallery.");
      return;
    }

    setForm({ ...form, galleryNew: [...form.galleryNew, ...imageFiles] });
    setPreviewGalleryNew([
      ...previewGalleryNew,
      ...imageFiles.map((f) => URL.createObjectURL(f)),
    ]);
  };

  // Remove OLD image
  const removeOldImage = (index) => {
    const updated = galleryOld.filter((_, i) => i !== index);
    setGalleryOld(updated);
  };

  // Remove NEW image
  const removeNewImage = (index) => {
    setPreviewGalleryNew(previewGalleryNew.filter((_, i) => i !== index));
    setForm({
      ...form,
      galleryNew: form.galleryNew.filter((_, i) => i !== index),
    });
  };

  // ================================
  // SUBMIT UPDATE
  // ================================
  const submit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();

      // Text fields
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("techStack", form.techStack);
      formData.append("description", form.description);
      formData.append("detailedDescription", form.detailedDescription);
      formData.append("demoLink", form.demoLink);
      formData.append("features", form.features);
      formData.append("requirements", form.requirements);
      formData.append("tags", form.tags);
      formData.append("discount", form.discount || 0);
      formData.append("supportPeriod", form.supportPeriod);
      formData.append("license", form.license);

      // Thumbnail
      if (form.thumbnail) formData.append("thumbnail", form.thumbnail);

      // Existing images
      galleryOld.forEach((url) => {
        formData.append("existingGallery[]", url);
      });

      // New images
      form.galleryNew.forEach((img) => {
        formData.append("gallery", img);
      });

      // Files
      if (form.sourceCodeZip) formData.append("sourceCodeZip", form.sourceCodeZip);
      if (form.assetsZip) formData.append("assetsZip", form.assetsZip);
      if (form.setupVideo) formData.append("setupVideo", form.setupVideo);

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Project updated successfully!");
        navigate(`/project/${id}`);
      } else {
        alert(`❌ ${data.message || "Failed to update project"}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Error updating project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
            <p className="text-gray-600 mt-1">Update project details, media, and files</p>
          </div>
          <button
            onClick={() => navigate(`/project/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  name="title"
                  value={form.title}
                  onChange={handleInput}
                  placeholder="Enter project title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (INR) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    className={`w-full pl-10 pr-4 py-3 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                    name="price"
                    value={form.price}
                    onChange={handleInput}
                    placeholder="e.g., 4999"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  className={`w-full px-4 py-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  name="category"
                  value={form.category}
                  onChange={handleInput}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  name="discount"
                  value={form.discount}
                  onChange={handleInput}
                  placeholder="e.g., 10"
                />
              </div>

              {/* Tech Stack */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tech Stack (comma separated) *
                </label>
                <div className="relative">
                  <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className={`w-full pl-10 pr-4 py-3 border ${errors.techStack ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                    name="techStack"
                    value={form.techStack}
                    onChange={handleInput}
                    placeholder="e.g., React, Node.js, MongoDB, Express"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Separate technologies with commas</p>
                {errors.techStack && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.techStack}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    name="tags"
                    value={form.tags}
                    onChange={handleInput}
                    placeholder="e.g., ecommerce, mern, fullstack"
                  />
                </div>
              </div>

              {/* Demo Link */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demo Link
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    name="demoLink"
                    value={form.demoLink}
                    onChange={handleInput}
                    placeholder="https://demo.yourproject.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Description</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  placeholder="Brief description shown on project cards"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  name="detailedDescription"
                  value={form.detailedDescription}
                  onChange={handleInput}
                  placeholder="Detailed project description shown on project page"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features (one per line)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    name="features"
                    value={form.features}
                    onChange={handleInput}
                    placeholder="User authentication\nPayment integration\nAdmin dashboard"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements (one per line)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    name="requirements"
                    value={form.requirements}
                    onChange={handleInput}
                    placeholder="Node.js 14+\nMongoDB\nRazorpay account"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Files Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileArchive className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Project Files</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="group border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-gray-900 mb-1">Source Code ZIP</p>
                <p className="text-sm text-gray-500">Replace project source files</p>
                <input
                  type="file"
                  accept=".zip,.rar,.7z"
                  className="hidden"
                  onChange={(e) =>
                    setForm({ ...form, sourceCodeZip: e.target.files[0] })
                  }
                />
                {form.sourceCodeZip && (
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    ✓ {form.sourceCodeZip.name}
                  </p>
                )}
              </label>

              <label className="group border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-medium text-gray-900 mb-1">Assets ZIP</p>
                <p className="text-sm text-gray-500">Images, icons, fonts</p>
                <input
                  type="file"
                  accept=".zip,.rar,.7z"
                  className="hidden"
                  onChange={(e) =>
                    setForm({ ...form, assetsZip: e.target.files[0] })
                  }
                />
                {form.assetsZip && (
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    ✓ {form.assetsZip.name}
                  </p>
                )}
              </label>

              <label className="group border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                  <Video className="w-6 h-6 text-red-600" />
                </div>
                <p className="font-medium text-gray-900 mb-1">Setup Video</p>
                <p className="text-sm text-gray-500">MP4, MOV, AVI files</p>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) =>
                    setForm({ ...form, setupVideo: e.target.files[0] })
                  }
                />
                {form.setupVideo && (
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    ✓ {form.setupVideo.name}
                  </p>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Media & Actions */}
        <div className="space-y-6">
          {/* Thumbnail Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Thumbnail</h2>
            </div>

            <div className="space-y-4">
              {previewThumbnail && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={previewThumbnail}
                    className="w-full h-full object-cover"
                    alt="Thumbnail preview"
                  />
                </div>
              )}

              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Replace Thumbnail</p>
                <p className="text-sm text-gray-500">Recommended: 1280x720px</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnail}
                />
              </label>
            </div>
          </div>

          {/* Gallery Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
                  <p className="text-sm text-gray-500">
                    {galleryOld.length + previewGalleryNew.length} / 10 images
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Existing Images */}
              {galleryOld.map((url, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden">
                  <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt={`Gallery ${index + 1}`}
                  />
                  <button
                    onClick={() => removeOldImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* New Images */}
              {previewGalleryNew.map((url, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden">
                  <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt={`New image ${index + 1}`}
                  />
                  <button
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Add More Button */}
              {galleryOld.length + previewGalleryNew.length < 10 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Add More</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleGalleryNew}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Period (months)
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  name="supportPeriod"
                  value={form.supportPeriod}
                  onChange={handleInput}
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  name="license"
                  value={form.license}
                  onChange={handleInput}
                >
                  <option value="Commercial">Commercial License</option>
                  <option value="Personal">Personal Use Only</option>
                  <option value="Extended">Extended License</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Card */}
          <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20 p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Save Changes</h3>
              <p className="text-sm text-gray-600">Update project with new information</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={submit}
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={22} />
                    Save Changes
                  </>
                )}
              </button>

              <button
                onClick={() => navigate(`/project/${id}`)}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject;