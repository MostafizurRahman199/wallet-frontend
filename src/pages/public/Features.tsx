import { FaMoneyBillWave, FaMobileAlt, FaShieldAlt, FaClock, FaUsers, FaChartLine } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaMoneyBillWave className="h-10 w-10 text-primary-600" />,
      title: "Send & Receive Money",
      description: "Instant money transfer to any Digital Wallet user with just a phone number.",
    },
    {
      icon: <FaMobileAlt className="h-10 w-10 text-primary-600" />,
      title: "Mobile Recharge",
      description: "Top up any mobile operator instantly with competitive rates.",
    },
    {
      icon: <FaShieldAlt className="h-10 w-10 text-primary-600" />,
      title: "Secure Transactions",
      description: "Bank-level security with encryption and two-factor authentication.",
    },
    {
      icon: <FaClock className="h-10 w-10 text-primary-600" />,
      title: "24/7 Availability",
      description: "Access your wallet and make transactions anytime, anywhere.",
    },
    {
      icon: <FaUsers className="h-10 w-10 text-primary-600" />,
      title: "Agent Network",
      description: "Wide network of agents for cash-in and cash-out services.",
    },
    {
      icon: <FaChartLine className="h-10 w-10 text-primary-600" />,
      title: "Transaction History",
      description: "Detailed records of all your transactions with advanced filtering.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Features</h1>
          <p className="text-xl text-gray-600">Everything you need for modern digital transactions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
