import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { getProducts, getCategories, getProductsByCategory } from "../shared/services/axios";
import type { Product } from "../shared/services/axios";
import { useCart } from "../shared/context/CartContext";

export default function Categories() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const { addToCart } = useCart();

  // All available categories with their counts
  const allCategories = [
    { name: "Accessories", count: 7 },
    { name: "Bags & Backpacks", count: 4 },
    { name: "Beauty & Care", count: 2 },
    { name: "Jewellery", count: 4 },
    { name: "Men", count: 7 },
    { name: "Shoes", count: 3 },
    { name: "Watches", count: 4 },
    { name: "Women", count: 9 },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        // Find the category by slug (name -> id)
        const cats = await getCategories();
        const slugName = category?.toLowerCase().replace(/-/g, ' ');
        const found = (cats || []).find(c => c.name.toLowerCase() === slugName);
        if (found) {
          // Use backend endpoint that returns products where primary categoryId OR categoryIds contains the category id
          const prods = await getProductsByCategory(found.id);
          if (mounted) setProducts(prods || []);
        } else {
          // Fallback: fetch all products and filter by category name (legacy support)
          const allProducts = await getProducts();
          if (mounted) {
            const filtered = allProducts.filter(
              (p) => p.category.toLowerCase() === slugName
            );
            setProducts(filtered);
          }
        }
      } catch (err) {
        console.error('Error loading category products:', err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [category]);

  function parsePrice(p: string) {
    return Number(p.replace(/[^0-9.]/g, "")) || 0;
  }

  const filtered = products.filter((p) => {
    if (priceFilter === "all") return true;
    if (priceFilter === "0-100") return parsePrice(p.price) <= 100;
    if (priceFilter === "100-200") return parsePrice(p.price) > 100 && parsePrice(p.price) <= 200;
    return true;
  });

  const displayName = category
    ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase().replace(/-/g, ' ')
    : "Category";

  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Header */}
        <div className="text-center py-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{displayName}</h1>
          <p className="text-sm text-gray-600">
            <button onClick={() => navigate("/")} className="hover:text-blue-600">
              Home
            </button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate("/shop")} className="hover:text-blue-600">
              Shop
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{displayName}</span>
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3">
            <div className="space-y-6">
              {/* Product Categories */}
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-sm text-gray-700 mb-4">PRODUCT CATEGORIES</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {allCategories.map((cat) => (
                    <li key={cat.name}>
                      <button
                        onClick={() => navigate(`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        className={`hover:text-blue-600 transition w-full text-left py-1 ${
                          cat.name.toLowerCase() === displayName.toLowerCase() ? 'text-blue-600 font-semibold' : ''
                        }`}
                      >
                        {cat.name} ({cat.count})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-sm text-gray-700 mb-4">FILTER BY PRICE</h3>
                <div className="space-y-2 text-sm text-gray-600">
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
                      checked={priceFilter === "0-100"}
                      onChange={() => setPriceFilter("0-100")}
                    />
                    <span>$0.00-$100.00</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === "100-200"}
                      onChange={() => setPriceFilter("100-200")}
                    />
                    <span>$100.00-$200.00</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="col-span-12 md:col-span-9">
            {/* Top Bar */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-gray-600">
                {loading ? "Loading products..." : `Showing all ${filtered.length} Products`}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white p-2 rounded shadow-sm">
                  <label className="text-sm text-gray-600">Default sorting</label>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded shadow-sm h-80 animate-pulse" />
                  ))
                : filtered.length > 0
                ? filtered.map((p) => (
                    <article
                      key={p.id}
                      className="group bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                      onClick={() => navigate(`/product/${p.id}`)}
                    >
                      <div className="relative h-64 bg-gray-100 overflow-hidden">
                        {p.badge && (
                          <span className="absolute left-3 top-3 bg-yellow-400 text-white text-xs px-2 py-1 rounded z-10 font-semibold">
                            {p.badge}
                          </span>
                        )}
                        <img
                          src={p.img}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-end justify-center pointer-events-none">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p);
                            }}
                            className="mb-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto bg-blue-600 text-white px-3 py-2 rounded-full flex items-center gap-2 shadow text-sm"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to cart
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-blue-600 font-semibold uppercase">
                          {p.category}
                        </p>
                        <h4 className="font-semibold text-sm text-gray-800 mt-2 line-clamp-2 min-h-[40px]">
                          {p.title}
                        </h4>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900">
                            {p.price}
                          </div>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-400 hover:text-red-600 transition"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                : (
                    <div className="col-span-full text-center py-20">
                      <p className="text-gray-600 text-lg mb-4">
                        No products found in this category
                      </p>
                      <button
                        onClick={() => navigate("/shop")}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Browse all products
                      </button>
                    </div>
                  )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

