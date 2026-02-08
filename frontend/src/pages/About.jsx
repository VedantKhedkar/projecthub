import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Rocket,
  Code,
  Users,
  ShoppingBag,
  Layers,
  Wrench,
  Send,
} from "lucide-react";

const About = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const fadeScale = {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 }
  };

  const stats = [
    { label: "Projects Delivered", value: "500+" },
    { label: "Active Developers", value: "2k+" },
    { label: "Customer Rating", value: "4.9/5" },
    { label: "Countries Served", value: "40+" }
  ];

  const offerings = [
    {
      icon: <Wrench size={28} className="text-primary" />,
      title: "Custom Project Development",
      desc: "We build fully customized web, mobile & AI applications based on your ideas — perfect for students, startups & enterprises.",
      glow: "from-primary/30 to-indigo-500/40",
    },
    {
      icon: <Layers size={28} className="text-indigo-500" />,
      title: "Premium Pre-built Projects",
      desc: "Choose from a growing library of production-ready source codes including full-stack apps, AI tools, LMS, e-commerce & more.",
      glow: "from-indigo-400/30 to-purple-500/40",
    },
    {
      icon: <ShoppingBag size={28} className="text-pink-500" />,
      title: "Instant File Delivery",
      desc: "Download your purchased project files instantly along with documentation & lifetime support.",
      glow: "from-pink-400/30 to-rose-500/40",
    },
  ];

  const socialPlatforms = [
    {
      name: "Instagram",
      handle: "@projecthub.dev",
      image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=900",
      emoji: "📸",
      btn: "View Profile",
      color: "from-[#f09433] via-[#dc2743] to-[#cc2366]",
    },
    {
      name: "WhatsApp",
      handle: "Business Support",
      image: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?q=80&w=900",
      emoji: "💬",
      btn: "Chat Now",
      color: "from-[#25D366] to-[#128C7E]",
    },
    {
      name: "YouTube",
      handle: "ProjectHub Tutorials",
      image: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=900",
      emoji: "🎬",
      btn: "Subscribe",
      color: "from-[#FF0000] to-[#282828]",
    }
  ];

  return (
    <div className="space-y-24 pb-20">

      {/* ---------------- HERO SECTION (Old Text Kept Same) ---------------- */}
      <section className="relative py-20 px-8 rounded-[3rem] bg-[#0B0F1A] text-white text-center overflow-hidden border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-40" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-3xl mx-auto space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            We Bridge the Gap Between <span className="text-primary">Idea</span> and <span className="text-indigo-400">Execution.</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed"
          >
            ProjectHub is the world's most curated marketplace for premium pre-built projects,
            designed to help entrepreneurs and developers launch faster than ever before.
          </motion.p>
        </motion.div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
        {stats.map((stat, idx) => (
          <motion.div
            {...fadeScale}
            key={idx}
            className="text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm"
          >
            <h3 className="text-4xl font-black text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ---------------- OFFERINGS ---------------- */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <motion.h2 {...fadeUp} className="text-4xl font-black text-center text-gray-900">
          What We Offer
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offerings.map((item, idx) => (
            <motion.div
              key={idx}
              {...fadeUp}
              transition={{ delay: idx * 0.2 }}
              className="relative group bg-white p-10 rounded-[2rem] border border-gray-200 shadow-md hover:shadow-xl transition-all"
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-40 blur-2xl transition-all duration-500 bg-gradient-to-br ${item.glow} rounded-[2rem]`}
              />

              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

{/* ---------------- WHY CHOOSE US ---------------- */}
        <section className="max-w-6xl mx-auto px-6 mt-20 space-y-16">
        <motion.h2 {...fadeUp} className="text-4xl font-black text-center text-gray-900">
            Why Choose ProjectHub?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
            {
                title: "100% Verified Projects",
                desc: "Each project goes through strict testing & quality checks.",
                icon: <ShieldCheck size={40} className="text-primary" />
            },
            {
                title: "Fast Custom Development",
                desc: "We build tailored projects for students and startups quickly.",
                icon: <Rocket size={40} className="text-indigo-500" />
            },
            {
                title: "Affordable Pricing",
                desc: "Premium quality at prices made for students & freelancers.",
                icon: <ShoppingBag size={40} className="text-pink-500" />
            }
            ].map((item, idx) => (
            <motion.div
                key={idx}
                {...fadeUp}
                transition={{ delay: idx * 0.15 }}
                className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all"
            >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-black mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
            </motion.div>
            ))}
        </div>
        </section>

      {/* ---------------- SOCIAL CARDS ---------------- */}
      
{/* ---------------- SOCIAL CARDS ---------------- */}
<section className="max-w-7xl mx-auto px-6">
  <motion.h2 {...fadeUp} className="text-4xl font-black text-gray-900 text-center mb-14">
    Follow Our Platforms
  </motion.h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[
      {
        name: "Instagram",
        handle: "@projecthub.dev",
        image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=900&q=80",
        btn: "View Profile",
        color: "from-[#f09433] via-[#dc2743] to-[#cc2366]",
        icon: "/icons/instagram.png", // Correct path
      },
      {
        name: "WhatsApp",
        handle: "Business Support",
        image: "https://images.unsplash.com/photo-1598524375532-5c66fdbf76ea?w=900&q=80",
        btn: "Chat Now",
        color: "from-[#25D366] to-[#128C7E]",
        icon: "/icons/whatsapp.png", // Correct path
      },
      {
        name: "YouTube",
        handle: "ProjectHub Tutorials",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&q=80",
        btn: "Subscribe",
        color: "from-[#FF0000] to-[#282828]",
        icon: "/icons/youtube.png", // Correct path
      }
    ].map((p, idx) => (
      <motion.div
        {...fadeUp}
        transition={{ delay: idx * 0.15 }}
        className="relative h-[380px] rounded-[2rem] overflow-hidden shadow-xl group"
      >
        <img
          src={p.image}
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90" />

        <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">

          {/* ICON + TITLE */}
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <img src={p.icon} className="w-6 h-6 object-contain" />
            </div>

            <h3 className="text-3xl font-black">{p.name}</h3>
            <p className="text-white/70 text-sm">{p.handle}</p>
          </div>

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`px-6 py-3 rounded-xl font-black bg-gradient-to-r ${p.color}`}
          >
            {p.btn}
          </motion.button>
        </div>
      </motion.div>
    ))}
  </div>
</section>



{/* ---------------- HOW IT WORKS ---------------- */}
    <section className="max-w-6xl mx-auto px-6 mt-20">
    <motion.h2 {...fadeUp} className="text-4xl font-black text-center text-gray-900 mb-14">
        How ProjectHub Works
    </motion.h2>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {[
        {
            step: "1",
            title: "Explore Projects",
            desc: "Browse 200+ ready-made & custom project categories.",
        },
        {
            step: "2",
            title: "Buy Instantly",
            desc: "Purchase your project & get instant file delivery.",
        },
        {
            step: "3",
            title: "Request Custom Work",
            desc: "Need modifications? Our dev team builds it for you.",
        },
        {
            step: "4",
            title: "Get Support",
            desc: "We offer after-purchase integration & doubt solving.",
        }
        ].map((item, idx) => (
        <motion.div
            key={idx}
            {...fadeUp}
            transition={{ delay: idx * 0.15 }}
            className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all"
        >
            <div className="text-primary font-black text-4xl mb-4">{item.step}</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
        </motion.div>
        ))}
    </div>
    </section>


      {/* ---------------- CONTACT FORM ---------------- */}
      <section id="contact" className="max-w-4xl mx-auto p-12 bg-white rounded-[2.5rem] shadow-xl border border-gray-200">
        <motion.h2 {...fadeUp} className="text-4xl font-black text-gray-900 text-center">
          Get in Touch
        </motion.h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

          <motion.input {...fadeUp} className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Your Name" />

          <motion.input {...fadeUp} className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Email Address" />

          <motion.input {...fadeUp} className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Phone Number" />

          <motion.textarea
            {...fadeUp}
            className="md:col-span-2 px-6 py-4 h-32 bg-gray-50 border border-gray-200 rounded-xl resize-none"
            placeholder="Tell us about your project"
          />

          <motion.button
            {...fadeUp}
            className="md:col-span-2 px-12 py-4 bg-primary text-white font-black rounded-xl"
          >
            Submit Inquiry <Send className="inline ml-2" size={18} />
          </motion.button>
        </form>
      </section>

    </div>
  );
};

export default About;
