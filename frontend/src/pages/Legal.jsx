import React, { useState } from "react";
import { Shield, FileText, RefreshCcw, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const Legal = () => {
  const [active, setActive] = useState("terms");

  const tabs = [
    { id: "terms", label: "Terms & Conditions", icon: <FileText size={18} /> },
    { id: "privacy", label: "Privacy Policy", icon: <Shield size={18} /> },
    { id: "refund", label: "Refund Policy", icon: <RefreshCcw size={18} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Page Title */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-black text-center text-gray-900 mb-10"
      >
        Legal & Policies
      </motion.h1>

      {/* TAB BUTTONS */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md
              ${
                active === tab.id
                  ? "bg-primary text-white shadow-primary/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT SECTIONS */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg leading-relaxed text-gray-700 space-y-6"
      >
        {/* TERMS & CONDITIONS */}
        {active === "terms" && (
          <>
            <h2 className="text-2xl font-bold text-gray-900">Terms & Conditions</h2>

            <p>
              Welcome to <strong>ProjectHub</strong>. By accessing or using our platform, 
              you agree to follow all rules and guidelines listed here.
            </p>

            <h3 className="font-bold text-lg">1. Use of Platform</h3>
            <p>
              You must not misuse our platform, attempt to hack, or resell content without permission.
            </p>

            <h3 className="font-bold text-lg">2. Account Responsibility</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account and activities.
            </p>

            <h3 className="font-bold text-lg">3. Payments & Ownership</h3>
            <p>
              Upon purchasing a project, you receive digital files and usage rights but not exclusive ownership.
            </p>

            <h3 className="font-bold text-lg">4. Prohibited Activities</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reselling content without permission</li>
              <li>Sharing paid files publicly</li>
              <li>Using platform for illegal activities</li>
            </ul>

            <p className="pt-2">
              Violation of terms may lead to account suspension.
            </p>
          </>
        )}

        {/* PRIVACY POLICY */}
        {active === "privacy" && (
          <>
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>

            <p>
              ProjectHub values your privacy and is committed to safeguarding your personal information.
            </p>

            <h3 className="font-bold text-lg">1. Information We Collect</h3>
            <p>Email, name, payment details (secure), and activity logs.</p>

            <h3 className="font-bold text-lg">2. How We Use Data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>To improve user experience</li>
              <li>To process payments securely</li>
              <li>To prevent fraud</li>
            </ul>

            <h3 className="font-bold text-lg">3. Payment Security</h3>
            <p>
              All payments are processed through <strong>Razorpay</strong> using secure encryption standards.
            </p>

            <h3 className="font-bold text-lg">4. Data Sharing</h3>
            <p>
              We do <strong>not sell or share</strong> your data with third parties.
            </p>
          </>
        )}

        {/* REFUND POLICY */}
        {active === "refund" && (
          <>
            <h2 className="text-2xl font-bold text-gray-900">Refund Policy</h2>

            <p>
              Since we deliver **digital downloadable files**, refunds are handled under strict conditions.
            </p>

            <h3 className="font-bold text-lg">1. Refund Eligibility</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Incorrect file delivered</li>
              <li>Broken or missing download links</li>
              <li>Payment deducted but file not received -After Checks. </li>
            </ul>

            <h3 className="font-bold text-lg">2. Not Eligible For Refund</h3>
            <p>
              Refunds are NOT issued for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Change of mind after download</li>
              <li>Already received working source code</li>
              <li>Misuse or modification of code</li>
            </ul>

            <h3 className="font-bold text-lg">3. Refund Request Time</h3>
            <p>
              Refund request must be raised within <strong>48 hours</strong> of purchase.
            </p>

            <h3 className="font-bold text-lg">4. How to Apply</h3>
            <p>
              Email us at:  
              <strong className="text-primary"> projecthubadm@gmail.com</strong>
            </p>

            <div className="flex items-center gap-2 text-green-600 font-semibold pt-4">
              <CheckCircle size={20} />
              <span>We ensure fair and quick resolution.</span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Legal;
