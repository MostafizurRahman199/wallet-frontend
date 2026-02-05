import { useState } from "react";
import { FaFilter, FaCalendarAlt, FaSearch } from "react-icons/fa";

interface TransactionFiltersProps {
  onFilterChange: (filters: {
    type?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
  }) => void;
}

const TransactionFilters = ({ onFilterChange }: TransactionFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const transactionTypes = [
    { value: "", label: "All Types" },
    { value: "DEPOSIT", label: "Deposit" },
    { value: "WITHDRAW", label: "Withdraw" },
    { value: "SEND_MONEY", label: "Send Money" },
    { value: "CASH_IN", label: "Cash In" },
    { value: "CASH_OUT", label: "Cash Out" },
    { value: "COMMISSION", label: "Commission" },
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange({
      type: filters.type || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      minAmount: filters.minAmount ? parseFloat(filters.minAmount) : undefined,
      maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : undefined,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      type: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FaFilter className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {transactionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaCalendarAlt className="inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaCalendarAlt className="inline mr-1" />
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount (৳)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount (৳)</label>
              <input
                type="number"
                placeholder="50000"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 flex items-center"
            >
              <FaSearch className="mr-2" />
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
