import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormData({ name: "", email: "", message: "" });
    toast.success("Your message has been sent. We'll reply soon.");
  };

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <Toaster />

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase text-red-600">Contact</p>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Send feedback, report a workflow issue, or ask for support with donation requests.
          </p>

          <div className="mt-8 space-y-3">
            <a href="tel:01872164554" className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 hover:border-red-200 hover:bg-red-50">
              <FaPhoneAlt className="text-red-600" />
              <span className="font-semibold">01872 164554</span>
            </a>
            <a href="mailto:support@bloodfinding.com" className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 hover:border-red-200 hover:bg-red-50">
              <FaEnvelope className="text-red-600" />
              <span className="font-semibold">support@bloodfinding.com</span>
            </a>
          </div>
        </div>

        <form className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="form-control">
              <span className="label-text mb-2 font-medium text-slate-700">Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full bg-white"
                required
              />
            </label>
            <label className="form-control">
              <span className="label-text mb-2 font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full bg-white"
                required
              />
            </label>
          </div>
          <label className="form-control mt-4">
            <span className="label-text mb-2 font-medium text-slate-700">Message</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="textarea textarea-bordered min-h-36 w-full bg-white"
              required
            />
          </label>
          <button type="submit" className="btn mt-5 rounded-md border-red-600 bg-red-600 px-6 text-white hover:border-red-700 hover:bg-red-700">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
