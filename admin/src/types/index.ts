import React from "react";

// User/Admin Types
export interface Admin {
  _id: string;
  profileImage: string;
  name: string;
  username: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}


// Product Types
export interface Product {
  _id: string;
  name: string;
  type: "template" | "print";
  category: string;
  price: number;
  discount: number;
  finalPrice: number;
  // Size-specific frame pricing
  sizeSpecificPricing?: Record<string, {
    framePrice: number;
    frameDiscount: number;
  }>;
  inStock: boolean;
  images: string[];
  sizes?: string[];
  framedPrint: boolean;
  description?: string;
  productLink?: string;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  type: "template" | "print";
  products?: number;
  createdAt: string;
  updatedAt: string;
}

// Contact/Enquiry Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  whatsapp?: string;
  services: string[];
  references: string[];
  mediumOfContact: string;
  createdAt: string;
}

// Order Types
export interface OrderItem {
  _id: string;
  type: string;
  name: string;
  image: string;
  quantity: number;
  size: string;
  price: number;
}

export interface Order {
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

// Payment Types
export interface PaymentProduct {
  productId: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
  size?: string;
  productLink?: string;
}

export interface Payment {
  _id: string;
  customerEmail: string;
  customerName: string;
  stripePaymentIntentId: string;
  stripeCustomerId?: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "canceled";
  products: PaymentProduct[];
  metadata?: object;
  emailSent: boolean;
  emailSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  productCount: number;
  orderCount: number;
  completedOrders: Order[];
  contactCount: number;
  categoryCount: number;
  adminCount: number;
  totalPayments: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalRevenue: number;
  monthlyRevenue: {
    _id: {
      year: number;
      month: number;
    };
    revenue: number;
    count: number;
  }[];
}

// Common Types
export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// Form Types
export interface ProductFormData {
  type: string;
  name: string;
  description: string;
  price: string;
  discount: string;
  // Size-specific frame pricing
  sizeSpecificPricing: Record<string, {
    framePrice: string;
    frameDiscount: string;
  }>;
  category: string;
  inStock: boolean;
  productLink: string;
  sizes: string[];
  images: string[];
  digitalPrint: boolean;
  framedPrint: boolean;
  highQualityPrints: Record<string, string>;
}

export interface CategoryFormData {
  name: string;
  type: string;
}

export interface AdminFormData {
  profileImage: string;
  name: string;
  username: string;
  password?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  message: string;
  status: number;
}

// Modal Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

// Table Props
export interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;
  colSpan?: number;
}

// Component Props
export interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "error" | "warning" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

// Navigation Types
export interface NavItem {
  icon: React.ReactNode;
  name: string;
  path: string;
}

// Form Input Types
export interface SelectOption {
  value: string;
  label: string;
}

export interface MultiSelectOption {
  value: string;
  text: string;
  selected: boolean;
}

// Photo Uploader Types
export interface PhotosUploaderProps {
  addedPhotos: string[];
  maxPhotos: number;
  onChange: (photos: string[]) => void;
}

// Authentication Types
export interface AuthState {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  admin: Admin;
  token: string;
}

// Filter Types
export interface ProductFilters {
  type?: "template" | "print" | "all";
  category?: string;
  search?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface OrderFilters {
  status?: "pending" | "processing" | "completed" | "cancelled" | "all";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaymentFilters {
  status?: "pending" | "succeeded" | "failed" | "canceled" | "all";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}