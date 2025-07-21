"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import PhotosUploader from "@/components/photosUploader";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import { Loader2 } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  images: string[];
  description?: string;
  designConcept?: string;
  category: string;
}

const CATEGORIES = ["Branding", "Content Creation", "Web Design"];

const EditProject = () => {
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [designConcept, setDesignConcept] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProject, setFetchingProject] = useState(true);

  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get<Project>(
          `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`
        );
        const project = response.data;
        setTitle(project.title);
        setDescription(project.description || "");
        setDesignConcept(project.designConcept || "");
        setCategory(project.category || "");
        setImages(project.images);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to fetch project");
        router.push("/projects");
      } finally {
        setFetchingProject(false);
      }
    };

    fetchProject();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || images.length === 0 || !category) {
      toast.error("Title, category, and at least one image are required");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`,
        {
          title,
          description,
          designConcept,
          category,
          images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Project updated successfully");
      router.push("/projects");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cream-500" />
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Project" />

      <div className="space-y-6">
        <ComponentCard title="Project Information">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white appearance-none bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <TextArea
                  placeholder="Enter project description"
                  value={description}
                  onChange={(value) => setDescription(value)}
                  rows={4}
                />
              </div>

              {/* Design Concept */}
              <div>
                <TextArea
                  placeholder="Enter design concept"
                  value={designConcept}
                  onChange={(value) => setDesignConcept(value)}
                  rows={4}
                />
              </div>

              {/* Image Uploader */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Project Images
                </label>
                <PhotosUploader
                  addedPhotos={images}
                  maxPhotos={10}
                  onChange={setImages}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-cream-500 text-black dark:text-white rounded-lg hover:bg-cream-700 focus:outline-none focus:ring-2 focus:ring-cream-500 transition-colors dark:bg-cream-800 dark:hover:bg-cream-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Project"
                )}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
};

export default EditProject; 