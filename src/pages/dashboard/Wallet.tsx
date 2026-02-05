import { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import WalletBalance from "@/components/wallet/WalletBalance";
import SendMoneyForm from "@/components/wallet/SendMoneyForm";
import CashOutForm from "@/components/wallet/CashOutForm";
import TopUpForm from "@/components/wallet/TopUpForm";
import AgentCashInForm from "@/components/wallet/AgentCashInForm";
import { FaExchangeAlt, FaPaperPlane, FaCreditCard, FaUserFriends, FaHistory } from "react-icons/fa";

const WalletPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"send" | "cashout" | "topup" | "agent">(
    user?.role === "agent" ? "agent" : "send",
  );

  const userTabs = [
    { id: "send", label: "Send Money", icon: <FaPaperPlane /> },
    { id: "cashout", label: "Cash Out", icon: <FaExchangeAlt /> },
    { id: "topup", label: "Top Up", icon: <FaCreditCard /> },
  ];

  const agentTabs = [
    { id: "agent", label: "Cash In", icon: <FaUserFriends /> },
    { id: "send", label: "Send Money", icon: <FaPaperPlane /> },
  ];

  const tabs = user?.role === "agent" ? agentTabs : userTabs;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
        <p className="text-gray-600 mt-2">Manage your digital wallet transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Balance and Tabs */}
        <div className="lg:col-span-1 space-y-6">
          <WalletBalance />

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id ? "bg-primary-100 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}

              <button
                onClick={() => {
                  /* Navigate to transactions page */
                }}
                className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FaHistory className="mr-3" />
                <span className="font-medium">Transaction History</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Active Form */}
        <div className="lg:col-span-2">
          {activeTab === "send" && <SendMoneyForm />}
          {activeTab === "cashout" && <CashOutForm />}
          {activeTab === "topup" && <TopUpForm />}
          {activeTab === "agent" && <AgentCashInForm />}
        </div>
      </div>

      {/* Recent Transactions Preview */}
      <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          <button className="text-primary-600 hover:text-primary-800 font-medium">View All</button>
        </div>

        <div className="text-center py-12 text-gray-500">
          <FaHistory className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No recent transactions</p>
          <p className="text-sm mt-2">Your transaction history will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
