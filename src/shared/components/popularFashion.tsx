import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductsByTag } from "../services/axios";
import type { Product } from "../services/axios";

const categories = [
  "Women",
  "Watches",
  "Shoes",
  "Others",
  "Men",
  "Jewellery",
  "Beauty & Care",
  "Bags & Backpacks",
];

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  function handleAdd() {
    addToCart({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      img: product.img,
      badge: product.badge,
    } as any);
  }

  return (
    <div className="group bg-white border border-gray-100 hover:border-blue-500/40 rounded-md overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full">
      <div className="relative bg-white flex items-center justify-center p-3 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <button className="absolute right-2 top-2 w-6 h-6 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition">
          <Heart className="w-2.5 h-2.5" />
        </button>
        <img
          src={product.img}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <button onClick={handleAdd} className="mb-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto bg-blue-600 text-white px-3 py-2 rounded-full flex items-center gap-2 shadow">
            <ShoppingCart className="w-4 h-4" />
            Add to cart
          </button>
        </div>
      </div>

      <div className="px-3 pb-3 flex-1 flex flex-col">
        <p className="text-[10px] uppercase tracking-wide text-blue-600 mb-1">
          {product.category}
        </p>

        <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 min-h-[32px] leading-tight mb-2">
          {product.title}
        </h3>

        <div className="mt-auto flex items-baseline gap-1.5">
          <span className="text-xs font-semibold text-gray-900">
            {product.price}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PopularFashion() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products-tag-Popular"],
    queryFn: () => getProductsByTag("Popular"),
  });

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-2">
            <h2 className="text-lg md:text-xl font-bold text-blue-600 mb-6">
              Popular Fashion
            </h2>
            <div className="flex flex-col gap-3">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="text-left text-sm text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="lg:col-span-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded shadow-sm h-48 animate-pulse" />
                  ))
                : products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px mt-6 bg-gray-200" />
    </section>
  );
}
