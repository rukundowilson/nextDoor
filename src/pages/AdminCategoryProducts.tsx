import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Edit, Trash2, Upload, ChevronLeft } from "lucide-react";
import type { Product, Category } from "../shared/services/axios";
import { getCategories, uploadProduct, getProductsByCategory, deleteProduct, updateProduct } from "../shared/services/axios";
import { AdminLayout } from "../shared/components/AdminLayout";

const DISPLAY_TAGS = ["Featured", "Mens", "Womens", "Popular", "Categories"];

export default function AdminCategoryProducts() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const authChecked = useRef(false);
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", 
    price: "", 
    description: "",
    displayTags: [] as string[]
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      navigate("/admin/login", { replace: true });
      return;
    }

    try {
      setToken(adminToken);
      loadCategory();
    } catch {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate, categoryId]);

  const loadCategory = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const categories = await getCategories();
      const found = categories.find(c => c.id === categoryId);
      
      if (found) {
        setCategory(found);
        const prods = await getProductsByCategory(categoryId || "");
        console.log("Loaded products for category:", categoryId, prods);
        setProducts(prods || []);
      } else {
        setError("Category not found");
      }
    } catch (err) {
      console.error("Error loading category and products:", err);
      setError("Failed to load category and products");
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

    try {
      if (editingProduct) {
        // Update product
        const result = await updateProduct(
          editingProduct.backendId || editingProduct.id.toString(),
          formData.title,
          formData.price,
          formData.description,
          imageFile || undefined,
          undefined,
          undefined,
          formData.displayTags,
          token || undefined
        );

        if (result) {
          setSuccess("Product updated successfully!");
          setEditingProduct(null);
          setFormData({ title: "", price: "", description: "", displayTags: [] });
          setImageFile(null);
          setPreview(null);
          setShowForm(false);
          await loadCategory();
        } else {
          setError("Failed to update product. Please try again.");
        }
      } else {
        // Create product
        const result = await uploadProduct(
          categoryId || "",
          undefined,
          formData.title,
          formData.price,
          formData.description,
          imageFile || undefined,
          undefined,
          undefined,
          formData.displayTags,
          token || undefined
        );

        if (result) {
          setSuccess("Product created successfully!");
          setFormData({ title: "", price: "", description: "", displayTags: [] });
          setImageFile(null);
          setPreview(null);
          setShowForm(false);
          await loadCategory();
        } else {
          setError("Failed to create product. Please try again.");
        }
      }
    } catch (err) {
      console.error("Error submitting product:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.replace('$', ''),
      description: product.description || "",
      displayTags: product.displayTags || []
    });
    setPreview(product.img);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string, backendId: string | undefined, productTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const result = await deleteProduct(backendId || productId, token || undefined);

    if (result) {
      setSuccess(`Product "${productTitle}" deleted successfully!`);
      await loadCategory();
    } else {
      setError(`Failed to delete product "${productTitle}". Please try again.`);
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Category Products">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!category) {
    return (
      <AdminLayout title="Category Products">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || "Category not found"}</p>
          <button
            onClick={() => navigate("/admin/categories")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ChevronLeft size={20} />
            Back to Categories
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Products: ${category.name}`}>
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

        {/* Add Product Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/products/add")}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Add/Edit Product Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingProduct ? "Edit Product" : "Create New Product"}
            </h2>

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
                  {isSubmitting ? (editingProduct ? "Updating..." : "Creating...") : (editingProduct ? "Update Product" : "Create Product")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setFormData({ title: "", price: "", description: "", displayTags: [] });
                    setImageFile(null);
                    setPreview(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tags</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No products found. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.img ? (
                            <img
                              src={product.img}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-blue-600">
                              {product.title.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{product.title}</td>
                      <td className="px-6 py-4 text-gray-600">{product.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.displayTags && product.displayTags.map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit product"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id.toString(), product.backendId, product.title)}
                            disabled={isSubmitting}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete product"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
    </AdminLayout>
  );
}
