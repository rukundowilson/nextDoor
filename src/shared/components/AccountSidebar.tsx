import { useNavigate } from "react-router-dom";

interface AccountSidebarProps {
  showBackToOrders?: boolean;
}

export function AccountSidebar({ showBackToOrders = false }: AccountSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 flex-col p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-8">My Account</h2>
      
      <nav className="space-y-3 flex-1">
        {showBackToOrders && (
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition font-medium"
          >
            Back to Orders
          </button>
        )}
        <button
          onClick={() => navigate("/shop")}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition font-medium"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
        >
          Profile
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
        >
          Settings
        </button>
      </nav>
      
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
      >
        Logout
      </button>
    </div>
  );
}
