import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { ShieldCheck, CreditCard, Lock } from "lucide-react";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get Data passed from previous page
  const { projectId, title, price, type } = location.state || {};
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) navigate("/");
  }, [projectId, navigate]);

  const handlePayment = async () => {
    if (!user) {
        alert("Please login to continue");
        return navigate("/login");
    }
    setLoading(true);

    try {
        // 1. Create Order
        const res = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({ amount: price }),
        });
        
        if (!res.ok) throw new Error("Failed to create order");
        const order = await res.json();

        // 2. Open Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
          amount: order.amount,
          currency: "INR",
          name: "ProjectHub",
          description: title,
          order_id: order.id,
          handler: async function (response) {
            
            // 3. Verify Payment on Backend
            try {
                const verifyRes = await fetch("/api/payment/verify", {
                  method: "POST",
                  headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    userId: user._id,
                    projectId: projectId, 
                    paymentType: type || "prebuilt",
                    amount: price // <--- ADDED THIS LINE to save amount in logs
                  }),
                });

                const verifyData = await verifyRes.json();
                
                if (verifyData.success) {
                  alert("✅ " + verifyData.message);
                  navigate(verifyData.redirect); 
                } else {
                  alert("❌ Payment Verification Failed: " + (verifyData.message || "Unknown Error"));
                }
            } catch (err) {
                console.error("Verification API Error:", err);
                alert("❌ Payment verification failed due to network error.");
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: { color: "#4F46E5" },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

    } catch (error) {
        console.error("Payment Error:", error);
        alert("❌ Error starting payment. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 space-y-6">
        
        <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
            <p className="text-gray-500">Complete your payment to proceed.</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Item Details</h3>
            <p className="text-lg font-bold text-gray-900">{title}</p>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="text-gray-600">Total Payable</span>
                <span className="text-2xl font-bold text-primary">₹{price}</span>
            </div>
        </div>

        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {loading ? "Processing..." : <><Lock size={18} /> Pay Now</>}
        </button>

        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <ShieldCheck size={16} />
            <span>Payments are 100% Secure and Encrypted</span>
        </div>

      </div>
    </div>
  );
};

export default Checkout;