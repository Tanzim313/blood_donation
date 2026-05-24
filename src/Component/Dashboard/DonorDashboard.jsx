import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { FaCalendarAlt, FaClock, FaEye, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { MdBloodtype, MdLocationOn } from "react-icons/md";
import { AuthContext } from "../../Authprovider/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const statusTone = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  inprogress: "bg-blue-50 text-blue-700 ring-blue-200",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancel: "bg-slate-100 text-slate-700 ring-slate-200",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${statusTone[status] || "bg-slate-100 text-slate-700 ring-slate-200"}`}>
    {status || "unknown"}
  </span>
);

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["donations", user?.email],
    enabled: !!user,
    queryFn: async () => {
      const res = await axios.get(`/donations-request?email=${user.email}`, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      return res.data;
    },
  });

  if (!user) return <p className="text-center text-slate-600">Loading user...</p>;
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }
  if (isError) return <p className="text-center text-red-600">Failed to load donation requests.</p>;

  const donations = data?.result || [];
  const total = data?.total || donations.length;
  const recentDonations = [...donations]
    .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
    .slice(0, 4);
  const pendingCount = donations.filter((item) => item.donationStatus === "pending").length;
  const completedCount = donations.filter((item) => item.donationStatus === "done").length;

  const handleDelete = async () => {
    if (!deleteId) return;

    await axios.delete(`/donations-request/${deleteId}`, {
      headers: {
        authorization: `Bearer ${user?.accessToken}`,
      },
    });

    toast.success("Donation request deleted.");
    setDeleteId(null);
    refetch();
  };

  const handleStatus = async (id, donationStatus) => {
    await axios.patch(`/donations-request/status/${id}`, { donationStatus }, {
      headers: {
        authorization: `Bearer ${user?.accessToken}`,
      },
    });

    toast.success(`Request marked as ${donationStatus}.`);
    refetch();
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" reverseOrder={false} />

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold uppercase text-red-600">Donor workspace</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              Welcome, {user?.displayName || "Donor"}.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              Track your donation requests, update active cases, and create a new request when someone needs blood support.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link to="/dashboard/create-donation-request" className="btn rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700">
              <FaPlus />
              New Request
            </Link>
            <Link to="/dashboard/my-donation-requests" className="btn rounded-md border-slate-300 bg-white text-slate-900 hover:border-red-300 hover:bg-red-50">
              View All Requests
            </Link>
            <Link to="/" className="btn rounded-md border-slate-300 bg-slate-950 text-white hover:bg-slate-900">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total requests</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{total}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending review</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{pendingCount}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Completed</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{completedCount}</p>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Recent donation requests</h3>
            <p className="text-sm text-slate-500">Your latest requests and next actions</p>
          </div>
        </div>

        {recentDonations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-red-50 text-2xl text-red-600">
              <MdBloodtype />
            </div>
            <h4 className="mt-4 text-lg font-bold text-slate-950">No requests yet</h4>
            <p className="mt-2 text-sm text-slate-500">Create your first donation request to start tracking it here.</p>
            <Link to="/dashboard/create-donation-request" className="btn mt-5 rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700">
              <FaPlus />
              Create Request
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 p-5 xl:grid-cols-2">
            {recentDonations.map((donation) => (
              <article key={donation._id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-950">{donation.recipientName}</h4>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <MdLocationOn className="text-slate-400" />
                      {donation.recipientDistrict}, {donation.recipientUpazila}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
                    <MdBloodtype />
                    {donation.bloodGroup}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-slate-400" />
                    {donation.donationDate}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaClock className="text-slate-400" />
                    {donation.donationTime}
                  </p>
                  <StatusBadge status={donation.donationStatus} />
                </div>

                {donation.donationStatus === "inprogress" && (
                  <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                    <p className="font-semibold">Donor assigned</p>
                    <p>{donation.donorName || "Unknown donor"} · {donation.donorEmail || "No email"}</p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {donation.donationStatus === "inprogress" && (
                    <>
                      <button onClick={() => handleStatus(donation._id, "done")} className="btn btn-sm rounded-md border-emerald-600 bg-emerald-600 text-white hover:border-emerald-700 hover:bg-emerald-700">
                        Done
                      </button>
                      <button onClick={() => handleStatus(donation._id, "cancel")} className="btn btn-sm rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-100">
                        Cancel
                      </button>
                    </>
                  )}
                  <Link to={`/dashboard/donation-request/${donation._id}`} className="btn btn-sm rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-100">
                    <FaEye />
                    View
                  </Link>
                  <Link to={`/dashboard/donation-edit/${donation._id}`} className="btn btn-sm rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-100">
                    <FaPen />
                    Edit
                  </Link>
                  <button onClick={() => setDeleteId(donation._id)} className="btn btn-sm rounded-md border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100">
                    <FaTrashAlt />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box rounded-lg border border-red-100">
            <h3 className="text-xl font-bold text-slate-950">Delete donation request?</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This action removes the request from your dashboard and cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn rounded-md" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700" onClick={handleDelete}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
