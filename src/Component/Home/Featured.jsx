import React from "react";
import { FaHandHoldingHeart, FaMapMarkedAlt, FaUsers } from "react-icons/fa";

const features = [
  {
    icon: <FaHandHoldingHeart />,
    title: "Donor community",
    description: "Registered donor profiles make it easier to match patients with compatible blood groups.",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Location filters",
    description: "District and upazila filters reduce noise and help requesters focus on nearby donors.",
  },
  {
    icon: <FaUsers />,
    title: "Role-based dashboard",
    description: "Donors, volunteers, and admins each get focused tools for their daily responsibilities.",
  },
];

const Featured = () => {
  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase text-red-600">Platform strengths</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Built for urgent, repeatable workflows.</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-50 text-xl text-red-600">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
