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
  Plus,
  ShoppingCart,
  Users,
  TrendingUp
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "../shared/services/axios";

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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-blue-500",
      lightColor: "bg-blue-100",
    },
    {
      label: "Total Categories",
      value: categories.length,
      icon: FolderOpen,
      color: "bg-purple-500",
      lightColor: "bg-purple-100",
    },
    {
      label: "Total Orders",
      value: "0",
      icon: ShoppingCart,
      color: "bg-orange-500",
      lightColor: "bg-orange-100",
    },
    {
      label: "Total Users",
      value: "0",
      icon: Users,
      color: "bg-green-500",
      lightColor: "bg-green-100",
    },
  ];

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: FolderOpen, label: "Categories", path: "/admin/categories" },
    { icon: Package, label: "Products", path: "/admin/products-list" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const quickActions = [
    {
      label: "Add Product",
      description: "Create a new product",
      icon: Plus,
      color: "bg-blue-600",
      action: () => navigate("/admin/categories"),
    },
    {
      label: "Add Category",
      description: "Create a new category",
      icon: FolderOpen,
      color: "bg-purple-600",
      action: () => navigate("/admin/categories"),
    },
    {
      label: "View Orders",
      description: "Manage customer orders",
      icon: ShoppingCart,
      color: "bg-orange-600",
      action: () => navigate("/admin/orders"),
    },
    {
      label: "View Analytics",
      description: "Check performance stats",
      icon: TrendingUp,
      color: "bg-green-600",
      action: () => navigate("/admin/analytics"),
    },
  ];

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo/Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              A
            </div>
            {sidebarOpen && <span className="font-bold text-lg">Admin</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white"
                  title={item.label}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section & Logout */}
        <div className="border-t border-gray-800 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white"
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
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{admin.name}</p>
              <p className="text-xs text-gray-500">{admin.email}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {admin.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back, {admin.name}!
              </h2>
              <p className="text-gray-600 mt-2">
                Here's what's happening in your store today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.lightColor} p-3 rounded-lg`}>
                      <stat.icon className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition text-left group"
                  >
                    <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{action.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity / Quick Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Categories Overview */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Categories Overview</h3>
                  <button
                    onClick={() => navigate("/admin/categories")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {categories.slice(0, 5).map((category: any) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                          {category.image ? (
                            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-blue-600">
                              {category.name.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{category.name}</p>
                          <p className="text-xs text-gray-500">{category.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/admin/category/${category.id}/products`)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                      >
                        Manage
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Products</p>
                      <span className="text-sm font-bold text-gray-900">{products.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((products.length / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Categories</p>
                      <span className="text-sm font-bold text-gray-900">{categories.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min((categories.length / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
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
