import { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaMobileAlt,
  FaShieldAlt,
  FaClock,
  FaUsers,
  FaChartLine,
  FaCreditCard,
  FaQrcode,
  FaGlobeEurope,
  FaBuilding,
  FaLock,
  FaSync,
  FaHandHoldingUsd,
  FaUniversity,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { TbTransfer } from "react-icons/tb";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <TbTransfer className="h-8 w-8" />,
      title: "Instant Money Transfer",
      description: "Send and receive money instantly between any Digital Wallet users. No delays, no hidden fees.",
      details:
        "Real-time processing with full transaction encryption. Supports both domestic and international transfers.",
      color: "from-blue-600 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <FaMobileAlt className="h-8 w-8" />,
      title: "Mobile & Utilities",
      description: "Top up any mobile operator and pay utility bills instantly with competitive rates.",
      details: "Support for all major telecom providers and utility services across Bangladesh.",
      color: "from-emerald-600 to-green-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
    },
    {
      icon: <FaShieldAlt className="h-8 w-8" />,
      title: "Bank-Level Security",
      description: "Military-grade encryption with biometric authentication and real-time fraud detection.",
      details: "End-to-end encryption, 2FA, and AI-powered security monitoring 24/7.",
      color: "from-violet-600 to-purple-500",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
      borderColor: "border-violet-200",
    },
    {
      icon: <FaClock className="h-8 w-8" />,
      title: "24/7 Availability",
      description: "Access your wallet and make transactions anytime, from anywhere in the world.",
      details: "Round-the-clock customer support and uninterrupted service availability.",
      color: "from-amber-600 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
    },
    {
      icon: <FaUsers className="h-8 w-8" />,
      title: "Agent Network",
      description: "Comprehensive network of certified agents for seamless cash-in and cash-out services.",
      details: "Over 10,000 agents nationwide with verified credentials and regular audits.",
      color: "from-rose-600 to-pink-500",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
      borderColor: "border-rose-200",
    },
    {
      icon: <FaChartLine className="h-8 w-8" />,
      title: "Smart Analytics",
      description: "Advanced transaction analytics with detailed insights and spending patterns.",
      details: "Interactive dashboards, exportable reports, and personalized financial insights.",
      color: "from-indigo-600 to-blue-500",
      bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
      borderColor: "border-indigo-200",
    },
    {
      icon: <FaCreditCard className="h-8 w-8" />,
      title: "Virtual Cards",
      description: "Create virtual debit cards for secure online shopping and subscriptions.",
      details: "Instant card generation with customizable limits and real-time transaction monitoring.",
      color: "from-teal-600 to-emerald-500",
      bgColor: "bg-gradient-to-br from-teal-50 to-emerald-50",
      borderColor: "border-teal-200",
    },
    {
      icon: <FaQrcode className="h-8 w-8" />,
      title: "QR Payments",
      description: "Pay merchants instantly using QR codes with enhanced security features.",
      details: "Dynamic QR generation, one-tap payments, and transaction verification.",
      color: "from-fuchsia-600 to-purple-500",
      bgColor: "bg-gradient-to-br from-fuchsia-50 to-purple-50",
      borderColor: "border-fuchsia-200",
    },
    {
      icon: <FaGlobeEurope className="h-8 w-8" />,
      title: "International Transfers",
      description: "Send money abroad with competitive exchange rates and low fees.",
      details: "Support for 50+ countries with real-time exchange rates and tracking.",
      color: "from-sky-600 to-cyan-500",
      bgColor: "bg-gradient-to-br from-sky-50 to-cyan-50",
      borderColor: "border-sky-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px),
                            linear-gradient(to bottom, #64748b 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">PREMIUM FEATURES</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
            Elegant{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Tools
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience sophisticated financial services designed with European elegance and Bangladeshi convenience in
            mind.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
              className={`relative group cursor-pointer transition-all duration-500 ${activeFeature === index ? "z-10" : ""}`}
            >
              {/* Gradient Border Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500`}
              ></div>

              {/* Main Card */}
              <div
                className={`relative ${feature.bgColor} rounded-2xl p-8 border ${feature.borderColor} transition-all duration-500 h-full`}
              >
                {/* Icon Container */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>

                  {/* Expandable Details */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: activeFeature === index ? "auto" : 0,
                      opacity: activeFeature === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-gray-500 pt-4 border-t border-gray-200">{feature.details}</p>
                  </motion.div>

                  {/* Learn More Link */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      <span>Explore feature</span>
                      <span
                        className={`group-hover:translate-x-1 transition-transform ${activeFeature === index ? "translate-x-1" : ""}`}
                      >
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-32"
        >
          <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundSize: "200px",
                }}
              ></div>
            </div>

            <div className="relative z-10 text-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: "99.9%", label: "Uptime", icon: <FaSync className="h-6 w-6" /> },
                  { value: "10K+", label: "Agents", icon: <FaUsers className="h-6 w-6" /> },
                  { value: "50+", label: "Banks", icon: <FaUniversity className="h-6 w-6" /> },
                  { value: "256-bit", label: "Encryption", icon: <FaLock className="h-6 w-6" /> },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
                      <div className="text-white/80">{stat.icon}</div>
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-32 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Experience{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                European Elegance
              </span>{" "}
              in Digital Finance
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Sophisticated features, elegant design, and unparalleled security - all crafted to provide you with the
              ultimate digital wallet experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2">
                <span>Get Started</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button className="group px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center gap-2">
                <span>Request Demo</span>
                <span className="group-hover:rotate-12 transition-transform">🎯</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
