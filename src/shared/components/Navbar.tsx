import { ShoppingCart, Heart, User, Menu, X, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("menu");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const menuItems = [
    { name: "HOME", expandable: false },
    { name: "SHOP", expandable: true },
    { name: "PAGES", expandable: true },
    { name: "BLOG", expandable: false },
    { name: "PORTFOLIO", expandable: false },
    { name: "ELEMENTS", expandable: false },
  ];

  return (
    <nav className="w-full">
      {/* TOP BAR - Desktop Only */}
      <div className="bg-blue-600 text-white text-xs hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <select className="bg-transparent outline-none cursor-pointer text-xs">
              <option>ENGLISH</option>
            </select>
            <select className="bg-transparent outline-none cursor-pointer text-xs">
              <option>$ DOLLAR (US)</option>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-3 sm:gap-6">
            <span className="text-xs">WELCOME TO OUR STORE!</span>
            <a href="#" className="hover:opacity-80">BLOG</a>
            <a href="#" className="hover:opacity-80">FAQ</a>
            <a href="#" className="hover:opacity-80">CONTACT US</a>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-blue-500/80 hidden sm:block"></div>

      {/* MAIN HEADER */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-0 sm:h-24 flex flex-col sm:flex-row lg:items-center gap-4 sm:gap-8">
          {/* LOGO & MENU TOGGLE */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex">
              <button
                className="sm:hidden mr-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="text-2xl sm:text-3xl font-bold">nextDoor</div>
            </div>
            {/* Icons hidden on lg */}
            <div className="lg:hidden flex items-center gap-4">
              <User className="w-5 h-5 cursor-pointer hover:opacity-80" />
              <Heart className="w-5 h-5 cursor-pointer hover:opacity-80" />
              <ShoppingCart className="w-5 h-5 cursor-pointer hover:opacity-80" />
            </div>
          </div>

          {/* SEARCH */}
          <div className="flex flex-1 gap-0 w-full sm:w-auto h-auto sm:h-12 bg-white rounded-lg sm:rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 sm:py-0 text-xs sm:text-sm text-gray-700 outline-none"
            />
            <select className="hidden sm:block px-4 text-sm text-gray-700 outline-none bg-white">
              <option>All Categories</option>
            </select>
            <button className="px-4 sm:px-5 py-2 sm:py-0 bg-white text-blue-600 flex items-center justify-center hover:bg-gray-100">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* RIGHT - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2 hover:opacity-80 cursor-pointer transition">
              <User className="w-5 h-5" />
              <div className="leading-tight">
                <p className="text-xs opacity-80">HELLO,</p>
                <p className="text-sm font-semibold">SIGN IN</p>
              </div>
            </div>

            <Heart className="w-5 h-5 cursor-pointer hover:opacity-80 transition" />

            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm">$0.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={`fixed left-0 top-0 bottom-0 w-80 bg-white z-50 transition-transform duration-300 overflow-y-auto lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0">
          <span className="font-medium">Login/Signup</span>
          <ChevronRight className="w-5 h-5" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex-1 py-3 font-medium text-sm transition ${
              activeTab === "menu"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700"
            }`}
          >
            MENU
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 py-3 font-medium text-sm transition ${
              activeTab === "categories"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700"
            }`}
          >
            CATEGORIES
          </button>
        </div>

        {/* Menu Items */}
        {activeTab === "menu" && (
          <div className="divide-y divide-gray-200">
            {menuItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => item.expandable && toggleCategory(item.name)}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition flex items-center justify-between"
                >
                  <span className="font-medium">{item.name}</span>
                  {item.expandable && (
                    <Plus
                      className={`w-5 h-5 text-gray-400 transition ${
                        expandedCategories.includes(item.name) ? "rotate-45" : ""
                      }`}
                    />
                  )}
                </button>
                {item.expandable && expandedCategories.includes(item.name) && (
                  <div className="bg-gray-50 divide-y divide-gray-200">
                    <button className="w-full px-4 py-2 text-left text-gray-600 text-sm hover:bg-gray-100 transition">
                      Subcategory 1
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-600 text-sm hover:bg-gray-100 transition">
                      Subcategory 2
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="divide-y divide-gray-200">
            {["Electronics", "Fashion", "Home & Garden", "Sports", "Books"].map(
              (category) => (
                <button
                  key={category}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition flex items-center justify-between"
                >
                  <span className="font-medium">{category}</span>
                  <Plus className="w-5 h-5 text-gray-400" />
                </button>
              )
            )}
          </div>
        )}

        {/* Sidebar Footer - Language & Currency */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 flex gap-4">
          <select className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm outline-none">
            <option>English</option>
          </select>
          <select className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm outline-none">
            <option>$ Dollar (US)</option>
          </select>
        </div>
      </div>

      {/* DESKTOP BOTTOM NAV */}
      <div className="hidden sm:block bg-white border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center gap-8 text-sm font-medium">
          {["HOME", "SHOP", "PAGES", "BLOG", "PORTFOLIO", "ELEMENTS"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>
      {/* DIVIDER */}
      <div className="h-px bg-gray-200/80 hidden sm:block"></div>
    </nav>
  );
}
