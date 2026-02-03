import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductsByTag } from "../services/axios";
import type { Product } from "../services/axios";

const categories = [
  "Wallets",
  "T-Shirts",
  "Shirts",
  "Jeans",
  "Jackets & Coats",
];

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isOutOfStock = !product.quantity || product.quantity <= 0;

  function handleAdd() {
    if (!isOutOfStock) {
      addToCart(product);
    }
  }

  return (
    <div className="group bg-white border border-gray-100 hover:border-blue-500/40 rounded-md overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full">
      <div className="relative bg-white flex items-center justify-center p-2 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        {isOutOfStock && (
          <span className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">Out of Stock</span>
          </span>
        )}
        <button className="absolute right-2 top-2 w-6 h-6 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition">
          <Heart className="w-2.5 h-2.5" />
        </button>
        <img
          src={product.img}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <button onClick={handleAdd} disabled={isOutOfStock} className={`mb-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto px-3 py-2 rounded-full flex items-center gap-2 shadow ${
            isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}>
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? 'Out of Stock' : 'Add to cart'}
          </button>
        </div>
      </div>

      <div className="px-3 pb-2 flex-1 flex flex-col">
        <p className="text-[10px] uppercase tracking-wide text-blue-600 mb-1">
          {/* {product.category} */}
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

export function MensFashion() {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ["products-tag-Mens"],
    queryFn: () => getProductsByTag("Mens"),
  });

  const products = allProducts.slice(0, 6);

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-2">
            <h2 className="text-lg md:text-xl font-bold text-blue-600 mb-4">
              Men' Fashion
            </h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <button className="text-sm text-gray-700 hover:text-blue-600 transition w-full text-left py-1">
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-10">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-start">
              {/* HERO IMAGE - Takes 2 columns, reduced height and width */}
              <div className="md:col-span-2 relative rounded-lg overflow-hidden bg-gray-100 max-h-[800px] flex-shrink-0">
                <img
                  src="https://kapee.presslayouts.com/wp-content/uploads/2019/06/Product-box-banner-3.jpg"
                  alt="Men's Fashion"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs uppercase tracking-wide mb-1">
                      MEN'S ACCESSORIES
                    </p>
                    <p className="text-lg font-bold">SALE 30% OFF</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[500px]">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-white rounded shadow-sm h-48 animate-pulse" />
                    ))
                  : products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px mt-6 bg-gray-200" />
    </section>
  );
}
