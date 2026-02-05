import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I create a Digital Wallet account?",
      answer:
        "You can create an account by downloading our app or visiting our website. Click on 'Register' and provide your phone number, name, and create a secure password. You'll receive a verification code to complete the registration.",
    },
    {
      question: "Is Digital Wallet free to use?",
      answer:
        "Yes, creating and maintaining a Digital Wallet account is completely free. Some transactions may have minimal fees which are clearly displayed before you confirm any payment.",
    },
    {
      question: "How do I add money to my wallet?",
      answer:
        "You can add money through our agent network, bank transfer, or linked debit/credit cards. Visit any authorized agent or use the 'Add Money' option in the app to see available methods.",
    },
    {
      question: "How long do transactions take?",
      answer:
        "Most transactions are instant. Sending money to another Digital Wallet user happens immediately. Bank transfers may take 1-2 business days depending on your bank.",
    },
    {
      question: "Is my money safe with Digital Wallet?",
      answer:
        "Yes, we use bank-level security including 256-bit encryption, two-factor authentication, and regular security audits. Your funds are also insured according to regulatory requirements.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "Click on 'Forgot Password' on the login screen. We'll send a verification code to your registered phone number. Use this code to reset your password securely.",
    },
    {
      question: "Can I use Digital Wallet for business?",
      answer:
        "Yes, we offer business accounts with additional features. Contact our business support team to learn about business solutions and volume discounts.",
    },
    {
      question: "How do I become an agent?",
      answer:
        "Apply through our agent portal with required documents. Once approved, you'll receive training and can start offering cash-in/cash-out services to earn commissions.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Find answers to common questions about Digital Wallet</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                <span className="ml-4 flex-shrink-0">
                  {openIndex === index ? (
                    <FaChevronUp className="h-5 w-5 text-primary-600" />
                  ) : (
                    <FaChevronDown className="h-5 w-5 text-primary-600" />
                  )}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
