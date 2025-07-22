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
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { Category } from "@/types";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
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
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Please fill in the category name");
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
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/category`,
          formData,
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          }
        );
        toast.success("Category created successfully");
      }
      
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      console.log("Error saving category:", error);
      toast.error("Failed to save category");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.log("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Categories" />
      <div className="space-y-6">
        <ComponentCard title="Categories Management">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-white/[0.05]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  All Categories
                </h3>
              <Button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-black dark:text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors dark:bg-primary-800 dark:hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : (
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                        Category Name
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                        Products Count
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                        Created Date
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
                          <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                            <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {category.name}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                            <Badge color="info" size="sm">
                              {category.products || 0} products
                            </Badge>
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
                        <TableCell colSpan={4} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
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

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} className="max-w-xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 bg-primary-500 text-black hover:bg-primary-700 dark:bg-primary-800 dark:text-white dark:hover:bg-primary-700 py-2 px-4 rounded-lg disabled:opacity-50"
              >
                {formLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingCategory ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Categories; 