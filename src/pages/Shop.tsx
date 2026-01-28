import { ChevronDown, Grid, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../shared/services/axios";
import type { Product } from "../shared/services/axios";
import { useCart } from "../shared/context/CartContext";

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [perPage, setPerPage] = useState<number>(12);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProducts()
      .then((res) => {
        if (mounted) setProducts(res);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const { addToCart } = useCart();

  function parsePrice(p: string) {
    return Number(p.replace(/[^0-9.]/g, "")) || 0;
  }

  const filtered = products.filter((p) => {
    if (priceFilter === "all") return true;
    if (priceFilter === "0-50") return parsePrice(p.price) <= 50;
    if (priceFilter === "50-100") return parsePrice(p.price) > 50 && parsePrice(p.price) <= 100;
    return true;
  });

  const shownCount = Math.min(perPage, filtered.length);

  return (
    <main className="w-full bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold text-gray-800">Shop</h1>
          <p className="text-sm text-gray-500 mt-2">
            <Link to="/" className="text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Shop</span>
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3">
            <div className="space-y-6">
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-sm text-gray-700">PRODUCT CATEGORIES</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>Accessories (7)</li>
                  <li>Bags & Backpacks (4)</li>
                  <li>Beauty & Care (2)</li>
                  <li>Jewellery (4)</li>
                  <li>Men (7)</li>
                  <li>Shoes (3)</li>
                  <li>Watches (4)</li>
                  <li>Women (9)</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-sm text-gray-700">FILTER BY PRICE</h3>
                <div className="mt-4 text-sm text-gray-600 space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === "all"}
                      onChange={() => setPriceFilter("all")}
                    />
                    <span>All</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === "0-50"}
                      onChange={() => setPriceFilter("0-50")}
                    />
                    <span>$0.00-$50.00</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === "50-100"}
                      onChange={() => setPriceFilter("50-100")}
                    />
                    <span>$50.00-$100.00</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="col-span-12 md:col-span-9">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-gray-600">
                {loading ? "Loading products..." : `Showing 1–${shownCount} Products of ${filtered.length} Products`}
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 bg-white rounded shadow-sm" title="grid view">
                  <Grid className="w-4 h-4 text-gray-600" />
                </button>
                <div className="flex items-center gap-2 bg-white p-2 rounded shadow-sm">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    className="border-none text-sm outline-none"
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-white p-2 rounded shadow-sm">
                  <label className="text-sm text-gray-600">Default sorting</label>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded shadow-sm h-80 animate-pulse" />
                  ))
                : filtered.slice(0, perPage).map((p) => (
                    <article key={p.id} className="group bg-white rounded shadow-sm overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                      <div className="relative">
                        {p.badge && (
                          <span className="absolute left-3 top-3 bg-yellow-400 text-white text-xs px-2 py-1 rounded">
                            {p.badge}
                          </span>
                        )}
                        <img src={p.img} alt={p.title} className="w-full h-64 object-cover" />
                        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p);
                            }}
                            className="mb-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto bg-blue-600 text-white px-3 py-2 rounded-full flex items-center gap-2 shadow"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to cart
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-blue-600 font-semibold">{p.category}</p>
                        <h4 className="font-semibold text-sm text-gray-800 mt-2">{p.title}</h4>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900">{p.price}</div>
                          <button className="text-sm text-gray-500">♡</button>
                        </div>
                      </div>
                    </article>
                  ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
