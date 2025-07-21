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
import { ChevronLeft, ChevronRight, Eye, Loader2, MessageSquare, Mail, Phone } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

interface Contact {
  _id: string;
  name: string;
  email: string;
  whatsapp?: string;
  services: string[];
  references: string[];
  mediumOfContact: string;
  createdAt: string;
}

const Enquiries = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 15;
  
  const { token } = useAuthStore();
  
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      let contactsData = response.data;
      
      // Filter by search term if provided
      if (searchTerm) {
        contactsData = contactsData.filter((contact: Contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Calculate pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedContacts = contactsData.slice(startIndex, endIndex);
      
      setContacts(paginatedContacts);
      setTotalEntries(contactsData.length);
      setTotalPages(Math.ceil(contactsData.length / itemsPerPage));
    } catch (error) {
      console.log("Error fetching contacts:", error);
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchContacts();
  }, [currentPage, token]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1);
      fetchContacts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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

  const getMediumColor = (medium: string) => {
    switch (medium.toLowerCase()) {
      case "email":
        return "info";
      case "whatsapp":
        return "success";
      case "phone":
        return "warning";
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
      <PageBreadcrumb pageTitle="Enquiries" />
      <div className="space-y-6">
        <ComponentCard title="Customer Enquiries">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 dark:border-white/[0.05]">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  All Enquiries
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Customer contact submissions and service inquiries
                </p>
              </div>
              
              {/* Search */}
              <div className="relative w-full sm:w-64 mt-4 sm:mt-0">
                <input
                  type="text"
                  placeholder="Search enquiries..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
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
                          Customer
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Services Interested
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Contact Medium
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          References
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
                      {contacts.length > 0 ? (
                        contacts.map((contact) => (
                          <TableRow key={contact._id}>
                            <TableCell className="px-5 py-4 text-start">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-cream-100 dark:bg-cream-900/20 rounded-full flex items-center justify-center">
                                  <MessageSquare className="w-5 h-5 text-cream-600 dark:text-cream-400" />
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {contact.name}
                                  </span>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {contact.email}
                                  </p>
                                  {contact.whatsapp && (
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                      WhatsApp: {contact.whatsapp}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div className="space-y-1">
                                {contact.services.length > 0 ? (
                                  contact.services.slice(0, 2).map((service, index) => (
                                    <span key={index} className="mr-1">
                                      <Badge color="info" size="sm">
                                        {service}
                                      </Badge>
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-500 text-sm">No services specified</span>
                                )}
                                {contact.services.length > 2 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{contact.services.length - 2} more
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <Badge color={getMediumColor(contact.mediumOfContact)} size="sm">
                                {contact.mediumOfContact}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div className="space-y-1">
                                {contact.references.length > 0 ? (
                                  contact.references.slice(0, 2).map((reference, index) => (
                                    <span key={index} className="inline-block text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded mr-1">
                                      {reference}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-500 text-sm">No references</span>
                                )}
                                {contact.references.length > 2 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                    +{contact.references.length - 2} more
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <button
                                onClick={() => handleViewContact(contact)}
                                className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                            No enquiries found
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

      {/* Contact Details Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} className="max-w-xl">
        {selectedContact && (
          <div className="p-6 max-w-3xl">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
              Enquiry Details
            </h3>
            
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                    <p className="text-gray-800 dark:text-white/90">{selectedContact.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        {selectedContact.email}
                      </a>
                    </div>
                  </div>
                  {selectedContact.whatsapp && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">WhatsApp:</span>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-green-500" />
                        <a
                          href={`https://wa.me/${selectedContact.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 dark:text-green-400"
                        >
                          {selectedContact.whatsapp}
                        </a>
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Contact:</span>
                    <div className="mt-1">
                      <Badge color={getMediumColor(selectedContact.mediumOfContact)} size="sm">
                        {selectedContact.mediumOfContact}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services of Interest */}
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">
                  Services of Interest
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedContact.services.length > 0 ? (
                    selectedContact.services.map((service, index) => (
                      <Badge key={index} color="info" size="sm">
                        {service}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No specific services mentioned</p>
                  )}
                </div>
              </div>

              {/* References */}
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-3">
                  How They Found Us
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedContact.references.length > 0 ? (
                    selectedContact.references.map((reference, index) => (
                      <span key={index} className="inline-block text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                        {reference}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No references provided</p>
                  )}
                </div>
              </div>

              {/* Enquiry Date */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Enquiry Date:</span>
                  <span className="text-gray-800 dark:text-white/90">
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Mail size={16} />
                  Send Email
                </a>
                {selectedContact.whatsapp && (
                  <a
                    href={`https://wa.me/${selectedContact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Phone size={16} />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Enquiries; 