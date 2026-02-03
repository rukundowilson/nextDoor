import { ShoppingCart, Heart, User, Menu, X, ChevronRight, Plus, LogOut, Settings, Minus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { LoginModal } from "./LoginModal";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("menu");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { count, total, items, removeFromCart, updateQuantity, clearCart, isOpen, setIsOpen } = useCart();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastY = useRef<number>(0);

  // hide on scroll down, show on scroll up; keep visible when menu is open
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      const y = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!isMenuOpen) {
            if (y > lastY.current && y > 80) {
              if (isVisible) setIsVisible(false);
            } else {
              if (!isVisible) setIsVisible(true);
            }
          } else {
            if (!isVisible) setIsVisible(true);
          }
          lastY.current = y;
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMenuOpen, isVisible]);

  // Load user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch {
        setUser(null);
      }
    }
  }, [isLoginModalOpen]); // Refresh when modal closes

  // close profile dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!profileRef.current) return;
      const clickedToggle = (e.target as HTMLElement).closest('[data-profile-toggle]');
      if (isProfileOpen && !profileRef.current.contains(target) && !clickedToggle) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isProfileOpen]);

  // close cart dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!dropdownRef.current) return;
      const clickedToggle = (e.target as HTMLElement).closest('[data-cart-toggle]');
      if (isOpen && !dropdownRef.current.contains(target) && !clickedToggle) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen, setIsOpen]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    setUser(null);
    setIsProfileOpen(false);
    navigate("/");
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
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0 shadow-md' : '-translate-y-full'} bg-white` }>
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
              <div>
                <Link to="/" className="text-2xl sm:text-3xl font-bold">
                  nextDoor
                </Link>
              </div>
            </div>
            {/* Icons hidden on lg */}
              <div className="lg:hidden flex items-center gap-4">
                {user ? (
                  <button 
                    data-profile-toggle
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="hover:opacity-80 transition"
                    title="Profile"
                  >
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-xs">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="hover:opacity-80 transition"
                    title="User Login"
                  >
                    <User className="w-5 h-5 cursor-pointer" />
                  </button>
                )}
                <Heart className="w-5 h-5 cursor-pointer hover:opacity-80" />
                <div className="relative">
                    <button data-cart-toggle onClick={() => setIsOpen(!isOpen)} className="relative">
                      <ShoppingCart className="w-5 h-5 cursor-pointer hover:opacity-80" />
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">{count}</span>
                    </button>
                  </div>
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
            {user ? (
              <div className="relative">
                <button 
                  data-profile-toggle
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:opacity-80 cursor-pointer transition"
                >
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs opacity-80">HELLO,</p>
                    <p className="text-sm font-semibold truncate max-w-[100px]">{user.name || "User"}</p>
                  </div>
                </button>
                
                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div 
                    ref={profileRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        navigate('/dashboard');
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 hover:opacity-80 cursor-pointer transition"
              >
                <User className="w-5 h-5" />
                <div className="leading-tight">
                  <p className="text-xs opacity-80">HELLO,</p>
                  <p className="text-sm font-semibold">SIGN IN</p>
                </div>
              </button>
            )}

            <Heart className="w-5 h-5 cursor-pointer hover:opacity-80 transition" />

            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
                <div className="relative">
                  <button data-cart-toggle onClick={() => setIsOpen(!isOpen)} className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">{count}</span>
                  </button>
                </div>
              <span className="text-sm">${total.toFixed(2)}</span>
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
        {user ? (
          <div className="bg-blue-600 text-white p-4 sticky top-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-blue-100">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-2 py-1 bg-blue-700 hover:bg-blue-800 rounded text-xs font-medium flex items-center justify-center gap-1">
                <Settings className="w-3 h-3" />
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium flex items-center justify-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0">
            <span className="font-medium">Login/Signup</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        )}

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
                  onClick={() => {
                    if (item.name === "HOME") {
                      navigate("/");
                      setIsMenuOpen(false);
                      return;
                    }
                    if (item.name === "SHOP") {
                      navigate("/shop");
                      setIsMenuOpen(false);
                      return;
                    }
                    if (item.expandable) toggleCategory(item.name);
                  }}
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
          {[
            { name: "HOME", to: "/" },
            { name: "SHOP", to: "/shop" },
            { name: "PAGES", to: "#" },
            { name: "BLOG", to: "#" },
            { name: "PORTFOLIO", to: "#" },
            { name: "ELEMENTS", to: "#" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      {/* DIVIDER */}
      <div className="h-px bg-gray-200/80 hidden sm:block"></div>
        {ReactDOM.createPortal(
          <>
            {/* Backdrop */}
            <div className={`fixed inset-0 bg-black/50 z-[2147483000] transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />

            {/* Sidebar */}
            <div
              ref={dropdownRef}
              className={`fixed right-0 top-0 inset-y-0 w-96 bg-white z-[2147483646] shadow-xl transform transition-transform duration-300 flex flex-col h-screen max-h-screen overflow-y-auto will-change-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
              style={{ contain: 'none' }}
            >
              {/* Header */}
              <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
                <button data-cart-toggle onClick={() => setIsOpen(false)} className="p-2">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <h4 className="flex-1 text-center font-semibold">MY CART</h4>
                <div className="w-6" />
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 5h13" />
                    </svg>
                    <div className="font-semibold">SHOPPING CART IS EMPTY!</div>
                    <button onClick={() => { setIsOpen(false); navigate('/shop'); }} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">CONTINUE SHOPPING</button>
                  </div>
                ) : (
                  <div className="flex-1 overflow-auto space-y-4">
                    {items.map((it) => (
                      <div key={it.id} className="flex items-center gap-3 pb-4 border-b">
                        <img src={it.img} alt={it.title} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{it.title}</div>
                          <div className="text-xs text-gray-500 mb-2">{it.price}</div>
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(it.id, it.cartQuantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded transition"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="text-xs font-medium w-6 text-center">{it.cartQuantity}</span>
                            <button
                              onClick={() => updateQuantity(it.id, it.cartQuantity + 1, it.quantity as number)}
                              disabled={it.cartQuantity >= (it.quantity || 1)}
                              className={`p-1 rounded transition ${
                                it.cartQuantity >= (it.quantity || 1)
                                  ? "bg-gray-100 cursor-not-allowed opacity-50"
                                  : "hover:bg-gray-100"
                              }`}
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">${(Number(it.price.replace(/[^0-9.]/g, '')) * it.cartQuantity).toFixed(2)}</div>
                          <button onClick={() => removeFromCart(it.id)} className="text-xs text-red-500 mt-1 hover:text-red-700">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-500">Subtotal</div>
                    <div className="font-semibold">${total.toFixed(2)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-3">
                      <button onClick={() => { setIsOpen(false); navigate('/checkout'); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Checkout</button>
                      <button onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50 transition">Close</button>
                    </div>
                    <button onClick={clearCart} className="w-full px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded transition">Clear Cart</button>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
      </nav>
      <div aria-hidden className="h-28 sm:h-24" />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          // Handle successful login
        }}
      />
    </>
  );
}
