import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaRocket,
  FaUsers,
  FaGlobeAsia,
  FaShieldAlt,
  FaLightbulb,
  FaHandshake,
  FaChartLine,
  FaAward,
  FaHeart,
  FaMobileAlt,
  FaBolt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const About = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-blue-200 mb-6"
          >
            <FaRocket className="text-blue-500 animate-pulse" />
            <span className="text-blue-600 font-semibold">THE FUTURE OF FINANCE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent leading-tight"
          >
            Redefining Digital
            <span className="block mt-2">Finance in Bangladesh</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            We're on a mission to make financial services accessible, secure, and empowering for every Bangladeshi. Join
            us in building a financially inclusive future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/register"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-2"
            >
              <span>Join Our Journey</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a
              href="#story"
              className="group px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 inline-flex items-center gap-2"
            >
              <span>Our Story</span>
              <span className="group-hover:rotate-180 transition-transform">📖</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaHeart className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Journey Begins</h2>
                  <div className="space-y-6 text-gray-600 text-lg">
                    <p>
                      Founded in 2024, Digital Wallet was born from a simple yet powerful vision: to make financial
                      transactions accessible, secure, and convenient for every Bangladeshi. We saw the potential for
                      digital transformation in Bangladesh's financial sector and set out to bridge the gap between
                      traditional banking and modern convenience.
                    </p>
                    <p>
                      Our journey started with a team of passionate developers, financial experts, and visionaries who
                      believed that technology could solve real-world problems. We wanted to create a platform that
                      would empower individuals and businesses alike, regardless of their location or financial
                      background.
                    </p>
                    <p>
                      Today, we're proud to be at the forefront of Bangladesh's digital revolution, serving thousands of
                      satisfied users and continuously innovating to meet their evolving needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative group transition-all duration-500 ${hoveredCard === 1 ? "z-10" : ""}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <FaLightbulb className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To democratize digital payments and financial services, making them available to every citizen through
                  innovative technology and user-friendly solutions. We're committed to breaking down barriers and
                  creating opportunities for financial growth and independence.
                </p>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      Accessibility
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      Innovation
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      Empowerment
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative group transition-all duration-500 ${hoveredCard === 2 ? "z-10" : ""}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <FaGlobeAsia className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To become Bangladesh's leading digital financial ecosystem, empowering individuals and businesses with
                  seamless, secure, and inclusive financial services. We envision a future where every Bangladeshi has
                  equal access to modern financial tools and opportunities for growth.
                </p>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                      Leadership
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                      Inclusion
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                      Transformation
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Core Values
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-500 h-full">
                  <div className="absolute top-6 right-6 opacity-10">{value.icon}</div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <span className="text-sm text-blue-600 font-semibold flex items-center gap-2">
                      Learn more
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-24 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Building the Future,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Together
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the numbers that drive our passion and commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <FaHandshake className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Join Our Mission?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Be part of the digital revolution that's transforming Bangladesh's financial landscape. Together, we can
                build a more inclusive and prosperous future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  <span>Start Your Journey</span>
                  <span className="group-hover:translate-x-1 transition-transform">🚀</span>
                </Link>
                <Link
                  to="/contact"
                  className="group px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  <span>Contact Us</span>
                  <span className="group-hover:rotate-12 transition-transform">💬</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Counter Component
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

const values = [
  {
    icon: <FaUsers className="h-8 w-8 text-white" />,
    title: "Customer First",
    description: "We put our users at the heart of everything we do, designing solutions that truly meet their needs.",
  },
  {
    icon: <FaShieldAlt className="h-8 w-8 text-white" />,
    title: "Security & Trust",
    description: "We implement the highest security standards to protect our users' data and transactions.",
  },
  {
    icon: <FaBolt className="h-8 w-8 text-white" />,
    title: "Innovation",
    description: "We constantly explore new technologies to improve and expand our services.",
  },
  {
    icon: <FaMobileAlt className="h-8 w-8 text-white" />,
    title: "Accessibility",
    description: "We believe financial services should be available to everyone, everywhere.",
  },
  {
    icon: <FaChartLine className="h-8 w-8 text-white" />,
    title: "Excellence",
    description: "We strive for perfection in every aspect of our service and user experience.",
  },
  {
    icon: <FaAward className="h-8 w-8 text-white" />,
    title: "Integrity",
    description: "We operate with transparency, honesty, and ethical principles in all our dealings.",
  },
];

const stats = [
  { value: 50, suffix: "+", label: "Team Members" },
  { value: 500, suffix: "K+", label: "Active Users" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
  { value: 24, suffix: "/7", label: "Support Available" },
];

export default About;
