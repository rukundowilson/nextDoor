import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Upload, X, ChevronDown, Plus } from "lucide-react";
import type { Category } from "../shared/services/axios";
import { getCategories, uploadProduct } from "../shared/services/axios";
import { AdminLayout } from "../shared/components/AdminLayout";

const DISPLAY_TAGS = ["Featured", "Mens", "Womens", "Popular", "Categories"];
const INITIAL_CATEGORIES_SHOWN = 5;
const COLORS = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Gray"];

interface Variant {
  id: string;
  color: string;
  size: string;
  price: string;
  quantity: string;
}

interface Specification {
  id: string;
  label: string;
  value: string;
}

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const authChecked = useRef(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isExpandedCategories, setIsExpandedCategories] = useState(false);
  const [isVariantEnabled, setIsVariantEnabled] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    displayTags: [] as string[],
    sku: "",
    barcode: "",
    quantity: "",
    weight: "",
    height: "",
    length: "",
    width: "",
  });

  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [variants, setVariants] = useState<Variant[]>([
    { id: "1", color: "", size: "", price: "", quantity: "" },
  ]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const adminToken = localStorage.getItem("adminToken");
    const adminUser = localStorage.getItem("adminUser");

    if (!adminToken || !adminUser) {
      navigate("/admin/login", { replace: true });
      return;
    }

    try {
      const parsed = JSON.parse(adminUser);
      if (parsed.role !== "admin") {
        navigate("/admin/login", { replace: true });
        return;
      }
      setToken(adminToken);
      loadCategories();
    } catch {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError("");
      const cats = await getCategories();
      setCategories(cats || []);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleTagChange = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      displayTags: prev.displayTags.includes(tag)
        ? prev.displayTags.filter((t) => t !== tag)
        : [...prev.displayTags, tag],
    }));
  };

  const addSpecification = () => {
    setSpecifications((prev) => [
      ...prev,
      { id: Date.now().toString(), label: "", value: "" },
    ]);
  };

  const removeSpecification = (id: string) => {
    setSpecifications((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSpecification = (
    id: string,
    field: "label" | "value",
    value: string
  ) => {
    setSpecifications((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: Date.now().toString(), color: "", size: "", price: "", quantity: "" },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const updateVariant = (
    id: string,
    field: keyof Variant,
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
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

    if (!formData.quantity.trim()) {
      setError("Product quantity is required");
      return;
    }

    if (selectedCategories.length === 0) {
      setError("Please select at least one category");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const result = await uploadProduct(
        selectedCategories[0],
        selectedCategories,
        formData.title,
        formData.price,
        formData.description,
        imageFiles[0] || undefined,
        isVariantEnabled
          ? variants.map((v) => ({
              name: `${v.color || ""} ${v.size || ""}`.trim(),
              color: v.color,
              size: v.size,
              price: v.price || formData.price,
              quantity: v.quantity ? parseInt(v.quantity) : 0,
            }))
          : undefined,
        imageFiles.length > 1 ? [imageFiles.slice(1)] : undefined,
        formData.displayTags,
        token || undefined,
        parseInt(formData.quantity) || 0,
        specifications.map((s) => ({
          name: s.label,
          value: s.value,
        }))
      );

      if (result) {
        setSuccess("Product created successfully!");
        setTimeout(() => {
          navigate("/admin/products-list");
        }, 1500);
      } else {
        setError("Failed to create product. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting product:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Add Product">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Add Product">
      <div className="max-w-6xl mx-auto">
        {/* Header with Status */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => navigate("/admin/products-list")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Products
            </button>
            <span>/</span>
            <span className="font-medium text-gray-900">Add Product</span>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            {status === "draft" ? "Draft" : "Published"}
          </span>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* General Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                General Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Logic G1 Pro Wireless Mouse"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Product description..."
                  />
                </div>
              </div>
            </div>

            {/* Specification */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Specification
              </h3>

              <div className="space-y-3">
                {specifications.map((spec) => (
                  <div key={spec.id} className="flex gap-3">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) =>
                        updateSpecification(spec.id, "label", e.target.value)
                      }
                      placeholder="e.g., Wireless 2.4 GHz"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(spec.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addSpecification}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Add More
              </button>
            </div>

            {/* Base Price */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Base Price</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>USD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="49.00"
                  />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categories *</h3>

              <div className="space-y-2">
                {categories.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No categories available. Create a category first.
                  </p>
                ) : (
                  <>
                    {categories
                      .slice(
                        0,
                        isExpandedCategories
                          ? categories.length
                          : INITIAL_CATEGORIES_SHOWN
                      )
                      .map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => handleCategoryToggle(cat.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{cat.name}</p>
                            {cat.description && (
                              <p className="text-xs text-gray-500">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}

                    {categories.length > INITIAL_CATEGORIES_SHOWN && (
                      <button
                        type="button"
                        onClick={() =>
                          setIsExpandedCategories(!isExpandedCategories)
                        }
                        className="w-full flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200 text-blue-600 hover:text-blue-700 font-medium transition"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpandedCategories ? "rotate-180" : ""
                          }`}
                        />
                        {isExpandedCategories
                          ? "See less"
                          : `See more (${
                              categories.length - INITIAL_CATEGORIES_SHOWN
                            } more)`}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Display Tags */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Display Tags
              </h3>

              <div className="flex flex-wrap gap-2">
                {DISPLAY_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagChange(tag)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      formData.displayTags.includes(tag)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Inventory</h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="SKU123456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barcode
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                    placeholder="0000200015032"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Variant Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Variant</h3>
                <button
                  type="button"
                  onClick={() => setIsVariantEnabled(!isVariantEnabled)}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    isVariantEnabled
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {isVariantEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              {isVariantEnabled && (
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-3 pb-3 border-b border-gray-200">
                    <div className="text-xs font-semibold text-gray-600">Color</div>
                    <div className="text-xs font-semibold text-gray-600">Size</div>
                    <div className="text-xs font-semibold text-gray-600">Price</div>
                    <div className="text-xs font-semibold text-gray-600">Quantity</div>
                    <div className="text-xs font-semibold text-gray-600">Action</div>
                  </div>

                  {variants.map((variant) => (
                    <div key={variant.id} className="grid grid-cols-5 gap-3 items-center">
                      <select
                        value={variant.color}
                        onChange={(e) =>
                          updateVariant(variant.id, "color", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Color</option>
                        {COLORS.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) =>
                          updateVariant(variant.id, "size", e.target.value)
                        }
                        placeholder="e.g., M, L, XL"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <input
                        type="text"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(variant.id, "price", e.target.value)
                        }
                        placeholder="Price"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) =>
                          updateVariant(variant.id, "quantity", e.target.value)
                        }
                        placeholder="Qty"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVariant}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 font-medium transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add More
                  </button>
                </div>
              )}
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    placeholder="300 g"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height
                  </label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    placeholder="12 cm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length
                  </label>
                  <input
                    type="text"
                    value={formData.length}
                    onChange={(e) =>
                      setFormData({ ...formData, length: e.target.value })
                    }
                    placeholder="12 cm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width
                  </label>
                  <input
                    type="text"
                    value={formData.width}
                    onChange={(e) =>
                      setFormData({ ...formData, width: e.target.value })
                    }
                    placeholder="8 cm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/products-list")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Right Sidebar - Media */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Media</h3>

                {/* Image Upload */}
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition p-6">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG or GIF (max. 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Image Previews */}
                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 right-1 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {imageFiles.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    {imageFiles.length} image(s) selected
                  </p>
                )}
              </div>

              {/* Selected Categories Display */}
              {selectedCategories.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Selected Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((catId) => {
                      const cat = categories.find((c) => c.id === catId);
                      return cat ? (
                        <span
                          key={catId}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-2"
                        >
                          {cat.name}
                          <button
                            type="button"
                            onClick={() => handleCategoryToggle(catId)}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Selected Tags Display */}
              {formData.displayTags.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Selected Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.displayTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagChange(tag)}
                          className="hover:text-purple-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
