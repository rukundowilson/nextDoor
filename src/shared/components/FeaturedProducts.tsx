import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "../services/axios";
import type { Product as ApiProduct } from "../services/axios";

function ProductCard({ product }: { product: ApiProduct }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  function handleAdd() {
    addToCart(product);
  }

  return (
    <div className="group bg-white border border-gray-100 hover:border-blue-500/40 rounded-md overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      <div className="relative bg-white flex items-center justify-center p-4 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        {product.badge && (
          <span className="absolute left-3 top-3 text-[10px] font-semibold uppercase bg-orange-500 text-white px-2 py-1 rounded">
            {product.badge}
          </span>
        )}
        <button className="absolute right-3 top-3 w-7 h-7 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition">
          <Heart className="w-3 h-3" />
        </button>
        <img
          src={product.img}
          alt={product.title}
          className="max-h-44 object-contain"
        />
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <button onClick={handleAdd} className="mb-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow">
            <ShoppingCart className="w-4 h-4" />
            Add to cart
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 flex-1 flex flex-col">
        <p className="text-[11px] uppercase tracking-wide text-blue-600 mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px]">
          {product.title}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {product.price}
          </span>
        </div>

      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: getFeaturedProducts,
  });

  const products = allProducts.slice(0, 5);

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Featured Products
            </h2>
            <div className="hidden sm:flex text-xs md:text-[13px] uppercase tracking-wide border border-gray-200 rounded-full overflow-hidden">
              <button className="px-3 py-1.5 bg-blue-600 text-white font-semibold">
                Featured
              </button>
              <button className="px-3 py-1.5 text-gray-700 hover:bg-gray-100">
                Recent
              </button>
              <button className="px-3 py-1.5 text-gray-700 hover:bg-gray-100">
                On Sale
              </button>
              <button className="px-3 py-1.5 text-gray-700 hover:bg-gray-100">
                Top Rated
              </button>
            </div>
          </div>

          <button className="hidden md:inline-flex text-xs font-semibold uppercase text-blue-600 border border-blue-600 rounded-full px-4 py-1.5 hover:bg-blue-600 hover:text-white transition">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded shadow-sm h-64 animate-pulse" />
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>

      <div className="h-px bg-gray-200" />
    </section>
  );
}

