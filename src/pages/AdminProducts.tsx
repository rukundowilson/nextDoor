import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Edit, Trash2, LogOut, Upload, ChevronLeft, X } from "lucide-react";
import type { Product, Category, ProductVariant } from "../shared/services/axios";
import { getCategories, uploadProduct, getProductsByCategory, deleteProduct, updateProduct } from "../shared/services/axios";

const DISPLAY_TAGS = ["Featured", "Mens", "Womens", "Popular", "Categories"];

export default function AdminProducts() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const authChecked = useRef(false);
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    price: "", 
    description: "",
    displayTags: [] as string[],
    quantity: 0,
  });
  type LocalVariant = ProductVariant & { _files?: File[]; _previews?: string[] };
  const [variants, setVariants] = useState<LocalVariant[]>([]);
  const [newVariant, setNewVariant] = useState<LocalVariant>({ size: "", color: "", hexColor: "", _files: [], _previews: [] });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const adminToken = localStorage.getItem("adminToken");
    const adminUser = localStorage.getItem("adminUser");
    console.log('AdminProducts - Retrieved token:', adminToken ? `${adminToken.substring(0, 20)}...` : 'No token');
    
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
      console.log('AdminProducts - Token set to state:', adminToken ? `${adminToken.substring(0, 20)}...` : 'No token');
      setAdmin(parsedAdmin);
      loadCategoryAndProducts();
    } catch {
      navigate("/", { replace: true });
    }
  }, [navigate, categoryId]);

  const loadCategoryAndProducts = async () => {
    try {
      setIsLoading(true);
      const categories = await getCategories();
      const found = categories.find(c => c.id === categoryId);
      
      if (found) {
        setCategory(found);
        const prods = await getProductsByCategory(categoryId || "");
        setProducts(prods || []);
      } else {
        setError("Category not found");
        setCategory(null);
      }
    } catch (err) {
      console.error("Error loading category and products:", err);
      setError("Failed to load category and products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      // Generate previews for new files
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreviews(prev => [...prev, event.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagChange = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      displayTags: prev.displayTags.includes(tag)
        ? prev.displayTags.filter(t => t !== tag)
        : [...prev.displayTags, tag]
    }));
  };

  // const _handleAddVariant = () => {
  //   if (!newVariant.size && !newVariant.color) {
  //     setError("At least size or color is required");
  //     return;
  //   }
  //   setVariants(prev => [...prev, { ...newVariant }]);
  //   setNewVariant({ size: "", color: "", hexColor: "", _files: [], _previews: [] });
  //   setError("");
  // };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
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
      // Build variants payload and variant files
      const variantsPayload = variants.map(v => ({ size: v.size, color: v.color, hexColor: v.hexColor }));
      const variantFiles = variants.map(v => v._files || []);

      // Use first image file if any
      const imageToSend = imageFiles.length > 0 ? imageFiles[0] : undefined;

      if (editingProduct) {
        // Update product
        const result = await updateProduct(
          editingProduct.id.toString(),
          formData.title,
          formData.price,
          formData.description,
          imageToSend,
          variantsPayload.length > 0 ? variantsPayload : undefined,
          variantFiles.length > 0 ? variantFiles : undefined,
          formData.displayTags,
          token || undefined,
          undefined,
          undefined,
          formData.quantity
        );

        if (result) {
          setSuccess("Product updated successfully!");
          setEditingProduct(null);
          setFormData({ title: "", price: "", description: "", displayTags: [], quantity: 0 });
          setVariants([]);
          setImageFiles([]);
          setImagePreviews([]);
          setShowForm(false);
          await loadCategoryAndProducts();
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
          imageToSend,
          variantsPayload.length > 0 ? variantsPayload : undefined,
          variantFiles.length > 0 ? variantFiles : undefined,
          formData.displayTags,
          token || undefined,
          formData.quantity,
          undefined,
          undefined
        );

        if (result) {
          setSuccess("Product created successfully!");
          setFormData({ title: "", price: "", description: "", displayTags: [], quantity: 0 });
          setVariants([]);
          setImageFiles([]);
          setImagePreviews([]);
          setShowForm(false);
          await loadCategoryAndProducts();
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
      displayTags: product.displayTags || [],
      quantity: (product as any).quantity || 0
    });
    setImagePreviews([product.img]);
    setImageFiles([]);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string, productTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const result = await deleteProduct(productId, token || undefined);

    if (result) {
      setSuccess(`Product "${productTitle}" deleted successfully!`);
      await loadCategoryAndProducts();
    } else {
      setError(`Failed to delete product "${productTitle}". Please try again.`);
    }

    setIsSubmitting(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  if (isLoading || !category || !admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/categories")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {category.name} - Products
              </h1>
              <p className="text-gray-600 mt-1">Manage products for this category</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            onClick={() => {
              setEditingProduct(null);
              setShowForm(!showForm);
              setFormData({ title: "", price: "", description: "", displayTags: [], quantity: 0 });
              setImageFiles([]);
              setImagePreviews([]);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Add/Edit Product Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingProduct ? "Edit Product" : "Create New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Men's Navy T-Shirt"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., $49.99"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Stock Quantity Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
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

              {/* Display Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Display Tags (Select where to show this product)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {DISPLAY_TAGS.map(tag => (
                    <label key={tag} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.displayTags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                        className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images (Multiple)
                </label>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to add images</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Image Previews Grid */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Variants - Size & Color (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Variants - Size & Color (Optional)
                </label>

                {/* Existing Variants */}
                {variants.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {variants.map((variant, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {variant.hexColor && (
                          <div
                            className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"
                            style={{ backgroundColor: variant.hexColor }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex gap-4 text-sm">
                            {variant.size && <p className="font-medium">Size: {variant.size}</p>}
                            {variant.color && <p className="font-medium">Color: {variant.color}</p>}
                          </div>
                          {(variant._previews && variant._previews.length > 0) ? (
                            <div className="mt-2 flex gap-2">
                              {variant._previews.map((p, i) => (
                                <img key={i} src={p} alt={`v-${i}`} className="w-12 h-12 object-cover rounded" />
                              ))}
                            </div>
                          ) : (variant.images && variant.images.length > 0) ? (
                            <div className="mt-2 flex gap-2">
                              {variant.images.map((u: string, i: number) => (
                                <img key={i} src={u} alt={`v-${i}`} className="w-12 h-12 object-cover rounded" />
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Variant */}
                <div className="border-t pt-3 space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Add New Variant</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Size (e.g., S, M, L, XL)"
                      value={newVariant.size || ""}
                      onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Color name (e.g., Blue)"
                      value={newVariant.color || ""}
                      onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="color"
                      placeholder="Hex color"
                      value={newVariant.hexColor || "#000000"}
                      onChange={(e) => setNewVariant({ ...newVariant, hexColor: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg h-10 cursor-pointer"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="text-xs text-gray-600 mb-2 block">Variant Images (Optional)</label>
                    <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition bg-gray-50">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-600">Click to add variant images (multiple)</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            const previews: string[] = [];
                            files.forEach(file => {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                previews.push(event.target?.result as string);
                                if (previews.length === files.length) {
                                  setNewVariant({ ...newVariant, _files: files, _previews: previews });
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {newVariant._previews && newVariant._previews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {newVariant._previews.map((p, i) => (
                          <img key={i} src={p} className="w-16 h-16 object-cover rounded" alt={`v-${i}`} />
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVariants(prev => [...prev, { ...newVariant }]);
                      setNewVariant({ size: "", color: "", hexColor: "", _files: [], _previews: [] });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium w-full justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    Add Variant
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
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
                    setFormData({ title: "", price: "", description: "", displayTags: [], quantity: 0 });
                    setVariants([]);
                    setImageFiles([]);
                    setImagePreviews([]);
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
                            onClick={() => handleDeleteProduct(product.id.toString(), product.title)}
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
      </div>
    </div>
  );
}
