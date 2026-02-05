import { Link } from "react-router-dom";
import { FaWallet, FaShieldAlt, FaBolt, FaMobileAlt } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Send, Receive & Manage Money Digitally</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Bangladesh's most trusted digital wallet. Fast, secure, and convenient payments for everyone.
            </p>
            <div className="space-x-4">
              <Link
                to="/register"
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                to="/about"
                className="inline-block border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Digital Wallet?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of satisfied users who trust Digital Wallet for their daily transactions.
          </p>
          <Link
            to="/register"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Create Your Account Now
          </Link>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: <FaBolt className="h-8 w-8 text-primary-600" />,
    title: "Instant Transfers",
    description: "Send and receive money instantly 24/7 with zero delays.",
  },
  {
    icon: <FaShieldAlt className="h-8 w-8 text-primary-600" />,
    title: "Bank-Level Security",
    description: "Your money is protected with advanced encryption and security protocols.",
  },
  {
    icon: <FaMobileAlt className="h-8 w-8 text-primary-600" />,
    title: "Easy to Use",
    description: "Simple interface that works perfectly on mobile and desktop.",
  },
];

export default Home;
