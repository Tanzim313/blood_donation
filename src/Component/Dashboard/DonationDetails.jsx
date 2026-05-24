import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaCalendarAlt, FaClock, FaEnvelope, FaHospital, FaUser } from "react-icons/fa";
import { MdBloodtype, MdLocationOn } from "react-icons/md";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Authprovider/AuthContext";
import Donate from "../Home/Donate";

const DetailItem = ({ label, value, icon }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
    <p className="flex items-center gap-2 text-sm font-medium text-slate-500">{icon}{label}</p>
    <p className="mt-2 font-semibold text-slate-950">{value || "Not provided"}</p>
  </div>
);

const DonationDetails = () => {
  const axios = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const { id } = useParams();

  const { data: donation, isLoading } = useQuery({
    queryKey: ["donation-details", id],
    enabled: !!id && !!user,
    queryFn: async () => {
      const res = await axios.get(`/donations-request/${id}`, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }
  if (!donation) return <p className="text-center text-slate-600">No data found.</p>;

  const openModal = () => {
    setSelectedDonation(donation);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-red-600">Donation request</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{donation.recipientName}</h2>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <MdLocationOn />
              {donation.recipientDistrict}, {donation.recipientUpazila}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 font-bold text-red-700">
              <MdBloodtype />
              {donation.bloodGroup}
            </span>
            <span className="rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold capitalize text-slate-700">
              {donation.donationStatus}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="Requester" value={donation.requesterName} icon={<FaUser />} />
        <DetailItem label="Requester email" value={donation.requesterEmail} icon={<FaEnvelope />} />
        <DetailItem label="Hospital" value={donation.hospitalName} icon={<FaHospital />} />
        <DetailItem label="Donation date" value={donation.donationDate} icon={<FaCalendarAlt />} />
        <DetailItem label="Donation time" value={donation.donationTime} icon={<FaClock />} />
        <DetailItem label="Full address" value={donation.fullAddress} icon={<MdLocationOn />} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950">Request message</h3>
        <p className="mt-3 leading-7 text-slate-600">{donation.requestMessage || "No message provided."}</p>
        <div className="mt-6 flex justify-end">
          <button onClick={openModal} className="btn rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700">
            Donate
          </button>
        </div>
      </section>

      {isOpen && selectedDonation && (
        <Donate isOpen={isOpen} setIsOpen={setIsOpen} selectedDonation={selectedDonation} user={user} />
      )}
    </div>
  );
};

export default DonationDetails;
