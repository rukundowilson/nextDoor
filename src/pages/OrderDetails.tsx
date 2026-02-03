import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Package, Truck, CheckCircle } from "lucide-react";
import type { Order } from "../shared/services/axios";
import { getUserOrders, updateOrderStatus } from "../shared/services/axios";
import { AccountSidebar } from "../shared/components/AccountSidebar";

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setUserToken(token);

    const fetchOrder = async () => {
      try {
        const orders = await getUserOrders(token);
        const foundOrder = orders.find(o => o.id === orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        navigate("/dashboard", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handleMarkAsReceived = async () => {
    if (!order || !userToken) return;

    setIsUpdating(true);
    try {
      // mark as completed when user confirms receipt
      const updated = await updateOrderStatus(order.id, "completed", userToken);
      setOrder(updated || order);
    } catch (err: any) {
      alert(err?.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
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
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-600" />;
      case "processing":
        return <Package className="w-5 h-5 text-blue-600" />;
      default:
        return <Package className="w-5 h-5 text-orange-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <AccountSidebar showBackToOrders={true} />

      <div className="flex-1">
        <div className="max-w-6xl mx-auto p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="lg:hidden flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Orders
            </button>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Order #{order.id.substring(0, 8).toUpperCase()}
                </h1>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-${getStatusColor(order.status)}-50 text-${getStatusColor(order.status)}-700 w-fit`}>
                {getStatusIcon(order.status)}
                <span className="font-semibold">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {order.items.map((item, index) => {
                  const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                  const hasImage = item.image && item.image.trim() !== '';
                  
                  return (
                    <div key={index} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Product Image */}
                        <div className="w-full lg:w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {hasImage ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                              }}
                            />
                          ) : (
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {item.name}
                            </h3>
                            
                            {/* Category Badge */}
                            {item.category && (
                              <div className="inline-block">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
                                  {item.category}
                                </span>
                              </div>
                            )}
                            
                            {/* Description */}
                            {item.description && (
                              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Product Specs Grid */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">Price</p>
                              <p className="text-lg font-bold text-gray-900">
                                ${price.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">Quantity</p>
                              <p className="text-lg font-bold text-gray-900">
                                {item.quantity}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">Unit Total</p>
                              <p className="text-lg font-bold text-gray-900">
                                ${(price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">Item #{index + 1}</p>
                              <p className="text-lg font-bold text-gray-900">
                                of {order.items.length}
                              </p>
                            </div>
                          </div>

                          {/* Product ID */}
                          <p className="text-xs text-gray-500 mt-4">
                            Product ID: <span className="font-mono text-gray-700">{item.productId}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            {/* Order Summary Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ${(typeof order.subtotal === 'string' ? parseFloat(order.subtotal) : order.subtotal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    ${(typeof order.shipping === 'string' ? parseFloat(order.shipping) : order.shipping).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${(typeof order.total === 'string' ? parseFloat(order.total) : order.total).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Mark as Received Button - Only show for shipped orders */}
              {order.status === "shipped" && (
                <button
                  onClick={handleMarkAsReceived}
                  disabled={isUpdating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Mark as Received
                    </>
                  )}
                </button>
              )}

              {/* Status Info Message */}
              {order.status === "pending" && (
                <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg text-sm">
                  Your order is pending. Our shop will process it shortly.
                </div>
              )}
              {order.status === "shipped" && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                  Your order is on the way! Click the button above when you receive it.
                </div>
              )}
              {order.status === "delivered" && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  Order delivered successfully! Thank you for your purchase.
                </div>
              )}
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Address</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-semibold text-gray-900">
                  {order.billingDetails.firstName} {order.billingDetails.lastName}
                </p>
                {/* Address or settings link */}
                {order.billingDetails.address ? (
                  <p>{order.billingDetails.address}</p>
                ) : (
                  <a href="/dashboard" className="text-blue-600 hover:text-blue-700">Set your delivery address in settings</a>
                )}

                {/* City/State/Zip or nothing */}
                {(order.billingDetails.city || order.billingDetails.state || order.billingDetails.zipCode) ? (
                  <p>
                    {order.billingDetails.city}{order.billingDetails.city ? ', ' : ''}{order.billingDetails.state} {order.billingDetails.zipCode}
                  </p>
                ) : null}

                {/* Country or settings link */}
                {order.billingDetails.country ? (
                  <p>{order.billingDetails.country}</p>
                ) : (
                  <a href="/dashboard" className="text-blue-600 hover:text-blue-700">Set your country in settings</a>
                )}
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Email</p>
                  {order.billingDetails.email ? (
                    <a
                      href={`mailto:${order.billingDetails.email}`}
                      className="text-blue-600 hover:text-blue-700 break-all"
                    >
                      {order.billingDetails.email}
                    </a>
                  ) : (
                    <a href="/dashboard" className="text-blue-600 hover:text-blue-700">Set your email in settings</a>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Phone</p>
                  {order.billingDetails.phone ? (
                    <a
                      href={`tel:${order.billingDetails.phone}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {order.billingDetails.phone}
                    </a>
                  ) : (
                    <a href="/dashboard" className="text-blue-600 hover:text-blue-700">Set your phone in settings</a>
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
