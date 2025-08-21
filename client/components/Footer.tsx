"use client";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import React, { useState } from "react";
import { sendContact } from "@/lib/api";
import toast from "react-hot-toast";

const Footer = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      form.firstName === "" ||
      form.lastName === "" ||
      form.email === "" ||
      form.message === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    setLoading(true);
    try {
      await sendContact(form);
      toast.success("Message sent successfully!");
      setForm({ firstName: "", lastName: "", email: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-20">
      <h1 className="text-center text-xl sm:text-2xl md:text-3xl uppercase tracking-widest">
        Contact Us
      </h1>
      <p className="text-justify sm:text-center text-primary mt-8 max-w-2xl mx-auto">
        If you have questions or comments, please get a hold of us in whichever
        way is most convenient. Ask away. There is no reasonable question that
        our team cannot answer.
      </p>
      <div className="flex flex-col sm:flex-row mt-16">
        <div className="w-full sm:w-1/2">
          <h2 className="text-lg">GET IN TOUCH</h2>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center gap-2">
              <div className="bg-primary rounded-full p-2 w-10 h-10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="">2A-1 Rajput Town Canal Road,Lahore</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="bg-primary rounded-full p-2 w-10 h-10 flex items-center justify-center">
                <PhoneCall className="w-4 h-4 text-white" />
              </div>
              <span className="">+92 320 7412047</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="bg-primary rounded-full p-2 w-10 h-10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="">info.varzan@gmail.com</span>
            </li>
          </ul>
          <h2 className="text-lg mt-8">FOLLOW US</h2>
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.instagram.com/varzan_1980"
              target="_blank"
              className="bg-primary rounded-full p-2 w-10 h-10 shrink-0 flex items-center justify-center"
            >
              <FaInstagram className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61578841522870"
              target="_blank"
              className="bg-primary rounded-full p-2 w-10 h-10 shrink-0 flex items-center justify-center"
            >
              <FaFacebook className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://www.youtube.com/@Varzan-1980"
              target="_blank"
              className="bg-primary rounded-full p-2 w-10 h-10 shrink-0 flex items-center justify-center"
            >
              <FaYoutube className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              className="bg-primary rounded-full p-2 w-10 h-10 shrink-0 flex items-center justify-center"
            >
              <FaTiktok className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
        <form
          className="w-full sm:w-1/2 mt-8 sm:mt-0 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full p-2 border border-primary rounded"
              value={form.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full p-2 border border-primary rounded"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-primary rounded"
            value={form.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Message"
            className="w-full p-2 border border-primary rounded"
            rows={5}
            value={form.message}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded w-fit cursor-pointer"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Footer;
