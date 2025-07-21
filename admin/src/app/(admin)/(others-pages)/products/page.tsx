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
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Trash2, Loader2, Filter } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { Product } from "@/types";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "template" | "print">("all");
  const itemsPerPage = 12;
  
  const { token } = useAuthStore();
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/product?page=${currentPage}&limit=${itemsPerPage}`;
      
      if (filterType !== "all") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/product/type/${filterType}?page=${currentPage}&limit=${itemsPerPage}`;
      }
      
      if (searchTerm) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/product/filter?query=${searchTerm}&page=${currentPage}&limit=${itemsPerPage}`;
        if (filterType !== "all") {
          url += `&type=${filterType}`;
        }
      }
      
      const response = await axios.get(url);
      setProducts(response.data.products);
      setTotalEntries(response.data.totalProducts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [currentPage, filterType]);
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== "") {
        setCurrentPage(1);
        fetchProducts();
      } else if (searchTerm === "") {
        setCurrentPage(1);
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (type: "all" | "template" | "print") => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.log("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`flex items-center justify-center w-10 h-10 rounded-md border ${
            currentPage === i
              ? "border-cream-500 bg-cream-50 text-cream-700 dark:bg-cream-900/20 dark:text-cream-400 dark:border-cream-800"
              : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Products" />
      <div className="space-y-6">
        <ComponentCard title="Products Management">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 border-b border-gray-100 dark:border-white/[0.05] gap-4">
              {/* Search */}
              <div className="relative w-full lg:w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    filterType === "all"
                      ? "bg-cream-500 text-black dark:bg-cream-800 dark:text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange("template")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    filterType === "template"
                      ? "bg-cream-500 text-black dark:bg-cream-800 dark:text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Templates
                </button>
                <button
                  onClick={() => handleFilterChange("print")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    filterType === "print"
                      ? "bg-cream-500 text-black dark:bg-cream-800 dark:text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Prints
                </button>
              </div>

              {/* Add Button */}
              <Link
                href="/products/create"
                className="inline-flex items-center px-4 py-2 bg-cream-500 text-black dark:text-white rounded-lg hover:bg-cream-700 focus:outline-none focus:ring-2 focus:ring-cream-500 transition-colors dark:bg-cream-800 dark:hover:bg-cream-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-cream-500" />
              </div>
            ) : (
              <>
                <div className="max-w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Product
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Type
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Category
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Price
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Stock
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {products.length > 0 ? (
                        products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 overflow-hidden rounded-lg">
                                  <img
                                    width={48}
                                    height={48}
                                    src={product.images[0] || "/images/default-product.jpg"}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {product.name}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(product.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <Badge
                                color={product.type === "template" ? "warning" : "info"}
                                size="sm"
                              >
                                {product.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {product.category}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div className="text-gray-800 text-theme-sm dark:text-white/90">
                                £{product.finalPrice}
                                {product.type === "print" && product.framedPrint && product.sizeSpecificPricing && Object.keys(product.sizeSpecificPricing).length > 0 && (
                                  <p className="text-xs text-gray-500">
                                    Frame pricing configured for {Object.keys(product.sizeSpecificPricing).length} size(s)
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                              <Badge
                                color={product.inStock ? "success" : "error"}
                                size="sm"
                              >
                                {product.inStock ? "In Stock" : "Out of Stock"}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/products/${product._id}`}
                                  className="p-1.5 rounded-md text-cream-600 hover:bg-cream-50 dark:text-cream-400 dark:hover:bg-cream-900/20"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  href={`/products/edit/${product._id}`}
                                  className="p-1.5 rounded-md text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
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
                          <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                            No products found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/[0.05]">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {totalEntries > 0 ? (
                      <>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, totalEntries)} of{" "}
                        {totalEntries} entries
                      </>
                    ) : (
                      "No entries to show"
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1 || totalPages === 0}
                      className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    {totalPages > 0 && renderPaginationButtons()}
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default Products; 