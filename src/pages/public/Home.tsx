import { Link } from "react-router-dom";
import { FaWallet, FaShieldAlt, FaBolt, FaMobileAlt, FaQrcode, FaGlobe, FaLock, FaChartLine } from "react-icons/fa";
import { useState, useEffect } from "react";

const Home = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-90"
          style={{
            transform: `translateY(${scrollPosition * 0.5}px)`,
          }}
        ></div>

        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div
            className="inline-block mb-6 p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            style={{
              transform: `translateY(${scrollPosition * 0.2}px)`,
            }}
          >
            <span className="text-white/90 text-sm font-semibold">🚀 The Future of Digital Payments</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight"
            style={{
              transform: `translateY(${scrollPosition * 0.3}px)`,
            }}
          >
            Your Digital Wallet,
            <span className="block mt-2">Reimagined</span>
          </h1>

          <p
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{
              transform: `translateY(${scrollPosition * 0.4}px)`,
            }}
          >
            Experience lightning-fast, secure, and seamless digital payments. Join Bangladesh's fastest-growing
            financial platform.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            style={{
              transform: `translateY(${scrollPosition * 0.5}px)`,
            }}
          >
            <Link
              to="/register"
              className="group relative px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link
              to="/demo"
              className="group px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <FaQrcode className="group-hover:rotate-12 transition-transform" />
                Try Demo
              </span>
            </Link>
          </div>

          {/* Stats counter */}
          <div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            style={{
              transform: `translateY(${scrollPosition * 0.6}px)`,
            }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating phone mockup */}
        <div
          className="absolute bottom-0 right-10 hidden lg:block"
          style={{
            transform: `translateY(${scrollPosition * -0.2}px)`,
          }}
        >
          <div className="relative w-64 h-[512px]">
            {" "}
            {/* Fixed height - removed h-128 */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-purple-500 rounded-[3rem] shadow-2xl p-4">
              <div className="bg-black/20 rounded-[2.5rem] h-full p-2">
                <div className="bg-gradient-to-br from-blue-100 to-white rounded-[2rem] h-full p-4 flex flex-col items-center justify-center">
                  <div className="w-12 h-1 bg-gray-300 rounded-full mb-8"></div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaWallet className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-lg font-bold text-gray-800">৳ 5,420.50</div>
                    <div className="text-gray-500 text-sm">Available Balance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with staggered animation */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              ✨ WHY CHOOSE US
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Modern Bangladesh
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've reimagined digital payments with features that matter to you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <span className="text-blue-600 text-sm font-semibold group-hover:underline inline-flex items-center gap-1">
                      Learn more
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        {/* Fixed background pattern - removed invalid URL */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                🔐 SECURITY FIRST
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Your Money is{" "}
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Protected
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                We use military-grade encryption, multi-factor authentication, and real-time monitoring to keep your
                funds safe 24/7.
              </p>

              <div className="space-y-6">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full flex flex-col justify-center">
                  <div className="text-center">
                    <FaLock className="h-16 w-16 text-green-400 mx-auto mb-6 animate-pulse" />
                    <h3 className="text-2xl font-bold mb-4">Protected by</h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <div className="px-4 py-2 bg-white/5 rounded-lg">256-bit SSL</div>
                      <div className="px-4 py-2 bg-white/5 rounded-lg">2FA</div>
                      <div className="px-4 py-2 bg-white/5 rounded-lg">Biometric</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-white rounded-3xl p-12 shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ready to Transform Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Digital Life?
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied users who trust us for their daily transactions. No hidden fees, no
                complicated processes.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/register"
                  className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  <span>Start Free Trial</span>
                  <span className="group-hover:rotate-90 transition-transform">🎯</span>
                </Link>

                <Link
                  to="/contact"
                  className="group px-10 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  <span>Contact Sales</span>
                  <span className="group-hover:translate-x-1 transition-transform">📞</span>
                </Link>
              </div>

              <p className="mt-8 text-gray-500 text-sm">No credit card required • Free for 30 days • Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <FaWallet className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">DigitalWallet</span>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Bangladesh's premier digital payment platform. Making financial transactions simple, secure, and
              accessible for everyone.
            </p>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} DigitalWallet. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Counter Component - Fixed
const Counter = ({ end, suffix }: { end: number; suffix: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Fixed features array
const features = [
  {
    icon: <FaBolt className="h-8 w-8 text-white" />,
    title: "Lightning Fast",
    description: "Instant transfers 24/7 with zero waiting time. Send money in seconds, not hours.",
  },
  {
    icon: <FaShieldAlt className="h-8 w-8 text-white" />,
    title: "Bank-Level Security",
    description: "Military-grade encryption, 2FA, and biometric authentication keep your funds safe.",
  },
  {
    icon: <FaMobileAlt className="h-8 w-8 text-white" />,
    title: "Mobile First",
    description: "Beautiful, intuitive app designed specifically for mobile users in Bangladesh.",
  },
  {
    icon: <FaGlobe className="h-8 w-8 text-white" />,
    title: "Nationwide Access",
    description: "Available across all 64 districts with support for all major banks and mobile operators.",
  },
];

// Fixed security features array
const securityFeatures = [
  {
    icon: <FaLock className="h-6 w-6 text-green-400" />,
    title: "End-to-End Encryption",
    description: "Your data is encrypted at all stages with 256-bit SSL technology.",
  },
  {
    icon: <FaShieldAlt className="h-6 w-6 text-blue-400" />,
    title: "Real-time Monitoring",
    description: "AI-powered fraud detection monitors transactions 24/7 for suspicious activity.",
  },
  {
    icon: <FaChartLine className="h-6 w-6 text-purple-400" />,
    title: "Insurance Protected",
    description: "All deposits are insured up to ৳1,00,000 for your peace of mind.",
  },
];

// Fixed stats array
const stats = [
  { value: 500, suffix: "K+", label: "Happy Users" },
  { value: 50, suffix: "M+", label: "Transactions" },
  { value: 64, suffix: "", label: "Districts Covered" },
  { value: 99.9, suffix: "%", label: "Uptime" },
];

export default Home;
