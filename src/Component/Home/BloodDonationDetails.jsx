import React, { useContext, useState } from "react";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaCalendarAlt, FaClock, FaEnvelope, FaHospital, FaUser } from "react-icons/fa";
import { MdBloodtype, MdLocationOn } from "react-icons/md";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Authprovider/AuthContext";
import Donate from "./Donate";

const statusTone = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  inprogress: "bg-blue-50 text-blue-700 ring-blue-200",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancel: "bg-slate-100 text-slate-700 ring-slate-200",
};

const DetailCard = ({ icon, label, value }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <p className="flex items-center gap-2 text-sm font-medium text-slate-500">{icon}{label}</p>
    <p className="mt-2 font-semibold text-slate-950">{value || "Not provided"}</p>
  </article>
);

const BloodDonationDetails = () => {
  const { id } = useParams();
  const axios = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const { data: pending, isLoading, isError } = useQuery({
    queryKey: ["pending-donations", id],
    enabled: !!id && !!user,
    queryFn: async () => {
      const res = await axios.get(`/pending-donations/${id}`, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      return res.data;
    },
  });

  const openModal = () => {
    setSelectedDonation(pending);
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (isError || !pending) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">Donation request not found</h1>
          <p className="mt-3 text-sm text-slate-500">The request may have been removed or is no longer available.</p>
          <Link to="/pending-donation" className="btn mt-6 rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700">
            Back to Requests
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_0.38fr] lg:p-8">
            <div>
              <p className="text-sm font-semibold uppercase text-red-600">Pending donation request</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-5xl">{pending.recipientName}</h1>
              <p className="mt-4 flex items-center gap-2 text-base text-slate-600">
                <MdLocationOn className="text-red-600" />
                {pending.recipientDistrict}, {pending.recipientUpazila}
              </p>
              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                {pending.requestMessage || "No additional message was provided for this request."}
              </p>
            </div>

            <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 text-lg font-bold text-red-700">
                  <MdBloodtype />
                  {pending.bloodGroup}
                </span>
                <span className={`rounded-md px-3 py-1 text-xs font-semibold capitalize ring-1 ${statusTone[pending.donationStatus] || "bg-slate-100 text-slate-700 ring-slate-200"}`}>
                  {pending.donationStatus}
                </span>
              </div>
              <button
                onClick={openModal}
                disabled={pending.donationStatus !== "pending"}
                className="btn mt-5 w-full rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700 disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500"
              >
                Donate Now
              </button>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Confirm only when you can contact the requester and attend the donation schedule.
              </p>
            </aside>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailCard icon={<FaUser />} label="Requester" value={pending.requesterName} />
          <DetailCard icon={<FaEnvelope />} label="Requester email" value={pending.requesterEmail} />
          <DetailCard icon={<FaHospital />} label="Hospital" value={pending.hospitalName} />
          <DetailCard icon={<MdLocationOn />} label="Full address" value={pending.fullAddress} />
          <DetailCard icon={<FaCalendarAlt />} label="Donation date" value={pending.donationDate} />
          <DetailCard icon={<FaClock />} label="Donation time" value={pending.donationTime} />
        </div>

        <div className="rounded-lg border border-red-100 bg-red-50 p-5">
          <h2 className="font-bold text-red-800">Important donor note</h2>
          <p className="mt-2 text-sm leading-6 text-red-700">
            Please verify hospital details, donation time, and requester contact information before confirming your donation.
          </p>
        </div>
      </div>

      {isOpen && selectedDonation && (
        <Donate isOpen={isOpen} setIsOpen={setIsOpen} selectedDonation={selectedDonation} user={user} />
      )}
    </section>
  );
};

export default BloodDonationDetails;
