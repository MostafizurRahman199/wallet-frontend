const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Digital Wallet</h1>
          <p className="text-xl text-gray-600">Revolutionizing digital payments in Bangladesh</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2024, Digital Wallet was created with a simple mission: to make financial transactions
            accessible, secure, and convenient for every Bangladeshi.
          </p>
          <p className="text-gray-600">
            We believe that everyone should have access to modern financial tools, regardless of their location or
            financial background. Our platform bridges the gap between traditional banking and digital convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Our Mission</h3>
            <p className="text-gray-600">
              To democratize digital payments and financial services, making them available to every citizen through
              innovative technology and user-friendly solutions.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Our Vision</h3>
            <p className="text-gray-600">
              To become Bangladesh's leading digital financial ecosystem, empowering individuals and businesses with
              seamless, secure, and inclusive financial services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
