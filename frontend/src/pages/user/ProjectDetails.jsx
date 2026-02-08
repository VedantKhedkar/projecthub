import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Check, ShoppingCart, Loader, ShieldCheck, ChevronRight, Edit } from "lucide-react";
import AuthContext from "../../context/AuthContext";

// --- SEPARATE GALLERY COMPONENT ---
const ImageGallery = ({ mainImage, allImages, title }) => {
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    setActiveImage(mainImage);
  }, [mainImage]);

  // Dummy images to fill the gallery if the project only has one image
  const dummyImages = [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
  ];

  // Combine real images with dummy ones (if needed) to ensure at least 4-5 items
  const displayImages = allImages && allImages.length > 1 
    ? allImages 
    : [mainImage, ...dummyImages.slice(0, 4)];

  return (
    <div className="lg:col-span-7 space-y-6">
      {/* Main Display */}
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100 group">
        <img
          src={activeImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      {/* Thumbnails Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
        {displayImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
              activeImage === img 
              ? "border-primary ring-4 ring-indigo-50 shadow-lg scale-95" 
              : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
            }`}
          >
            <img src={img} className="w-full h-full object-cover" alt={`Preview ${index + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        setProject(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleBuy = async () => {
    if (!user) return navigate("/login");
    if (!agreedToTerms) return alert("Please accept the terms and conditions.");

    const res = await loadRazorpay();
    if (!res) return alert("Razorpay SDK failed to load.");

    const orderRes = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ projectId: project._id, amount: project.price }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) return alert(orderData.message || "Error Creating Order");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "ProjectHub",
      description: `Purchase ${project.title}`,
      order_id: orderData.id,
      handler: async function (response) {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: project.price,
            userId: user._id,
            projectId: project._id,
            paymentType: "prebuilt",
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert("Payment Successful!");
          navigate(verifyData.redirect || "/my-projects");
        } else {
          alert("Payment verification failed");
        }
      },
      prefill: { name: user.name, email: user.email },
      theme: { color: "#6366f1" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    );

  if (!project) return <div className="text-center py-20 font-bold text-gray-800">Project not found</div>;

  // 👇 THE FIX: Robust check for Admin Status
  const isAdmin = user && (user.isAdmin === true || user.role === 'admin');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-4">
        <Link to="/" className="hover:text-primary transition-colors">Projects</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 truncate max-w-[200px]">{project.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Gallery Section */}
        <ImageGallery 
          mainImage={project.image} 
          allImages={project.images} 
          title={project.title} 
        />

        {/* RIGHT: ACTION & PRICING SECTION */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-gray-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900">₹{project.price.toLocaleString()}</span>
              <span className="text-gray-400 text-sm line-through">₹{(project.price * 1.5).toLocaleString()}</span>
              <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Limited Offer</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Unlock the full potential of your development with our premium, production-ready source code. Instant delivery upon successful payment.
            </p>

            <div className="pt-4 border-t border-gray-50 space-y-4">
              
              {/* --- CONDITIONAL RENDERING: ADMIN EDIT vs USER BUY --- */}
              {isAdmin ? (
                // ADMIN VIEW: EDIT BUTTON
                <Link
                  to={`/admin/edit-project/${project._id}`}
                  className="w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 bg-gray-900 text-white shadow-xl hover:bg-gray-800 active:scale-95"
                >
                  <Edit size={22} />
                  Edit Project
                </Link>
              ) : (
                // USER VIEW: BUY BUTTON
                <>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <div className="relative flex items-center mt-1">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:bg-primary checked:border-primary"
                      />
                      <Check className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none" />
                    </div>
                    <span className="text-xs text-gray-500 leading-tight">
                      I agree to the <Link to="/legal/terms" target="_blank" className="text-primary font-bold underline">Terms of Service</Link>. 
                      I acknowledge that digital products are non-refundable once accessed.
                    </span>
                  </label>

                  <button
                    onClick={handleBuy}
                    disabled={!agreedToTerms}
                    className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                      agreedToTerms 
                      ? "bg-primary text-white shadow-xl shadow-indigo-200 hover:bg-indigo-600 active:scale-95" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart size={22} />
                    Buy Source Code Now
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <ShieldCheck className="text-primary" size={18} />
                Secure Checkout with Razorpay
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <Check className="text-green-500" size={18} />
                Instant Source Code Access
              </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-8">
        <h2 className="text-3xl font-black text-gray-900">What's included in this project?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Complete Source", desc: "Front-end and Back-end repositories included." },
            { title: "Documentation", desc: "Detailed PDF and Readme for local setup." },
            { title: "Assets Bundle", desc: "All icons, fonts, and licensed images." },
            { title: "Database", desc: "Full SQL/NoSQL schema with sample data." },
            { title: "Video Guide", desc: "Tutorial on how to deploy to cloud hosting." },
            { title: "Future Updates", desc: "Lifetime access to any bug fixes or updates." }
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all duration-300">
              <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Check className="text-primary" size={20} />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;