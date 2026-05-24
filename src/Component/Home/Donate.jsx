import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Donate = ({ isOpen, setIsOpen, selectedDonation, user }) => {
  const axios = useAxiosSecure();
  const queryClient = useQueryClient();

  const donationMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.put(`/pending-donations/${selectedDonation._id}`, {
        donationStatus: "inprogress",
        donorName: user.displayName,
        donorEmail: user.email,
      }, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pending-donations"]);
      setIsOpen(false);
      toast.success("Donation confirmed successfully.");
    },
    onError: (err) => {
      console.error("Error confirming donation:", err);
      toast.error("Failed to confirm donation.");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-red-600">Confirm donation</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">Ready to help?</h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 font-bold text-red-700">
            <MdBloodtype />
            {selectedDonation.bloodGroup}
          </span>
        </div>

        <div className="mt-5 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
          <p className="flex items-center gap-2 text-slate-700">
            <FaUser className="text-slate-400" />
            <span className="font-semibold">Donor:</span>
            {user.displayName || "Unknown donor"}
          </p>
          <p className="flex items-center gap-2 text-slate-700">
            <FaEnvelope className="text-slate-400" />
            <span className="font-semibold">Email:</span>
            {user.email}
          </p>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          Confirming will assign you to this request and move it to in-progress status.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="btn rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={donationMutation.isPending}
            onClick={() => donationMutation.mutate()}
            className="btn rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700"
          >
            {donationMutation.isPending ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Donate;
