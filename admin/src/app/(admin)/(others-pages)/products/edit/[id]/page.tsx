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
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductFormData } from "@/types";

interface Category {
  _id: string;
  name: string;
  type: "template" | "print";
}



const EditProduct = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    type: "",
    name: "",
    description: "",
    price: "",
    discount: "0",
    sizeSpecificPricing: {},
    category: "",
    inStock: true,
    productLink: "",
    sizes: [],
    images: [],
    digitalPrint: false,
    framedPrint: false,
    highQualityPrints: {},
  });

  const sizeOptions = [
    { value: "A3", text: "A3", selected: false },
    { value: "A4", text: "A4", selected: false },
    { value: "A5", text: "A5", selected: false },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category`);
        setCategories(categoriesRes.data);
        const productRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/admin/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const product = productRes.data;
        
        setFormData({
          type: product.type || "",
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          discount: product.discount?.toString() || "0",
          sizeSpecificPricing: product.sizeSpecificPricing ? 
            Object.fromEntries(
              Object.entries(product.sizeSpecificPricing).map(([size, pricing]: [string, any]) => [
                size,
                {
                  framePrice: pricing.framePrice?.toString() || "",
                  frameDiscount: pricing.frameDiscount?.toString() || "0",
                }
              ])
            ) : {},
          category: product.category || "",
          inStock: product.inStock ?? true,
          productLink: product.productLink || "",
          sizes: product.sizes || [],
          images: product.images || [],
          digitalPrint: product.digitalPrint || false,
          framedPrint: product.framedPrint || false,
          highQualityPrints: product.highQualityPrints || {},
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    if (productId && token) {
      fetchData();
    }
  }, [productId, token]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelectChange = (selectedSizes: string[]) => {
    setFormData(prev => ({
      ...prev,
      sizes: selectedSizes
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

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.type) {
      toast.error("Please select a product type");
      return false;
    }
    if (!formData.name.trim()) {
      toast.error("Please enter a product name");
      return false;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return false;
    }
    if (formData.type === "print" && formData.sizes.length === 0) {
      toast.error("Please select at least one size for print products");
      return false;
    }
    
    // Print-specific validations
    if (formData.type === "print") {
      if (!formData.digitalPrint && !formData.framedPrint) {
        toast.error("For print products, please select at least one print type (Digital or Framed)");
        return false;
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
          return false;
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
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      const productData = {
        type: formData.type,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount) || 0,
        images: formData.images,
        category: formData.category,
        inStock: formData.inStock,
        sizes: formData.type === "print" ? formData.sizes : [],
        productLink: formData.productLink,
        ...(formData.type === "print" && {
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

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product updated successfully!");
      router.push("/products");
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  const getFilteredCategories = () => {
    return categories.filter(category => 
      !formData.type || category.type === formData.type
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Product" />
      <div className="space-y-6">
        <ComponentCard title="Edit Product">
          <div className="mb-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Type */}
            <div>
              <Label>Product Type *</Label>
              <Select
                options={[
                  { value: "", label: "Select product type" },
                  { value: "template", label: "Template" },
                  { value: "print", label: "Print" },
                ]}
                value={formData.type}
                onChange={(value) => {
                  handleSelectChange("type", value);
                  // Reset category when type changes
                  setFormData(prev => ({ ...prev, category: "" }));
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <Label>Product Name *</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              {/* Category */}
              <div>
                <Label>Category *</Label>
                <Select
                  options={[
                    { value: "", label: "Select category" },
                    ...getFilteredCategories().map(cat => ({
                      value: cat.name,
                      label: cat.name
                    }))
                  ]}
                  value={formData.category}
                  onChange={(value) => handleSelectChange("category", value)}
                  disabled={!formData.type}
                />
                {!formData.type && (
                  <p className="text-sm text-gray-500 mt-1">Select product type first</p>
                )}
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

            {/* Images */}
            <div>
              <Label>Product Images *</Label>
              <PhotosUploader
                addedPhotos={formData.images}
                onChange={handleImagesChange}
                maxPhotos={10}
              />
            </div>

            {/* Pricing - Only for templates */}
            {formData.type === "template" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Price * ($)</Label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={(e) => handleInputChange("discount", e.target.value)}
                    placeholder="0"
                    min="0"
                    max="100"
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
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Label htmlFor="digitalPrint">Digital Print</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="framedPrint"
                        checked={formData.framedPrint}
                        onChange={(e) => handleInputChange("framedPrint", e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                          name="price"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <Label>Digital Print Discount (%)</Label>
                        <Input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={(e) => handleInputChange("discount", e.target.value)}
                          placeholder="0"
                          min="0"
                          max="100"
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
              </>
            )}

            {/* Sizes (only for prints) */}
            {formData.type === "print" && (
              <div>
                <MultiSelect
                  label="Available Sizes *"
                  options={sizeOptions.map(size => ({
                    ...size,
                    selected: formData.sizes.includes(size.value)
                  }))}
                  onChange={handleMultiSelectChange}
                  placeholder="Select available sizes"
                />
              </div>
            )}

            {/* Template Link - Only for templates */}
            {formData.type === "template" && (
              <div>
                <Label>Template Link (Canva URL)</Label>
                <Input
                  type="url"
                  name="productLink"
                  value={formData.productLink}
                  onChange={(e) => handleInputChange("productLink", e.target.value)}
                  placeholder="https://www.canva.com/design/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  This Canva template link will be sent to customers after payment.
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={(e) => handleInputChange("inStock", e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  In Stock
                </span>
              </label>
            </div>

            {/* Price Preview */}
            {formData.price && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Preview
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span>${formData.price}</span>
                  </div>
                  {formData.discount && (
                    <>
                      <div className="flex justify-between text-red-600">
                        <span>Discount ({formData.discount}%):</span>
                        <span>-${((parseFloat(formData.price) * parseFloat(formData.discount)) / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Final Price:</span>
                        <span>${(parseFloat(formData.price) * (1 - parseFloat(formData.discount) / 100)).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  {formData.type === "print" && formData.sizeSpecificPricing && Object.keys(formData.sizeSpecificPricing).length > 0 && (
                    <div className="border-t pt-2 mt-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frame Price Preview
                      </h3>
                      <div className="space-y-1 text-sm">
                        {Object.entries(formData.sizeSpecificPricing).map(([size, pricing]) => (
                          <div key={size} className="flex justify-between">
                            <span>Size {size}:</span>
                            <span>${pricing.framePrice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-cream-500 dark:bg-cream-800 text-black dark:text-white rounded-lg hover:bg-cream-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
};

export default EditProduct; 