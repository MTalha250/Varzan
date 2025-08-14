"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import ProfilePicUploader from "@/components/profilePicUploader";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";

const EditTestimonial = () => {
  const { token } = useAuthStore();
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ image: "", name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/testimonial/${id}`);
        const t = res.data.testimonial;
        setForm({ image: t?.image || "", name: t?.name || "", email: t?.email || "", message: t?.message || "" });
      } catch (e) {
        toast.error("Failed to load testimonial");
        router.push("/testimonials");
      } finally {
        setFetching(false);
      }
    };
    if (id) load();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/testimonial/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Testimonial updated successfully");
      router.push("/testimonials");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update testimonial");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Testimonial" />
      <ComponentCard title="Testimonial Information">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Profile Picture (Optional)</Label>
            <ProfilePicUploader
              profilePic={form.image}
              onChange={(photo) => setForm((p) => ({ ...p, image: photo }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Name *</Label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div>
            <Label>Message *</Label>
            <TextArea
              value={form.message}
              onChange={(val) => setForm((p) => ({ ...p, message: val }))}
              placeholder="Write the testimonial message"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-500 text-black rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors dark:bg-primary-800 dark:text-white dark:hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Testimonial"}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default EditTestimonial;


