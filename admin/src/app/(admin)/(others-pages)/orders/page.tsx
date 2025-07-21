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
import Select from "@/components/form/Select";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Loader2, Package } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

interface OrderItem {
  _id: string;
  type: string;
  name: string;
  image: string;
  quantity: number;
  size: string;
  price: number;
}

interface Order {
  _id: string;
  name: string;
  email: string;
  whatsapp: string;
  order: OrderItem[];
  status: "pending" | "processing" | "completed" | "cancelled";
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  subTotal: number;
  delivery: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const itemsPerPage = 10;
  
  const { token } = useAuthStore();
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const ordersData = response.data;
      
      // Calculate pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedOrders = ordersData.slice(startIndex, endIndex);
      
      setOrders(paginatedOrders);
      setTotalEntries(ordersData.length);
      setTotalPages(Math.ceil(ordersData.length / itemsPerPage));
    } catch (error) {
      console.log("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, [currentPage, token]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      // Get the current order data first
      const currentOrder = orders.find(order => order._id === orderId);
      if (!currentOrder) return;

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`,
        { ...currentOrder, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Order status updated successfully");
      fetchOrders();
      
      // Update selectedOrder if it's the one being updated
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (error: any) {
      console.log("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Failed to update order status");
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
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
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "info";
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

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
      <PageBreadcrumb pageTitle="Orders" />
      <div className="space-y-6">
        <ComponentCard title="Orders Management">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 dark:border-white/[0.05]">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  All Orders
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage customer orders and update status
                </p>
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
                          Order ID
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Customer
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Items
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Total
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Status
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
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell className="px-5 py-4 text-start">
                              <span className="font-mono text-sm text-gray-800 dark:text-white/90">
                                #{order._id.slice(-8)}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div>
                                <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {order.name}
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {order.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div className="flex items-center gap-2">
                                <Package size={16} className="text-gray-400" />
                                <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                                  {order.order.length} items
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                £{order.total.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div className="flex items-center gap-2">
                                <Badge color={getStatusColor(order.status)} size="sm">
                                  {order.status}
                                </Badge>
                                <div className="w-24">
                                  <Select
                                    options={statusOptions}
                                    defaultValue={order.status}
                                    onChange={(value) => handleStatusUpdate(order._id, value)}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                            No orders found
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

      {/* Order Details Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} className="max-w-xl">
        {selectedOrder && (
          <div className="p-6 max-w-4xl">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
              Order Details #{selectedOrder._id.slice(-8)}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  Customer Information
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                    <p className="text-gray-800 dark:text-white/90">{selectedOrder.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                    <p className="text-gray-800 dark:text-white/90">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">WhatsApp:</span>
                    <p className="text-gray-800 dark:text-white/90">{selectedOrder.whatsapp}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  Shipping Address
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-white/90">
                    {selectedOrder.shippingAddress.address}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}<br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
                Order Items
              </h4>
              <div className="space-y-3">
                {selectedOrder.order.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 dark:text-white/90">{item.name}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Type: {item.type} {item.size && `• Size: ${item.size}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800 dark:text-white/90">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">
                Order Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-800 dark:text-white/90">${selectedOrder.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
                  <span className="text-gray-800 dark:text-white/90">${selectedOrder.delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium text-gray-800 dark:text-white/90">Total:</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Status and Date */}
            <div className="mt-6 flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
                <span className="ml-2">
                  <Badge color={getStatusColor(selectedOrder.status)} size="sm">
                    {selectedOrder.status}
                  </Badge>
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Ordered on {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Orders; 