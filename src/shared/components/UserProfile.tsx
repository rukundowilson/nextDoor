import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Package, Truck, CheckCircle } from "lucide-react";
import type { Order } from "../services/axios";
import { getUserOrders } from "../services/axios";
import { AccountSidebar } from "./AccountSidebar";

export function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    // Load user from localStorage
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("userToken");
    
    if (!userStr || !token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      
      // Fetch user orders
      const fetchOrders = async () => {
        const userOrders = await getUserOrders(token);
        // Ensure newest orders appear first (last created -> first row)
        const sorted = Array.isArray(userOrders)
          ? [...userOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          : userOrders;
        setOrders(sorted as any);
        setIsLoading(false);
      };
      
      fetchOrders();
    } catch (error) {
      console.error("Error loading profile:", error);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleShopNow = () => {
    navigate("/shop");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "processing":
        return "blue";
      case "shipped":
        return "purple";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-purple-600" />;
      case "processing":
        return <Package className="w-4 h-4 text-blue-600" />;
      default:
        return <Package className="w-4 h-4 text-orange-600" />;
    }
  };

  // Paginate orders
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <AccountSidebar />

      <div className="flex-1">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleShopNow}
              className="lg:hidden flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Continue Shopping
            </button>

            <div className="bg-white rounded-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {user.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status === "delivered").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status !== "delivered").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-gray-600">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p>No orders yet. <button onClick={handleShopNow} className="text-blue-600 hover:text-blue-700 font-semibold">Start shopping</button></p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200">
                  {paginatedOrders.map((order) => (
                    <div key={order.id} className="border-b border-gray-200">
                      {/* Order Row - Clickable to view details */}
                      <button
                        onClick={() => navigate(`/order/${order.id}`)}
                        className="w-full px-6 py-4 hover:bg-gray-50 transition text-left flex items-center justify-between"
                      >
                        <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                          <div>
                            <p className="text-sm font-medium text-blue-600 hover:text-blue-700">Order #{order.id.substring(0, 8)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit bg-${getStatusColor(order.status)}-50 text-${getStatusColor(order.status)}-700`}>
                              {getStatusIcon(order.status)}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
