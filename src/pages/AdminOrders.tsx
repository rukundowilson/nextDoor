import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminLayout } from "../shared/components/AdminLayout";
import API_BASE_URL from "../config/apiConfig";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  description?: string;
}

interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  billingDetails: BillingDetails;
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "completed" | "received" | "cancelled" | "canceled";
  createdAt: string;
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const authChecked = useRef(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "processing" | "shipped" | "completed" | "cancelled">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const adminToken = localStorage.getItem("adminToken");
    const adminUser = localStorage.getItem("adminUser");

    if (!adminToken || !adminUser) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const parsedAdmin = JSON.parse(adminUser);
      if (parsedAdmin.role !== "admin") {
        navigate("/", { replace: true });
        return;
      }
      loadOrders(adminToken);
    } catch {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const loadOrders = async (adminToken: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders/admin/all`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        const allOrders = await response.json();
        const sortedOrders = Array.isArray(allOrders) 
          ? allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          : [];
        setOrders(sortedOrders);
        filterOrders(sortedOrders, "all", "");
        setCurrentPage(1);
      } else {
        console.error("Failed to fetch orders:", response.status);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = (ordersList: Order[], filter: string, search: string) => {
    let filtered = ordersList;

    // Status filter - normalize legacy values as needed
    if (filter === "processing") {
      filtered = filtered.filter((o) => (o.status === "processing" || o.status === "pending"));
    } else if (filter === "shipped") {
      filtered = filtered.filter((o) => o.status === "shipped" || o.status === "delivered");
    } else if (filter === "completed") {
      filtered = filtered.filter((o) => o.status === "completed" || o.status === "received");
    } else if (filter === "cancelled") {
      filtered = filtered.filter((o) => o.status === "cancelled" || o.status === "canceled");
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(searchLower) ||
          o.billingDetails.firstName.toLowerCase().includes(searchLower) ||
          o.billingDetails.lastName.toLowerCase().includes(searchLower) ||
          o.billingDetails.email.toLowerCase().includes(searchLower)
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: "all" | "processing" | "shipped" | "completed" | "cancelled") => {
    setSelectedFilter(filter);
    filterOrders(orders, filter, searchTerm);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterOrders(orders, selectedFilter, value);
  };

  const getStatusMetrics = () => {
    return {
      processing: orders.filter((o) => o.status === "processing" || o.status === "pending").reduce((sum, o) => sum + o.total, 0),
      shipped: orders.filter((o) => o.status === "shipped" || o.status === "delivered").reduce((sum, o) => sum + o.total, 0),
      completed: orders.filter((o) => o.status === "completed" || o.status === "received").reduce((sum, o) => sum + o.total, 0),
      cancelled: orders.filter((o) => o.status === "cancelled" || (o.status as any) === "canceled").reduce((sum, o) => sum + o.total, 0),
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return { bg: "bg-orange-100", text: "text-orange-700", badge: "bg-orange-500" };
      case "shipped":
      case "delivered":
        return { bg: "bg-cyan-100", text: "text-cyan-700", badge: "bg-cyan-500" };
      case "completed":
      case "received":
        return { bg: "bg-green-100", text: "text-green-700", badge: "bg-green-500" };
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-700", badge: "bg-red-500" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", badge: "bg-gray-500" };
    }
  };

  const getPaymentMethod = (order: Order) => {
    return order.billingDetails.email?.includes("visa")
      ? "Visa *0021"
      : order.billingDetails.email?.includes("bank")
      ? "Bank Transfer"
      : "COD";
  };

  const getFirstProduct = (order: Order) => {
    const p = order.items && order.items.length > 0 ? order.items[0] : null;
    if (!p) return { name: "Unknown", price: 0, image: undefined } as any;
    return {
      name: (p as any).name || (p as any).title || "Unknown",
      price: (p as any).price ?? 0,
      image: (p as any).image || (p as any).img || undefined,
    } as any;
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const metrics = getStatusMetrics();

  return (
    <AdminLayout title="Orders">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-blue-600 font-medium cursor-pointer">Dashboard</span>
          <span>/</span>
          <span className="font-medium text-gray-900">Orders</span>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Processing", value: metrics.processing, filter: "processing" },
            { label: "Shipped", value: metrics.shipped, filter: "shipped" },
            { label: "Completed", value: metrics.completed, filter: "completed" },
            { label: "Cancelled", value: metrics.cancelled, filter: "cancelled" },
          ].map((metric) => (
            <div
              key={metric.filter}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
              onClick={() => handleFilterChange(metric.filter as any)}
            >
              <p className="text-sm font-medium text-gray-600">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">${metric.value.toLocaleString()}</p>
              <p className="text-xs text-green-600 font-medium mt-2">10% ↑ +$10k today</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="space-y-6">
          {/* Filter Tabs */}
          <div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-4">
            {[
                { label: "All Status", value: "all" },
                { label: "Processing", value: "processing" },
                { label: "Shipped", value: "shipped" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
              ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleFilterChange(tab.value as any)}
                className={`px-4 py-2 whitespace-nowrap font-medium border-b-2 transition ${
                  selectedFilter === tab.value
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and View Options */}
          <div className="flex items-center gap-4 justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Show</span>
                <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : paginatedOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>No orders found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedOrders.map((order) => {
                const product = getFirstProduct(order);
                const statusColor = getStatusColor(order.status);
                const productPrice = (() => {
                  const p = product?.price;
                  if (typeof p === "number") return p;
                  const parsed = parseFloat(String(p ?? ""));
                  return Number.isFinite(parsed) ? parsed : 0;
                })();
                const normalizedStatus = order.status === "received" ? "completed" : order.status;
                const displayStatus =
                  normalizedStatus === "processing"
                    ? "Processing"
                    : normalizedStatus === "shipped" || normalizedStatus === "delivered"
                    ? "Shipping"
                    : normalizedStatus === "completed"
                    ? "Completed"
                    : (normalizedStatus === "cancelled" || (normalizedStatus as any) === "canceled")
                    ? "Cancelled"
                    : String(normalizedStatus).charAt(0).toUpperCase() + String(normalizedStatus).slice(1);

                return (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    role="button"
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
                  >
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded text-white ${statusColor.badge}`}
                      >
                        {displayStatus}
                      </span>
                      <span className="text-xs text-gray-500">1 minute ago</span>
                    </div>

                    {/* Product Section */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <span className="text-lg">📦</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">1 x ${productPrice.toFixed(2)}</p>
                          </div>
                      </div>
                      {order.items.length > 1 && (
                        <p className="text-xs text-gray-500 mt-2">+{order.items.length - 1} Product More...</p>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3 mb-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Customer</p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.billingDetails.firstName} {order.billingDetails.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Method</p>
                        <p className="text-sm text-gray-900">
                          {getPaymentMethod(order)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Total</p>
                        <p className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Order ID</p>
                        <p className="text-xs text-gray-900 font-mono">{order.id.substring(0, 8).toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg font-medium transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-900"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
          {filteredOrders.length} orders
        </div>
      </div>
    </AdminLayout>
  );
}
