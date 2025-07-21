"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  type: "template" | "print";
  products?: number;
  createdAt: string;
  updatedAt: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  
  const { token } = useAuthStore();
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      setCategories(response.data);
    } catch (error) {
      console.log("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        type: category.type,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        type: "",
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      type: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setFormLoading(true);
      
      if (editingCategory) {
        // Update category
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/category/${editingCategory._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Category updated successfully");
      } else {
        // Create category
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/category`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Category created successfully");
      }
      
      fetchCategories();
      handleCloseModal();
    } catch (error: any) {
      console.log("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error: any) {
      console.log("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  const typeOptions = [
    { value: "template", label: "Template" },
    { value: "print", label: "Print" },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Categories" />
      <div className="space-y-6">
        <ComponentCard title="Categories Management">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 dark:border-white/[0.05]">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  All Categories
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage product categories for templates and prints
                </p>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-4 py-2 bg-cream-500 text-black dark:text-white rounded-lg hover:bg-cream-700 focus:outline-none focus:ring-2 focus:ring-cream-500 transition-colors dark:bg-cream-800 dark:hover:bg-cream-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-cream-500" />
              </div>
            ) : (
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Category Name
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Type
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Products
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Created
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <TableRow key={category._id}>
                          <TableCell className="px-5 py-4 text-start">
                            <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {category.name}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <Badge
                              color={category.type === "template" ? "warning" : "info"}
                              size="sm"
                            >
                              {category.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {category.products || 0} products
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenModal(category)}
                                className="p-1.5 rounded-md text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(category._id)}
                                className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                          No categories found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </ComponentCard>
      </div>

      {/* Add/Edit Category Modal */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} className="max-w-xl">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                type="text"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Category Type</Label>
              <Select
                options={typeOptions}
                placeholder="Select category type"
                onChange={(value) => setFormData({ ...formData, type: value })}
                defaultValue={formData.type}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-4 py-2 bg-cream-500 text-black dark:text-white rounded-lg hover:bg-cream-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formLoading ? "Saving..." : editingCategory ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Categories; 