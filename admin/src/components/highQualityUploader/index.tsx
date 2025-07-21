import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import React from "react";

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

interface HighQualityUploaderProps {
  images: Record<string, string>;
  onChange: (urls: Record<string, string>) => void;
  sizes: string[];
}

export default function HighQualityUploader({
  images,
  onChange,
  sizes,
}: HighQualityUploaderProps) {
  const [uploadingSize, setUploadingSize] = useState<string | null>(null);

  const uploadHighQualityImage = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);
    // Preserve original quality settings
    data.append("quality", "auto:best");
    data.append("fetch_format", "auto");
    data.append("flags", "preserve_transparency");

    const res = await axios.post(CLOUDINARY_UPLOAD_URL, data, {
      withCredentials: false,
    });

    return res.data.secure_url;
  };

  const validateFile = (file: File) => {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for high quality images
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size should not exceed 50MB for high-quality images");
    }
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Please upload a high-quality image file (JPEG, PNG, WebP, or TIFF)");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, size: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSize(size);
    try {
      validateFile(file);

      const url = await uploadHighQualityImage(file);
      
      toast.success(`High-quality ${size} image uploaded successfully`);
      onChange({ ...images, [size]: url });
    } catch (error: any) {
      toast.error(error.message || "Error uploading high-quality image");
      console.error(error);
    } finally {
      setUploadingSize(null);
      // Reset the input
      e.target.value = '';
    }
  };

  const removeImage = (size: string) => {
    if (uploadingSize === size) {
      toast.error("Cannot remove image while uploading");
      return;
    }
    const newImages = { ...images };
    delete newImages[size];
    onChange(newImages);
  };

  return (
    <div className="mt-2 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col gap-4">
            <h4 className="font-medium text-gray-900 dark:text-white">{size} Size</h4>
            {images[size] && (
              <div className="relative inline-block">
                <img 
                  className="h-32 w-auto max-w-xs object-contain rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm" 
                  src={images[size]} 
                  alt={`High Quality ${size} Print Preview`} 
                />
                <button
                  type="button"
                  onClick={() => removeImage(size)}
                  className="absolute -right-2 -top-2 rounded-full bg-cream-500 bg-opacity-90 p-2 text-white hover:bg-cream-600 transition-colors shadow-lg"
                  title={`Remove ${size} high-quality image`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <p>{size} high-quality image for digital downloads</p>
                  <p className="text-green-600 dark:text-green-400">✓ Original quality preserved</p>
                </div>
              </div>
            )}
            
            <label
              className={`text-gray-600 dark:text-gray-400 flex h-32 w-full cursor-pointer items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-col gap-2 ${
                uploadingSize === size ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <input
                type="file"
                disabled={uploadingSize === size}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, size)}
              />
              {uploadingSize !== size ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8 text-cream-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                  <div className="text-center">
                    <p className="font-medium">Upload {size} Image</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      For digital print downloads (up to 50MB)
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      JPEG, PNG, WebP, or TIFF • Original quality preserved
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cream-500"></div>
                  <p className="font-medium">Uploading {size} image...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Preserving original quality...
                  </p>
                </>
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
} 