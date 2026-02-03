import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Printer, CreditCard, MapPin, Mail, Phone } from "lucide-react";
import { AdminLayout } from "../shared/components/AdminLayout";
import API_BASE_URL from "../config/apiConfig";

interface OrderItem {
  productId: string;
  name: string;
  price: number | string;
  quantity: number;
  image?: string;
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
  userId?: string;
  items: OrderItem[];
  billingDetails: BillingDetails;
  subtotal: number;
  shipping: number;
  discount?: number;
  insurance?: number;
  tax?: number;
  total: number;
  status: string;
  createdAt: string;
}

function safeNum(v: any) {
  if (typeof v === "number") return v;
  const n = parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
}

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const authChecked = useRef(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
      const parsed = JSON.parse(adminUser);
      if (parsed.role !== "admin") {
        navigate("/admin/login", { replace: true });
        return;
      }
      if (orderId) fetchOrder(orderId, adminToken);
    } catch {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate, orderId]);

  const fetchOrder = async (id: string, token: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // normalize legacy 'received' status to 'completed'
        const ord = data.order || data;
        if (ord && ord.status === 'received') ord.status = 'completed';
        setOrder(ord);
      } else {
        console.error("Failed to fetch order", res.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    const adminToken = localStorage.getItem("adminToken");
    if (!order || !adminToken) return;
    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE_URL}/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const d = await res.json();
        setOrder(d.order || d);
      } else {
        let msg = "Failed to update status";
        try {
          const body = await res.json();
          if (body && body.message) msg = body.message;
        } catch (_) {}
        alert(msg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const invoice = () => {
    // simple print action for now
    window.print();
  };

  if (isLoading) {
    return (
      <AdminLayout title="Order Details">
        <div className="p-8 text-center">Loading...</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Details">
        <div className="p-8 text-center text-gray-600">Order not found</div>
      </AdminLayout>
    );
  }

  const subtotal = safeNum(order.subtotal);
  const discount = safeNum(order.discount);
  const shipping = safeNum(order.shipping);
  const insurance = safeNum(order.insurance);
  const tax = safeNum(order.tax);
  const total = safeNum(order.total);

  return (
    <AdminLayout title="Order Details">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/admin/orders')} className="p-2 rounded hover:bg-gray-100">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-bold">#{order.id.substring(0, 8).toUpperCase()}</h2>
              <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
              <span className="ml-3 px-3 py-1 rounded text-xs bg-blue-100 text-blue-700">{order.status}</span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value === 'received' ? 'completed' : e.target.value)}
                disabled={updating || order.status === 'completed' || order.status === 'received'}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={invoice} className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2">
                <Printer className="w-4 h-4" /> Invoice
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((it, idx) => {
                  const price = safeNum(it.price);
                  const itemName = (it as any).name || (it as any).title || "Product";
                return (
                  <div key={idx} className="flex items-center gap-4 p-3 border border-gray-100 rounded-md">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">{it.image ? <img src={it.image} alt={itemName} className="w-full h-full object-cover rounded" /> : <div className="text-2xl">📦</div>}</div>
                      <div className="flex-1">
                        <p className="font-medium">{itemName}</p>
                        <p className="text-xs text-gray-500">#{order.id.substring(0,6)} • {it.quantity} × ${price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(price * (it.quantity || 1)).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold mb-4">Order Summary</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span>Payment Method</span><span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400"/> Visa •••• 9021</span></div>
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Insurance</span><span>${insurance.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold mb-4">Customer Details</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium">
                  {(order.billingDetails.firstName || order.billingDetails.lastName)
                    ? `${order.billingDetails.firstName || ""} ${order.billingDetails.lastName || ""}`.trim()
                    : "Guest"}
                </p>
              </div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400"/>
                <span>
                  {order.billingDetails.address || "No address provided"}
                </span>
              </div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400"/><span>{order.billingDetails.email || "-"}</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/><span>{order.billingDetails.phone || "-"}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
}
