import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  Bell,
  HelpCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts, getAllAdminOrders } from "../shared/services/axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const authChecked = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const adminToken = localStorage.getItem("adminToken");
    const adminUser = localStorage.getItem("adminUser");
    
    if (!adminToken || !adminUser) {
      navigate("/admin/login", { replace: true });
      return;
    }

    try {
      const parsedAdmin = JSON.parse(adminUser);
      if (parsedAdmin.role !== "admin") {
        navigate("/admin/login", { replace: true });
        return;
      }
      setAdmin(parsedAdmin);
    } catch {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
    enabled: !!admin,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
    enabled: !!admin,
  });

  // Fetch all orders - mock data for now since API might not return all
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        const orders = await getAllAdminOrders(token || "");
        setAllOrders(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setAllOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (admin) {
      fetchAllOrders();
    }
  }, [admin]);

  // Calculate revenue metrics from completed orders (only when user marks as received)
  const completedOrders = allOrders.filter((order: any) => 
    order.status === "completed" || order.status === "received"
  );
  
  const totalRevenue = completedOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  const totalOrders = allOrders.length; // All orders count
  const totalCompleted = completedOrders.length; // Only truly completed orders (user confirmed receipt)
  const avgOrderValue = totalCompleted > 0 ? totalRevenue / totalCompleted : 0;
  
  // Calculate average from all orders if no completed orders
  const avgOrderValueAll = totalOrders > 0 ? allOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0) / totalOrders : 0;

  // Calculate sold quantities per product from orders
  const productSales: Record<string, { quantity: number; price: number; name: string }> = {};
  
  allOrders.forEach((order: any) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        const productKey = item.productId || item.name;
        if (!productSales[productKey]) {
          productSales[productKey] = {
            quantity: 0,
            price: item.price || 0,
            name: item.name || "Unknown Product"
          };
        }
        productSales[productKey].quantity += item.quantity || 1;
      });
    }
  });

  // Sort products by quantity sold (descending)
  const topSellingProducts = Object.entries(productSales)
    .map(([key, data]) => ({
      id: key,
      ...data
    }))
    .sort((a, b) => b.quantity - a.quantity);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  // const _stats = [
  //   {
  //     label: "Total Products",
  //     value: products.length,
  //     icon: Package,
  //     color: "bg-blue-500",
  //     lightColor: "bg-blue-100",
  //   },
  //   {
  //     label: "Total Categories",
  //     value: categories.length,
  //     icon: FolderOpen,
  //     color: "bg-purple-500",
  //     lightColor: "bg-purple-100",
  //   },
  //   {
  //     label: "Total Orders",
  //     value: "0",
  //     icon: ShoppingCart,
  //     color: "bg-orange-500",
  //     lightColor: "bg-orange-100",
  //   },
  //   {
  //     label: "Total Users",
  //     value: "0",
  //     icon: Users,
  //     color: "bg-green-500",
  //     lightColor: "bg-green-100",
  //   },
  // ];

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: FolderOpen, label: "Categories", path: "/admin/categories" },
    { icon: Package, label: "Products", path: "/admin/products-list" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  // const _quickActions = [
  //   {
  //     label: "Add Product",
  //     description: "Create a new product",
  //     icon: Plus,
  //     color: "bg-blue-600",
  //     action: () => navigate("/admin/categories"),
  //   },
  //   {
  //     label: "Add Category",
  //     description: "Create a new category",
  //     icon: FolderOpen,
  //     color: "bg-purple-600",
  //     action: () => navigate("/admin/categories"),
  //   },
  //   {
  //     label: "View Orders",
  //     description: "Manage customer orders",
  //     icon: ShoppingCart,
  //     color: "bg-orange-600",
  //     action: () => navigate("/admin/orders"),
  //   },
  //   {
  //     label: "View Analytics",
  //     description: "Check performance stats",
  //     icon: TrendingUp,
  //     color: "bg-green-600",
  //     action: () => navigate("/admin/analytics"),
  //   },
  // ];

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white text-gray-900 transition-all duration-300 flex flex-col border-r border-gray-200`}
      >
        {/* Logo/Header */}
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
              ND
            </div>
            {sidebarOpen && <span className="font-bold text-lg text-gray-900">nextDoor</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-2">
            {menuItems.map((item, idx) => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    idx === 0
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-3 space-y-2">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            title="Help Center"
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Help Center</span>}
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            title="Settings"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP HEADER */}
        <div className="bg-transparent px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 pl-4 pr-4 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition bg-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{admin.name}</p>
                <p className="text-xs text-gray-500">{admin.email}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {admin.name?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">
            {/* Welcome Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome Back {admin.name}!
                </h2>
                <p className="text-gray-600 mt-2">
                  Here's a summary of your performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Target & Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Revenue Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">TOTAL REVENUE</h3>
                  <button className="text-gray-400 hover:text-gray-600">⋮</button>
                </div>
                <div className="mb-4">
                  <p className="text-4xl font-bold text-gray-900">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" /> {totalCompleted} 
                    </span>
                    <span className="text-gray-500 text-sm">confirmed received</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  💰 {totalCompleted} orders confirmed as received by customers
                </div>
                {/* Simple Bar Chart Representation */}
                <div className="flex items-end gap-1 h-16 bg-gray-50 rounded p-3">
                  <div className="flex-1 bg-gradient-to-t from-green-400 to-green-300 rounded-sm" style={{height: '40%'}}></div>
                  <div className="flex-1 bg-gradient-to-t from-green-400 to-green-300 rounded-sm" style={{height: '60%'}}></div>
                  <div className="flex-1 bg-gradient-to-t from-green-400 to-green-300 rounded-sm" style={{height: '50%'}}></div>
                  <div className="flex-1 bg-gradient-to-t from-green-400 to-green-300 rounded-sm" style={{height: '70%'}}></div>
                  <div className="flex-1 bg-gradient-to-t from-green-400 to-green-300 rounded-sm" style={{height: '55%'}}></div>
                </div>
              </div>

              {/* Total Orders Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">TOTAL ORDERS</h3>
                  <button className="text-gray-400 hover:text-gray-600">⋮</button>
                </div>
                <div className="mb-4">
                  <p className="text-4xl font-bold text-gray-900">{totalOrders}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-blue-600 font-semibold flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" /> {totalCompleted} 
                    </span>
                    <span className="text-gray-500 text-sm">completed</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  📦 {totalOrders - totalCompleted} pending
                </div>
                {/* Simple Line Chart Representation */}
                <div className="h-16 bg-gray-50 rounded p-3 flex items-end gap-0.5">
                  <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                    <polyline
                      points="0,60 30,45 60,50 90,30 120,40 150,25 180,35 210,20 240,30 270,15 300,25"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              {/* Avg Order Value Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">AVG ORDER VALUE</h3>
                  <button className="text-gray-400 hover:text-gray-600">⋮</button>
                </div>
                <div className="mb-4">
                  <p className="text-4xl font-bold text-gray-900">${(avgOrderValue > 0 ? avgOrderValue : avgOrderValueAll).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`font-semibold flex items-center gap-1 ${avgOrderValue > 100 ? 'text-green-600' : 'text-orange-600'}`}>
                      {avgOrderValue > 100 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {totalCompleted > 0 ? `${totalCompleted} orders` : `${totalOrders} orders`}
                    </span>
                    <span className="text-gray-500 text-sm">average value</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  📊 {totalCompleted > 0 ? `${totalCompleted} completed orders` : `${totalOrders} total orders`}
                </div>
                {/* Simple Area Chart */}
                <div className="h-16 bg-gray-50 rounded p-3">
                  <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#f59e0b', stopOpacity: 0.3}} />
                        <stop offset="100%" style={{stopColor: '#f59e0b', stopOpacity: 0}} />
                      </linearGradient>
                    </defs>
                    <polygon points="0,80 0,40 30,35 60,45 90,30 120,38 150,25 180,35 210,20 240,30 270,15 300,25 300,80" fill="url(#grad1)" />
                    <polyline
                      points="0,40 30,35 60,45 90,30 120,38 150,25 180,35 210,20 240,30 270,15 300,25"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Revenue Breakdown */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-600">Revenue</h3>
                  <p className="text-xs text-gray-500 mt-1">Based on sources</p>
                </div>
                
                {/* Revenue Metrics by Channel */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-700">Website</p>
                      <p className="text-2xl font-bold text-gray-900">$75,000</p>
                      <p className="text-xs text-green-600 mt-1">100% ↑</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mt-1 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-700">E-Commerce</p>
                      <p className="text-2xl font-bold text-gray-900">$10,000</p>
                      <p className="text-xs text-green-600 mt-1">56% ↑</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mt-1 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-700">Offline Store</p>
                      <p className="text-2xl font-bold text-gray-900">$1,232</p>
                      <p className="text-xs text-red-600 mt-1">5% ↓</p>
                    </div>
                  </div>
                </div>

                {/* Channel Breakdown List */}
                <div className="mb-8 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="text-gray-700">Website</span>
                    </div>
                    <span className="font-semibold text-gray-900">$780.32</span>
                    <span className="text-gray-500">↔</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      <span className="text-gray-700">E-Commerce</span>
                    </div>
                    <span className="font-semibold text-gray-900">$328.22</span>
                    <span className="text-gray-500">↔</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      <span className="text-gray-700">Offline Store</span>
                    </div>
                    <span className="font-semibold text-gray-900">$450.90</span>
                    <span className="text-gray-500">↔</span>
                  </div>
                </div>

                {/* Stacked Bar Chart */}
                <div className="space-y-3">
                  {/* Y-axis labels */}
                  <div className="flex items-end gap-2">
                    <div className="w-8 text-right text-xs text-gray-500 space-y-3">
                      <div>$2.5k</div>
                      <div>$2k</div>
                      <div>$1.5k</div>
                      <div>$1k</div>
                      <div>$0.5k</div>
                      <div>$0</div>
                    </div>

                    {/* Chart Bars */}
                    <div className="flex-1 flex items-end gap-1 h-48">
                      {/* Jan */}
                      <div className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex flex-col-reverse gap-0">
                          <div className="bg-purple-500 w-full" style={{height: '45%'}}></div>
                          <div className="bg-yellow-400 w-full" style={{height: '30%'}}></div>
                          <div className="bg-orange-400 w-full" style={{height: '20%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1">JAN</span>
                      </div>

                      {/* Feb */}
                      <div className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex flex-col-reverse gap-0">
                          <div className="bg-purple-500 w-full" style={{height: '40%'}}></div>
                          <div className="bg-yellow-400 w-full" style={{height: '35%'}}></div>
                          <div className="bg-orange-400 w-full" style={{height: '18%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1">FEB</span>
                      </div>

                      {/* Mar */}
                      <div className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex flex-col-reverse gap-0">
                          <div className="bg-purple-500 w-full" style={{height: '52%'}}></div>
                          <div className="bg-yellow-400 w-full" style={{height: '28%'}}></div>
                          <div className="bg-orange-400 w-full" style={{height: '15%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1">MAR</span>
                      </div>

                      {/* Apr */}
                      <div className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex flex-col-reverse gap-0">
                          <div className="bg-purple-500 w-full" style={{height: '48%'}}></div>
                          <div className="bg-yellow-400 w-full" style={{height: '32%'}}></div>
                          <div className="bg-orange-400 w-full" style={{height: '16%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1">APR</span>
                      </div>

                      {/* May */}
                      <div className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex flex-col-reverse gap-0">
                          <div className="bg-purple-500 w-full" style={{height: '55%'}}></div>
                          <div className="bg-yellow-400 w-full" style={{height: '25%'}}></div>
                          <div className="bg-orange-400 w-full" style={{height: '18%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1">MAY</span>
                      </div>

                      {/* Jun */}
                      <div className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex flex-col-reverse gap-0">
                          <div className="bg-purple-500 w-full" style={{height: '42%'}}></div>
                          <div className="bg-yellow-400 w-full" style={{height: '36%'}}></div>
                          <div className="bg-orange-400 w-full" style={{height: '17%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1">JUN</span>
                      </div>

                      {/* Jul */}
                      <div className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex flex-col-reverse gap-0">
                          <div className="bg-purple-500 w-full" style={{height: '50%'}}></div>
                          <div className="bg-yellow-400 w-full" style={{height: '30%'}}></div>
                          <div className="bg-orange-400 w-full" style={{height: '16%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1">JUL</span>
                      </div>

                      {/* Aug */}
                      <div className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex flex-col-reverse gap-0">
                          <div className="bg-purple-500 w-full" style={{height: '46%'}}></div>
                          <div className="bg-yellow-400 w-full" style={{height: '33%'}}></div>
                          <div className="bg-orange-400 w-full" style={{height: '18%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1">AUG</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                  <button 
                    onClick={() => navigate("/admin/orders")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    All Status
                  </button>
                </div>
                <div className="space-y-4">
                  {allOrders
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 4)
                    .map((order: any) => {
                    const statusColors: Record<string, string> = {
                      "completed": "bg-green-100 text-green-700",
                      "received": "bg-green-100 text-green-700",
                      "delivered": "bg-blue-100 text-blue-700",
                      "shipped": "bg-cyan-100 text-cyan-700",
                      "processing": "bg-yellow-100 text-yellow-700",
                      "pending": "bg-orange-100 text-orange-700",
                      "cancelled": "bg-red-100 text-red-700",
                    };
                    const mainProductName = order.items?.[0]?.name || "Order Item";
                    const firstName = order.billingDetails?.firstName || "Customer";
                    const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                    
                    return (
                      <div key={order.id} className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-0">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                          {mainProductName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{mainProductName}</p>
                          <p className="text-xs text-gray-500">{firstName}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {statusLabel}
                        </div>
                      </div>
                    );
                  })}
                  {allOrders.length === 0 && (
                    <p className="text-center text-gray-500 py-6">No orders yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Top Products & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Products */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Top Product</h3>
                  <button className="text-gray-400 hover:text-gray-600">⋮</button>
                </div>
                <div className="space-y-4">
                  {topSellingProducts.length > 0 ? (
                    topSellingProducts.slice(0, 4).map((sale: any, idx: number) => {
                      // Find matching product from products list for image
                      const product = products.find((p: any) => 
                        p.id === sale.id || p.name === sale.name || p.title === sale.name
                      );
                      
                      const productPrice = typeof sale.price === 'number' 
                        ? sale.price 
                        : typeof product?.price === 'string'
                        ? parseFloat(product.price.replace('$', ''))
                        : 0;
                      
                      return (
                        <div key={sale.id || idx} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {product?.image || product?.img ? (
                              <img src={product.image || product.img} alt={sale.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-gray-600">{sale.name?.substring(0, 1).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{sale.name}</p>
                            <p className="text-xs text-gray-500">{sale.quantity} sold</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-gray-900">${productPrice.toFixed(2)}</p>
                            <p className="text-xs text-green-600">+{Math.floor(Math.random() * 20) + 5}%</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500 py-4">No sales yet</p>
                  )}
                </div>
              </div>

              {/* Top Categories */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Top Categories</h3>
                  <button className="text-gray-400 hover:text-gray-600">⋮</button>
                </div>
                
                {/* Pie Chart with Dynamic Data */}
                <div className="flex items-center justify-between">
                  <div className="w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                      {categories.length > 0 ? (
                        <>
                          <circle cx="60" cy="60" r="50" fill="#ec4899" opacity="0.3"></circle>
                          <circle cx="60" cy="60" r="50" fill="none" stroke="#ec4899" strokeWidth="8" strokeDasharray="47.1 157" strokeDashoffset="0" transform="rotate(-90 60 60)"></circle>
                          
                          <circle cx="60" cy="60" r="50" fill="none" stroke="#06b6d4" strokeWidth="8" strokeDasharray="47.1 157" strokeDashoffset="-47.1" transform="rotate(-90 60 60)"></circle>
                          
                          <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="31.4 157" strokeDashoffset="-94.2" transform="rotate(-90 60 60)"></circle>
                          
                          <circle cx="60" cy="60" r="50" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="31.4 157" strokeDashoffset="-125.6" transform="rotate(-90 60 60)"></circle>
                          
                          <circle cx="60" cy="60" r="35" fill="white"></circle>
                          <text x="60" y="65" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1f2937">{categories.length}</text>
                          <text x="60" y="80" textAnchor="middle" fontSize="11" fill="#6b7280">Categories</text>
                        </>
                      ) : (
                        <>
                          <circle cx="60" cy="60" r="35" fill="white"></circle>
                          <text x="60" y="65" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1f2937">0</text>
                          <text x="60" y="80" textAnchor="middle" fontSize="11" fill="#6b7280">Categories</text>
                        </>
                      )}
                    </svg>
                  </div>
                  
                  <div className="flex-1 ml-8 space-y-4">
                    {categories.slice(0, 4).map((cat: any, idx: number) => {
                      const colors = ["bg-pink-500", "bg-cyan-500", "bg-amber-500", "bg-purple-500"];
                      const percentage = Math.floor(100 / Math.max(1, categories.length));
                      return (
                        <div key={cat.id || cat.name || idx} className="flex items-center gap-3">
                          <div className={`w-3 h-3 ${colors[idx % colors.length]} rounded-full`}></div>
                          <span className="text-sm text-gray-700">{cat.name}</span>
                          <span className="ml-auto text-sm font-bold text-gray-900">{percentage}%</span>
                        </div>
                      );
                    })}
                    {categories.length === 0 && (
                      <p className="text-center text-gray-500">No categories available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
