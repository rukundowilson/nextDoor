import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, ChevronLeft } from "lucide-react";
import { getProducts } from "../shared/services/axios";
import type { Product, ProductVariant } from "../shared/services/axios";
import { useCart } from "../shared/context/CartContext";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProducts()
      .then((products) => {
        if (mounted) {
          const found = products.find((p) => p.id === Number(id));
          setProduct(found || null);
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  // When product updates, initialize gallery and selection
  useEffect(() => {
    if (!product) return;

    // prefer product.images, then product.img
    const baseImages = product.images && product.images.length > 0 ? product.images : (product.img ? [product.img] : []);
    setGalleryImages(baseImages);
    setSelectedVariantIndex(null);
    setSelectedImage(baseImages[0] || null);
  }, [product]);

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
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-3 w-20">
              {(galleryImages || []).map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(src)}
                  className={`rounded overflow-hidden border ${selectedImage === src ? 'border-blue-600' : 'border-gray-200'}`}
                >
                  <img src={src} alt={`thumb-${idx}`} className="w-20 h-20 object-cover" />
                </button>
              ))}

              {/* show variant previews (first image of each variant) */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-2 space-y-2">
                  {product.variants.map((v: ProductVariant, vi) => (
                    <button
                      key={vi}
                      onClick={() => {
                        // when selecting a variant, show its images as gallery
                        if (v.images && v.images.length > 0) {
                          setGalleryImages(v.images);
                          setSelectedVariantIndex(vi);
                          setSelectedImage(v.images[0]);
                        }
                      }}
                      title={`${v.color || v.size || 'Variant'}`}
                      className="rounded overflow-hidden border border-gray-200 w-20 h-20 flex items-center justify-center"
                    >
                      {v.images && v.images[0] ? (
                        <img src={v.images[0]} alt={`variant-${vi}`} className="w-full h-full object-cover" />
                      ) : v.hexColor ? (
                        <span className="w-6 h-6 block rounded-full" style={{ background: v.hexColor }} />
                      ) : (
                        <div className="text-xs text-gray-500">{v.color || v.size || '—'}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main image */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-96 flex-1">
              {selectedImage ? (
                <img src={selectedImage} alt={product.title} className="max-h-96 max-w-full object-contain" />
              ) : (
                <img src={product.img} alt={product.title} className="max-h-96 max-w-full object-contain" />
              )}
            </div>

            {/* Small screens: thumbnail strip below image */}
            <div className="mt-3 md:hidden flex gap-2 overflow-x-auto">
              {(galleryImages || []).map((src, idx) => (
                <button key={idx} onClick={() => setSelectedImage(src)} className={`rounded overflow-hidden ${selectedImage === src ? 'ring-2 ring-blue-600' : ''}`}>
                  <img src={src} alt={`thumb-sm-${idx}`} className="w-24 h-24 object-cover" />
                </button>
              ))}
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

            {/* Variant Selection - Colors and Sizes */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6 border-t pt-6">
                {/* Colors */}
                {product.variants.some(v => v.color) && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Color</p>
                    <div className="flex gap-3 flex-wrap">
                      {product.variants
                        .filter(v => v.color)
                        .map((v, idx) => {
                          const variantIdx = product.variants!.indexOf(v);
                          const isSelected = selectedVariantIndex === variantIdx;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (v.images && v.images.length > 0) {
                                  setGalleryImages(v.images);
                                  setSelectedVariantIndex(variantIdx);
                                  setSelectedImage(v.images[0]);
                                }
                              }}
                              title={v.color || ''}
                              className={`flex items-center gap-2 px-4 py-2 rounded border transition ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                            >
                              {v.hexColor && (
                                <span
                                  className="w-5 h-5 rounded-full border border-gray-300"
                                  style={{ backgroundColor: v.hexColor }}
                                />
                              )}
                              <span className="text-sm">{v.color}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.variants.some(v => v.size) && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Size</p>
                    <div className="flex gap-2 flex-wrap">
                      {product.variants
                        .filter(v => v.size)
                        .map((v, idx) => {
                          const variantIdx = product.variants!.indexOf(v);
                          const isSelected = selectedVariantIndex === variantIdx;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (v.images && v.images.length > 0) {
                                  setGalleryImages(v.images);
                                  setSelectedVariantIndex(variantIdx);
                                  setSelectedImage(v.images[0]);
                                }
                              }}
                              className={`px-4 py-2 rounded border text-sm font-medium transition ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : 'border-gray-300 text-gray-700 hover:border-gray-500'
                              }`}
                            >
                              {v.size}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-4">
              {product.quantity && product.quantity > 0 ? (
                <p className="text-sm text-green-600 font-medium">
                  ✓ In Stock ({product.quantity} available)
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  Out of Stock
                </p>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col gap-4 mb-6">
              {product.quantity && product.quantity > 0 && (
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 1);
                        setQuantity(Math.min(val, product.quantity || 1));
                      }}
                      className="w-16 text-center border-none outline-none"
                      min="1"
                      max={product.quantity}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(quantity + 1, product.quantity || 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                      disabled={quantity >= (product.quantity || 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.quantity || product.quantity <= 0}
                  className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    product.quantity && product.quantity > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.quantity && product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-600" />
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
