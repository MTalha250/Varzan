"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import MultiSelect from "@/components/form/MultiSelect";
import PhotosUploader from "@/components/photosUploader";
import HighQualityUploader from "@/components/highQualityUploader";
import { Editor } from "@tinymce/tinymce-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Category } from "@/types";

const CreateProduct = () => {
  const router = useRouter();
  const { token } = useAuthStore();
  
  // Form state
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    description: "",
    price: "",
    discount: "0",
    sizeSpecificPricing: {} as Record<string, { framePrice: string; frameDiscount: string }>,
    category: "",
    inStock: true,
    productLink: "",
    sizes: [] as string[],
    digitalPrint: false,
    framedPrint: false,
    highQualityPrints: {} as Record<string, string>,
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Size options for prints
  const sizeOptions = [
    { value: "A3", text: "A3", selected: false },
    { value: "A4", text: "A4", selected: false },
    { value: "A5", text: "A5", selected: false },
  ];

  // Fetch categories based on product type
  const fetchCategories = async (type: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      const filteredCategories = response.data.filter((cat: Category) => cat.type === type);
      setCategories(filteredCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    if (formData.type) {
      fetchCategories(formData.type);
      setFormData(prev => ({ ...prev, category: "" })); // Reset category when type changes
    }
  }, [formData.type]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to update size-specific pricing
  const updateSizeSpecificPricing = (size: string, field: 'framePrice' | 'frameDiscount', value: string) => {
    setFormData(prev => ({
      ...prev,
      sizeSpecificPricing: {
        ...prev.sizeSpecificPricing,
        [size]: {
          ...prev.sizeSpecificPricing[size],
          [field]: value
        }
      }
    }));
  };

  // Initialize size-specific pricing when sizes change
  useEffect(() => {
    const newSizeSpecificPricing = { ...formData.sizeSpecificPricing };
    
    // Add new sizes with default values
    formData.sizes.forEach(size => {
      if (!newSizeSpecificPricing[size]) {
        newSizeSpecificPricing[size] = { framePrice: "", frameDiscount: "0" };
      }
    });
    
    // Remove sizes that are no longer selected
    Object.keys(newSizeSpecificPricing).forEach(size => {
      if (!formData.sizes.includes(size)) {
        delete newSizeSpecificPricing[size];
      }
    });
    
    setFormData(prev => ({
      ...prev,
      sizeSpecificPricing: newSizeSpecificPricing
    }));
  }, [formData.sizes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.type || !formData.name || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    // Print-specific validations
    if (formData.type === "print") {
      if (!formData.digitalPrint && !formData.framedPrint) {
        toast.error("For print products, please select at least one print type (Digital or Framed)");
        return;
      }
      
      if (formData.digitalPrint) {
        // Check if all selected sizes have high quality images
        const missingSizes = formData.sizes.filter(
          size => !formData.highQualityPrints[size]
        );
        
        if (missingSizes.length > 0) {
          toast.error(
            `Please upload high quality images for the following sizes: ${missingSizes.join(", ")}`
          );
          return;
        }
      }

      if (formData.framedPrint) {
        // Check if all selected sizes have frame pricing
        const missingFramePrices = formData.sizes.filter(
          size => !formData.sizeSpecificPricing[size]?.framePrice || 
                  parseFloat(formData.sizeSpecificPricing[size].framePrice) <= 0
        );
        
        if (missingFramePrices.length > 0) {
          toast.error(
            `Please set frame prices for the following sizes: ${missingFramePrices.join(", ")}`
          );
          return;
        }
      }
    }

    try {
      setLoading(true);
      
      const productData = {
        type: formData.type,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount),
        category: formData.category,
        inStock: formData.inStock,
        productLink: formData.productLink,
        images: images,
        ...(formData.type === "print" && {
          sizes: formData.sizes,
          digitalPrint: formData.digitalPrint,
          framedPrint: formData.framedPrint,
          highQualityPrints: formData.highQualityPrints,
          // Convert size-specific pricing to the correct format
          sizeSpecificPricing: Object.fromEntries(
            Object.entries(formData.sizeSpecificPricing).map(([size, pricing]) => [
              size,
              {
                framePrice: parseFloat(pricing.framePrice) || 0,
                frameDiscount: parseFloat(pricing.frameDiscount) || 0,
              }
            ])
          ),
        }),
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

  const typeOptions = [
    { value: "template", label: "Template" },
    { value: "print", label: "Print" },
  ];

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
            {/* Product Type */}
            <div>
              <Label>Product Type *</Label>
              <Select
                options={typeOptions}
                placeholder="Select product type"
                onChange={(value) => handleInputChange("type", value)}
                defaultValue={formData.type}
              />
            </div>

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

            {/* Description */}
            <div>
              <Label>Description</Label>
               <Editor
                apiKey="g0zqs3p6v9zx7zhnrzgdphkxjcz3dvgt6kl7bxln19etxto6"
                init={{
                 plugins: "anchor autolink charmap emoticons link lists searchreplace visualblocks wordcount linkchecker",
                          toolbar: "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                }}
                value={formData.description}
                onEditorChange={(content) =>
                setFormData({ ...formData, description: content })
                }
                />
            </div>

            {/* Pricing - Only for templates */}
            {formData.type === "template" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Price ($) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={formData.discount}
                    onChange={(e) => handleInputChange("discount", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Print-specific fields */}
            {formData.type === "print" && (
              <>
                {/* Print Type Selection */}
                <div>
                  <Label>Print Type Options *</Label>
                  <div className="flex gap-6 mt-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="digitalPrint"
                        checked={formData.digitalPrint}
                        onChange={(e) => handleInputChange("digitalPrint", e.target.checked)}
                        className="w-4 h-4 text-cream-600 bg-gray-100 border-gray-300 rounded focus:ring-cream-500 dark:focus:ring-cream-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Label htmlFor="digitalPrint">Digital Print</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="framedPrint"
                        checked={formData.framedPrint}
                        onChange={(e) => handleInputChange("framedPrint", e.target.checked)}
                        className="w-4 h-4 text-cream-600 bg-gray-100 border-gray-300 rounded focus:ring-cream-500 dark:focus:ring-cream-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Label htmlFor="framedPrint">Framed Print</Label>
                    </div>
                  </div>
                </div>

                {/* Digital Print Pricing - Only show if digital print is selected */}
                {formData.digitalPrint && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Digital Print Pricing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Digital Print Price ($) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Digital Print Discount (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          value={formData.discount}
                          onChange={(e) => handleInputChange("discount", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Framed Print Pricing - Only show if framed print is selected and sizes are selected */}
                {formData.framedPrint && formData.sizes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Framed Print Pricing (Size-Specific)</h3>
                    <div className="space-y-6">
                      {formData.sizes.map((size) => (
                        <div key={size} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Size: {size}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Frame Price ($) *</Label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={formData.sizeSpecificPricing[size]?.framePrice || ""}
                                onChange={(e) => updateSizeSpecificPricing(size, "framePrice", e.target.value)}
                              />
                            </div>

                            <div>
                              <Label>Frame Discount (%)</Label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0"
                                value={formData.sizeSpecificPricing[size]?.frameDiscount || "0"}
                                onChange={(e) => updateSizeSpecificPricing(size, "frameDiscount", e.target.value)}
                              />
                            </div>
                          </div>
                          
                          {/* Price calculation preview */}
                          {formData.sizeSpecificPricing[size]?.framePrice && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex justify-between">
                                  <span>Base Price:</span>
                                  <span>${formData.sizeSpecificPricing[size].framePrice}</span>
                                </div>
                                {formData.sizeSpecificPricing[size].frameDiscount !== "0" && (
                                  <div className="flex justify-between text-red-600">
                                    <span>Discount ({formData.sizeSpecificPricing[size].frameDiscount}%):</span>
                                    <span>-${(
                                      (parseFloat(formData.sizeSpecificPricing[size].framePrice) * 
                                       parseFloat(formData.sizeSpecificPricing[size].frameDiscount)) / 100
                                    ).toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-medium text-gray-900 dark:text-white border-t pt-1">
                                  <span>Final Price:</span>
                                  <span>${(
                                    parseFloat(formData.sizeSpecificPricing[size].framePrice) - 
                                    (parseFloat(formData.sizeSpecificPricing[size].framePrice) * 
                                     parseFloat(formData.sizeSpecificPricing[size].frameDiscount || "0")) / 100
                                  ).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback Frame Pricing - Show note when framed print is selected but no sizes */}
                {formData.framedPrint && formData.sizes.length === 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      Please select sizes first to configure frame pricing for each size.
                    </p>
                  </div>
                )}

                {/* High Quality Print Upload - Only show if digital print is selected */}
                {formData.digitalPrint && formData.sizes.length > 0 && (
                  <div>
                    <Label>High Quality Print Images (for downloads) *</Label>
                    <HighQualityUploader
                      images={formData.highQualityPrints}
                      onChange={(urls) => handleInputChange("highQualityPrints", urls)}
                      sizes={formData.sizes}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload high-resolution images for each selected size. These will be sent to customers as one-time downloads. Original quality will be preserved.
                    </p>
                  </div>
                )}

                <div>
                  <MultiSelect
                    label="Available Sizes"
                    options={sizeOptions}
                    defaultSelected={formData.sizes}
                    onChange={(values) => handleInputChange("sizes", values)}
                  />
                </div>
              </>
            )}

            {/* Template Link - Only for templates */}
            {formData.type === "template" && (
              <div>
                <Label>Template Link (Canva URL)</Label>
                <Input
                  type="url"
                  placeholder="https://www.canva.com/design/..."
                  value={formData.productLink}
                  onChange={(e) => handleInputChange("productLink", e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  This Canva template link will be sent to customers after payment.
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="inStock"
                checked={formData.inStock}
                onChange={(e) => handleInputChange("inStock", e.target.checked)}
                className="w-4 h-4 text-cream-600 bg-gray-100 border-gray-300 rounded focus:ring-cream-500 dark:focus:ring-cream-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>

            {/* Images */}
            <div>
              <Label>Product Images *</Label>
              <PhotosUploader
                addedPhotos={images}
                onChange={setImages}
                maxPhotos={10}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link
                href="/products"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-cream-500 text-black dark:bg-cream-800 dark:text-white rounded-lg hover:bg-cream-600 disabled:opacity-50 disabled:cursor-not-allowed"
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