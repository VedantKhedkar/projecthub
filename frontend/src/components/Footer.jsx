import React from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Instagram,
  Facebook,
  MessageCircle,
  Send
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socials = [
    { icon: <Instagram size={20} />, href: "#" },
    { icon: <Facebook size={20} />, href: "#" },
    { icon: <MessageCircle size={20} />, href: "#" }, // WhatsApp
    { icon: <Send size={20} />, href: "mailto:projecthubadm@gmail.com" }, // Email
  ];

  return (
    <footer className="w-full px-4 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto bg-[#0B0F1A] text-gray-300 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative">

        {/* Glow Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />

        <div className="px-8 lg:px-12 pt-16 pb-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            
            {/* Brand Section */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/40 animate-pulse">
                  <Zap size={22} fill="currentColor" />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  Project<span className="text-primary">Hub</span>
                </span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Empowering developers with production-ready code. Speed up your workflow with premium digital assets.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-4 pt-2">
                {socials.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="
                      w-11 h-11 flex items-center justify-center 
                      rounded-2xl bg-white/5 border border-white/10
                      transition-all duration-300
                      hover:bg-primary hover:text-white
                      hover:shadow-[0_0_12px_rgba(99,102,241,0.7)]
                      hover:scale-110
                      animate-float
                    "
                    style={{
                      animationDelay: `${idx * 0.15}s`,
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <h4 className="text-white font-bold uppercase text-[11px] tracking-[0.2em] opacity-80">Platform</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/" className="hover:text-primary transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Pre-built Projects
                </Link></li>
                <li><Link to="/request-custom" className="hover:text-primary transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Custom Request
                </Link></li>
                <li><Link to="/my-files" className="hover:text-primary transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  My Deliveries
                </Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
  <h4 className="text-white font-bold uppercase text-[11px] tracking-[0.2em] opacity-80">
    Company
  </h4>

  <ul className="space-y-4 text-sm">

    {/* Terms & Conditions */}
    <li>
      <Link 
        to="/legal?section=terms" 
        className="hover:text-primary transition-colors flex items-center group"
      >
        <ArrowRight 
          size={14} 
          className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" 
        />
        Terms & Conditions
      </Link>
    </li>

    {/* Privacy Policy */}
    <li>
      <Link 
        to="/legal?section=privacy" 
        className="hover:text-primary transition-colors flex items-center group"
      >
        <ArrowRight 
          size={14} 
          className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" 
        />
        Privacy Policy
      </Link>
    </li>

    {/* Refund Policy */}
    <li>
      <Link 
        to="/legal?section=refund" 
        className="hover:text-primary transition-colors flex items-center group"
      >
        <ArrowRight 
          size={14} 
          className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" 
        />
        Refund Policy
      </Link>
    </li>

  </ul>
</div>


            {/* Support Hub */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              <h4 className="text-white font-bold uppercase text-[11px] tracking-[0.2em] opacity-80">Support Hub</h4>

              <div className="p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/10 space-y-4">
                <a href="mailto:projecthubadm@gmail.com" className="flex items-center gap-3 text-sm text-gray-300 hover:text-primary transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Mail size={18} />
                  </div>
                  projecthubadm@gmail.com
                </a>

                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <ShieldCheck size={18} />
                  </div>
                  Expert support available
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
              © {currentYear} <span className="text-white">ProjectHub</span>. Crafted with 
              <Heart size={14} className="text-primary fill-primary" /> for modern creators.
            </p>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                Secure Payments
              </div>
              <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                Instant Assets
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Icon Animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        .animate-float {
          animation: float 2.8s ease-in-out infinite;
        }
      `}</style>

    </footer>
  );
};

export default Footer;
