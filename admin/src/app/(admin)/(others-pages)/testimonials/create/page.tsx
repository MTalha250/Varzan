"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import ProfilePicUploader from "@/components/profilePicUploader";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

const CreateTestimonial = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ image: "", name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/testimonial`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Testimonial created successfully");
      router.push("/testimonials");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Testimonial" />
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
              {loading ? "Creating..." : "Create Testimonial"}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default CreateTestimonial;


