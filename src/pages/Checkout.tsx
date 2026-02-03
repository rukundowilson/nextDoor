import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../shared/context/CartContext";
import API_BASE_URL from "../config/apiConfig";
import { ChevronLeft } from "lucide-react";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    setIsLoggedIn(!!userToken);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");
      const userData = localStorage.getItem("user");
      const currentUser = userData ? JSON.parse(userData) : null;

      // Prepare order data with full product details
      const orderData = {
        userId: currentUser?.id,
        userEmail: currentUser?.email,
        items: items.map((item) => ({
          productId: item.id.toString(),
          name: item.title || item.name || "Product",
          price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price,
          quantity: item.cartQuantity,
          image: item.img || item.image || "",
          category: item.category || "",
          description: item.description || "",
        })),
        billingDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.streetAddress}${formData.apartment ? ' ' + formData.apartment : ''}`,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        subtotal: total,
        shipping: 5.0,
        total: total + 5.0,
        status: "pending",
      };

      // Send order to backend
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      setOrderComplete(true);
      setTimeout(() => {
        clearCart();
        navigate("/thank-you");
      }, 1500);
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <main className="w-full bg-white min-h-screen mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Please add items to your cart before proceeding to checkout.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="w-full bg-white min-h-screen mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Login Required
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You need to be logged in to proceed with checkout. Please use the login button in the navigation bar to access your account.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (orderComplete) {
    return (
      <main className="w-full bg-white min-h-screen mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Complete!
            </h1>
            <p className="text-gray-600 mb-2">
              Thank you for your order. We'll send you a confirmation email
              shortly.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to home in a few seconds...
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  const shippingCost = 5.0;
  const subtotal = total;
  const orderTotal = subtotal + shippingCost;

  return (
    <>
      <main className="w-full bg-gray-50 mt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-4 mb-12 text-lg">
          <button
            onClick={() => navigate("/shop")}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            Shopping Cart
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-semibold">Checkout</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Order Complete</span>
        </div>

        {/* Top Blue Line */}
        <div className="border-b-4 border-blue-600 mb-8"></div>

        {/* Returning Customer & Coupon Section */}
        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 p-4 rounded flex items-center gap-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-700">
              Returning customer? <a href="#" className="text-blue-600 hover:underline">Click here to login</a>
            </span>
          </div>

          <div className="border-t"></div>

          <div className="flex items-center justify-center gap-3 py-4">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-700">
              Have a coupon? <a href="#" className="text-blue-600 hover:underline">Click here to enter your code</a>
            </span>
          </div>
        </div>

        <div className="border-t mb-8"></div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Billing details
                </h2>

                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      First name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Last name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Company name (optional)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                {/* Country */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Country / Region <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Street Address */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Street address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    placeholder="House number and street name"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white mb-3"
                    required
                  />
                  <input
                    type="text"
                    name="apartment"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                {/* City */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Town / City <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    required
                  />
                </div>

                {/* State and ZIP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      State <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      ZIP Code <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Phone and Email */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Phone <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Email address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Your order
              </h3>

              {/* Column Headers */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b">
                <span className="text-xs font-semibold text-gray-700 uppercase">Product</span>
                <span className="col-span-2 text-right text-xs font-semibold text-gray-700 uppercase">Subtotal</span>
              </div>

              {/* Order Items */}
              <div className="space-y-6 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex gap-3">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.category}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-2">
                          <span className="text-blue-600">${(
                            Number(item.price.replace(/[^0-9.]/g, "")) *
                            item.cartQuantity
                          ).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 ml-20">
                      <button className="text-gray-400 hover:text-gray-600 text-lg">−</button>
                      <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                        {item.cartQuantity}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600 text-lg">+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t mb-6"></div>

              {/* Totals */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold text-blue-600">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping</span>
                  <span className="text-blue-600 font-semibold">
                    Flat rate: ${shippingCost.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total Box */}
              <div className="border-t-4 border-blue-600 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Notice */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <p className="text-xs text-gray-700 leading-relaxed">
                  <svg
                    className="w-4 h-4 text-blue-600 inline mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <strong>Sorry,</strong> it seems that there are no available payment methods. Please contact us if you require assistance or wish to make alternate arrangements.
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 rounded text-sm uppercase transition"
              >
                {isLoading ? "PLACING ORDER..." : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
