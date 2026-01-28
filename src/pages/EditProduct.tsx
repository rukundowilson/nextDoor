import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Upload } from "lucide-react";
import type { Product } from "../shared/services/axios";
import { getProducts, updateProduct } from "../shared/services/axios";

const DISPLAY_TAGS = ["Featured", "Mens", "Womens", "Popular", "Categories"];

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const authChecked = useRef(false);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    price: "", 
    description: "",
    categoryId: "",
    displayTags: [] as string[]
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const adminToken = localStorage.getItem("adminToken");
    const adminUser = localStorage.getItem("adminUser");
    
    if (!adminToken || !adminUser) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const parsedAdmin = JSON.parse(adminUser);
      if (parsedAdmin.role !== "admin") {
        navigate("/", { replace: true });
        return;
      }
      setToken(adminToken);
      setAdmin(parsedAdmin);
      loadProductAndCategories();
    } catch {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const loadProductAndCategories = async () => {
    try {
      setIsLoading(true);
      const products = await getProducts();
      const idToFind = Number(id);
      const found = products.find((p) => p.id === idToFind);
      
      if (found) {
        setProduct(found);
        setFormData({
          title: found.title,
          price: found.price.replace('$', ''),
          description: found.description || "",
          categoryId: found.category.toLowerCase().replace(/\s+/g, '-'),
          displayTags: found.displayTags || []
        });
        setPreview(found.img);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error loading product:", err);
      setError("Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagChange = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      displayTags: prev.displayTags.includes(tag)
        ? prev.displayTags.filter(t => t !== tag)
        : [...prev.displayTags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError("Product title is required");
      return;
    }

    if (!formData.price.trim()) {
      setError("Product price is required");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const result = await updateProduct(
      id || "",
      formData.title,
      formData.price,
      formData.description,
      imageFile || undefined,
      formData.displayTags,
      token || undefined
    );

    if (result) {
      setSuccess("Product updated successfully!");
      setTimeout(() => {
        navigate(`/product/${id}`);
      }, 1500);
    } else {
      setError("Failed to update product. Please try again.");
    }

    setIsSubmitting(false);
  };

  if (isLoading || !admin) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-32">
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload image</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image Preview */}
                {preview && (
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Display Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Display Tags
              </label>
              <div className="space-y-2">
                {DISPLAY_TAGS.map((tag) => (
                  <label key={tag} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.displayTags.includes(tag)}
                      onChange={() => handleTagChange(tag)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
