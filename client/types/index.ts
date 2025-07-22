// Product Types
export interface Product {
  _id: string;
  name: string;
  images: string[];
  category: string;
  details: string[];
  inStock: boolean;
  inHighlight: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  products?: number;
  createdAt: string;
  updatedAt: string;
}

// Contact/Enquiry Types
export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  message: string;
  status: number;
}
