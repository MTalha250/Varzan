"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import { Testimonial } from "@/types";

const Testimonials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 12;
  const { token } = useAuthStore();

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/testimonial?page=${currentPage}&limit=${itemsPerPage}`;
      if (searchTerm) {
        // Simple client-side filtering after fetch for now
        const resAll = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/testimonial?page=${currentPage}&limit=${itemsPerPage}`);
        const list: Testimonial[] = resAll.data.testimonials || [];
        const filtered = list.filter((t) =>
          [t.name, t.email, t.message].some((f) => f?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setTestimonials(filtered);
        setTotalEntries(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        return;
      }
      const response = await axios.get(url);
      setTestimonials(response.data.testimonials);
      setTotalEntries(response.data.totalTestimonials);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("Error fetching testimonials:", error);
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setCurrentPage(1);
      fetchTestimonials();
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/testimonial/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Testimonial deleted successfully");
      fetchTestimonials();
    } catch (error) {
      console.log("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const renderPaginationButtons = () => {
    const buttons: React.ReactNode[] = [];
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
              ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800"
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
      <PageBreadcrumb pageTitle="Testimonials" />
      <div className="space-y-6">
        <ComponentCard title="Testimonials Management">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 border-b border-gray-100 dark:border-white/[0.05] gap-4">
              <div className="relative w-full lg:w-64">
                <input
                  type="text"
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              <Link
                href="/testimonials/create"
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-black dark:text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors dark:bg-primary-800 dark:hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : (
              <>
                <div className="max-w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Message</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {testimonials.length > 0 ? (
                        testimonials.map((t) => (
                          <TableRow key={t._id}>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 overflow-hidden rounded-full">
                                  <img
                                    width={48}
                                    height={48}
                                    src={t.image || "/images/default-avatar.jpg"}
                                    alt={t.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{t.name}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{t.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div className="max-w-xl text-gray-700 dark:text-gray-300 line-clamp-3">{t.message}</div>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/testimonials/edit/${t._id}`}
                                  className="p-1.5 rounded-md text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDelete(t._id)}
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
                          <TableCell colSpan={3} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">No testimonials found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/[0.05]">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {totalEntries > 0 ? (
                      <>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} entries
                      </>
                    ) : (
                      "No entries to show"
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1 || totalPages === 0} className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    {totalPages > 0 && renderPaginationButtons()}
                    <button onClick={goToNextPage} disabled={currentPage === totalPages || totalPages === 0} className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
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

export default Testimonials;


