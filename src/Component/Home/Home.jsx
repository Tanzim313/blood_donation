import React from "react";
import { Link } from "react-router";
import Banner from "./Banner";
import Featured from "./Featured";
import ContactUs from "./ContactUs";

const steps = [
  ["01", "Create your profile", "Add your blood group, district, and upazila so recipients can find you quickly."],
  ["02", "Search with context", "Filter registered donors by blood group and location when every minute matters."],
  ["03", "Manage requests", "Track donation request status from pending to completed across the dashboard."],
];

const Home = () => {
  return (
    <div className="bg-slate-50">
      <Banner />

      <section className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-red-600">Fast connection</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              A practical workflow for donors and recipients.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              BloodFinding keeps the public journey simple while giving donors, volunteers, and admins the tools they need to keep requests moving.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/pending-donation"
                className="btn rounded-md border-red-600 bg-red-600 px-6 text-white hover:border-red-700 hover:bg-red-700"
              >
                View Requests
              </Link>
              <Link
                to="/funding"
                className="btn rounded-md border-slate-300 bg-white px-6 text-slate-900 hover:border-red-300 hover:bg-red-50"
              >
                Support Funding
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(([number, title, copy]) => (
              <article key={number} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold text-red-600">{number}</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Featured />
      <ContactUs />
    </div>
  );
};

export default Home;
