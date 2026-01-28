import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, ChevronLeft } from "lucide-react";
import { getProducts } from "../shared/services/axios";
import type { Product } from "../shared/services/axios";
import { useCart } from "../shared/context/CartContext";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProducts()
      .then((products) => {
        if (mounted) {
          // Try to find product by matching the numeric id
          const idToFind = Number(id);
          const found = products.find((p) => p.id === idToFind);
          setProduct(found || null);
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setQuantity(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white mt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
            <button
              onClick={() => navigate("/shop")}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Return to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button
            onClick={() => navigate("/")}
            className="hover:text-blue-600"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/shop")}
            className="hover:text-blue-600"
          >
            Shop
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-96">
              <img
                src={product.img}
                alt={product.title}
                className="max-h-96 max-w-full object-contain"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            {/* Category */}
            <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-2">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <span className="text-2xl font-bold text-gray-900">
                {product.price}
              </span>
              {product.badge && (
                <span className="ml-3 text-sm font-semibold bg-orange-100 text-orange-700 px-3 py-1 rounded">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Rating (placeholder) */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">★★★★★</div>
              <span className="text-sm text-gray-600">(5 customer reviews)</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              {product.description || "This high-quality product is designed for comfort and style. It features premium materials and excellent craftsmanship, making it perfect for everyday wear or special occasions."}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border-none outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-600" />
                </button>
              </div>

              {/* Category Button */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
                    navigate(`/category/${categorySlug}`);
                  }}
                  className="flex-1 bg-blue-100 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-200 transition"
                >
                  View All {product.category}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Premium quality materials
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Comfortable and durable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Easy to care for
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  Perfect for any occasion
                </li>
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="border-t mt-6 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Free Shipping</p>
                  <p className="text-gray-600">On orders over $50</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Easy Returns</p>
                  <p className="text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
