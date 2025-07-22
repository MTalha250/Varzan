"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import PhotosUploader from "@/components/photosUploader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { Category } from "@/types";

const CreateProduct = () => {
  const router = useRouter();
  const { token } = useAuthStore();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    inStock: true,
    inHighlight: false,
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [details, setDetails] = useState<string[]>([]);
  const [newDetail, setNewDetail] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddDetail = () => {
    if (newDetail.trim() && !details.includes(newDetail.trim())) {
      setDetails([...details, newDetail.trim()]);
      setNewDetail("");
    }
  };

  const handleRemoveDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);
      
      const productData = {
        name: formData.name,
        category: formData.category,
        inStock: formData.inStock,
        inHighlight: formData.inHighlight,
        images: images,
        details: details,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product created successfully!");
      router.push("/products");
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name,
  }));

  return (
    <>
      <PageBreadcrumb pageTitle="Add Product" />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>

        <ComponentCard title="Product Information">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Product Name *</Label>
                <Input
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div>
                <Label>Category *</Label>
                <Select
                  options={categoryOptions}
                  placeholder="Select category"
                  onChange={(value) => handleInputChange("category", value)}
                  defaultValue={formData.category}
                />
              </div>
            </div>

            {/* Product Images */}
            <div>
              <Label>Product Images *</Label>
              <PhotosUploader
                addedPhotos={images}
                maxPhotos={10}
                onChange={setImages}
              />
            </div>

            {/* Product Details */}
            <div>
              <Label>Product Details</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add a product detail"
                    value={newDetail}
                    onChange={(e) => setNewDetail(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddDetail}
                    className="px-4 py-2 bg-primary-500 text-black rounded-lg hover:bg-primary-700 dark:bg-primary-800 dark:text-white dark:hover:bg-primary-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {details.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {details.map((detail, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
                      >
                        <span className="text-sm">{detail}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDetail(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <Label>Stock Status</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="inStock"
                    checked={formData.inStock === true}
                    onChange={() => handleInputChange("inStock", true)}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">In Stock</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="inStock"
                    checked={formData.inStock === false}
                    onChange={() => handleInputChange("inStock", false)}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">Out of Stock</span>
                </label>
              </div>
            </div>

            {/* Highlight Toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inHighlight}
                  onChange={e => handleInputChange("inHighlight", e.target.checked)}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Highlight this product</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-500 text-black rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors dark:bg-primary-800 dark:text-white dark:hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Product"}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
};

export default CreateProduct; 