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
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Loader2, CreditCard, Mail, Package, Filter } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

interface PaymentProduct {
  productId: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
  size?: string;
  productLink?: string;
}

interface Payment {
  _id: string;
  customerEmail: string;
  customerName: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "canceled";
  products: PaymentProduct[];
  emailSent: boolean;
  emailSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const itemsPerPage = 20;
  
  const { token } = useAuthStore();
  
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payment?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      let paymentsData = response.data.payments;
      
      // Filter by status if not "all"
      if (statusFilter !== "all") {
        paymentsData = paymentsData.filter((payment: Payment) => payment.status === statusFilter);
      }
      
      setPayments(paymentsData);
      setTotalEntries(response.data.totalPayments);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("Error fetching payments:", error);
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPayments();
  }, [currentPage, statusFilter, token]);

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "canceled":
        return "error";
      default:
        return "info";
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
      <PageBreadcrumb pageTitle="Payments" />
      <div className="space-y-6">
        <ComponentCard title="Payment Management">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 border-b border-gray-100 dark:border-white/[0.05] gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  All Payments
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track Stripe payments and email deliveries
                </p>
              </div>
              
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    statusFilter === "all"
                      ? "bg-cream-500 text-black dark:bg-cream-800 dark:text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("succeeded")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    statusFilter === "succeeded"
                      ? "bg-cream-500 text-black dark:bg-cream-800 dark:text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Success
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    statusFilter === "pending"
                      ? "bg-cream-500 text-black dark:bg-cream-800 dark:text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter("failed")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    statusFilter === "failed"
                      ? "bg-cream-500 text-black dark:bg-cream-800 dark:text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Failed
                </button>
              </div>
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
                          Payment ID
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Customer
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Amount
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Products
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Status
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Email
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Date
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {payments.length > 0 ? (
                        payments.map((payment) => (
                          <TableRow key={payment._id}>
                            <TableCell className="px-5 py-4 text-start">
                              <div className="flex items-center gap-2">
                                <CreditCard size={16} className="text-gray-400" />
                                <span className="font-mono text-sm text-gray-800 dark:text-white/90">
                                  {payment.stripePaymentIntentId.slice(-12)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div>
                                <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {payment.customerName}
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {payment.customerEmail}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                £{payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div className="flex items-center gap-2">
                                <Package size={16} className="text-gray-400" />
                                <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                                  {payment.products.length} items
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <Badge color={getStatusColor(payment.status)} size="sm">
                                {payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div className="flex items-center gap-2">
                                <Mail size={16} className={payment.emailSent ? "text-green-500" : "text-gray-400"} />
                                <span className={`text-theme-sm ${
                                  payment.emailSent 
                                    ? "text-green-600 dark:text-green-400" 
                                    : "text-gray-500 dark:text-gray-400"
                                }`}>
                                  {payment.emailSent ? "Sent" : "Not sent"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <button
                                onClick={() => handleViewPayment(payment)}
                                className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                            No payments found
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

      {/* Payment Details Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} className="max-w-xl">
        {selectedPayment && (
          <div className="p-6 max-w-4xl">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
              Payment Details
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  Payment Information
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Stripe Payment ID:</span>
                    <p className="text-gray-800 dark:text-white/90 font-mono text-sm">
                      {selectedPayment.stripePaymentIntentId}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount:</span>
                    <p className="text-gray-800 dark:text-white/90 text-lg font-semibold">
                      £{selectedPayment.amount.toFixed(2)} {selectedPayment.currency.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
                    <div className="mt-1">
                      <Badge color={getStatusColor(selectedPayment.status)} size="sm">
                        {selectedPayment.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Date:</span>
                    <p className="text-gray-800 dark:text-white/90">
                      {new Date(selectedPayment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  Customer Information
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                    <p className="text-gray-800 dark:text-white/90">{selectedPayment.customerName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                    <p className="text-gray-800 dark:text-white/90">{selectedPayment.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Status:</span>
                    <div className="mt-1 flex items-center gap-2">
                      <Mail size={16} className={selectedPayment.emailSent ? "text-green-500" : "text-gray-400"} />
                      <span className={`text-sm ${
                        selectedPayment.emailSent 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {selectedPayment.emailSent 
                          ? `Sent on ${new Date(selectedPayment.emailSentAt!).toLocaleString()}`
                          : "Email not sent"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchased Products */}
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
                Purchased Products
              </h4>
              <div className="space-y-3">
                {selectedPayment.products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 dark:text-white/90">{product.name}</h5>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>Type: {product.type}</span>
                        <span>Quantity: {product.quantity}</span>
                        {product.size && <span>Size: {product.size}</span>}
                      </div>
                      {product.productLink && (
                        <a
                          href={product.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm mt-1 inline-block"
                        >
                          View Product Link →
                        </a>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800 dark:text-white/90">
                        £{product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total: £{(product.price * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Payments; 