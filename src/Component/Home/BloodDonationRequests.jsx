import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTint } from "react-icons/fa";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BloodDonationRequests = () => {
  const axios = useAxiosSecure();

  const {data:donations = [], isLoading} = useQuery({
    queryKey:["pending-donations"],
    queryFn: async()=>{
      const res = await axios.get("/pending-donations");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase text-red-600">Donation requests</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-5xl">Pending blood requests.</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Review active requests and open the details page when you are ready to donate.
          </p>
        </div>

        {donations.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            No pending donation requests are available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {donations.map((pending)=>(
              <article key={pending._id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{pending.recipientName}</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <FaMapMarkerAlt className="text-slate-400" />
                      {pending.recipientDistrict}, {pending.recipientUpazila}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
                    <FaTint />
                    {pending.bloodGroup}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-slate-400" />
                    {pending.donationDate}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaClock className="text-slate-400" />
                    {pending.donationTime}
                  </p>
                </div>

                <Link
                  to={`/pending-details/${pending._id}`}
                  className="btn mt-5 w-full rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700"
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BloodDonationRequests;
