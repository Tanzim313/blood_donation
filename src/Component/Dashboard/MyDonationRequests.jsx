import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { FaCalendarAlt, FaClock, FaEye, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { MdBloodtype, MdLocationOn } from "react-icons/md";
import { AuthContext } from "../../Authprovider/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "cancel", label: "Cancel" },
];

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

const MyDonationRequests = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const limit = 5;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["donations", user?.email, statusFilter, page],
    enabled: !!user,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("email", user.email);

      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await axios.get(`/donations-request?${params.toString()}&page=${page}&limit=${limit}`, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });

      return res.data;
    },
    keepPreviousData: true,
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
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const recentDonations = [...donations].sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));

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

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-red-600">My requests</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">Donation request history</h2>
            <p className="mt-2 text-sm text-slate-500">Track, update, and manage every request you created.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="form-control w-full sm:w-56">
              <span className="label-text mb-2 font-medium text-slate-700">Status</span>
              <select
                className="select select-bordered w-full rounded-md bg-white"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
              >
                {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <Link to="/dashboard/create-donation-request" className="btn self-end rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700">
              <FaPlus />
              New Request
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Request queue</h3>
            <p className="text-sm text-slate-500">{total} requests found</p>
          </div>
        </div>

        {recentDonations.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-red-50 text-2xl text-red-600">
              <MdBloodtype />
            </div>
            <h4 className="mt-4 text-lg font-bold text-slate-950">No requests found</h4>
            <p className="mt-2 text-sm text-slate-500">Create a new request or change the selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th>Recipient</th>
                  <th>Schedule</th>
                  <th>Blood</th>
                  <th>Status</th>
                  <th>Donor</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentDonations.map((donation) => (
                  <tr key={donation._id} className="align-top">
                    <td>
                      <p className="font-semibold text-slate-950">{donation.recipientName}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <MdLocationOn />
                        {donation.recipientDistrict}, {donation.recipientUpazila}
                      </p>
                    </td>
                    <td>
                      <p className="flex items-center gap-2 text-sm text-slate-700">
                        <FaCalendarAlt className="text-slate-400" />
                        {donation.donationDate}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <FaClock className="text-slate-400" />
                        {donation.donationTime}
                      </p>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
                        <MdBloodtype />
                        {donation.bloodGroup}
                      </span>
                    </td>
                    <td><StatusBadge status={donation.donationStatus} /></td>
                    <td>
                      {donation.donationStatus === "inprogress" ? (
                        <div className="text-sm">
                          <p className="font-semibold text-slate-800">{donation.donorName || "Unknown donor"}</p>
                          <p className="mt-1 text-slate-500">{donation.donorEmail || "No email"}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Not assigned</span>
                      )}
                    </td>
                    <td>
                      <div className="flex flex-wrap justify-end gap-2">
                        {donation.donationStatus === "inprogress" && (
                          <>
                            <button onClick={() => handleStatus(donation._id, "done")} className="btn btn-xs rounded-md border-emerald-600 bg-emerald-600 text-white hover:border-emerald-700 hover:bg-emerald-700">Done</button>
                            <button onClick={() => handleStatus(donation._id, "cancel")} className="btn btn-xs rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-100">Cancel</button>
                          </>
                        )}
                        <Link to={`/dashboard/donation-request/${donation._id}`} className="btn btn-xs rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-100">
                          <FaEye />
                          View
                        </Link>
                        <Link to={`/dashboard/donation-edit/${donation._id}`} className="btn btn-xs rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-100">
                          <FaPen />
                          Edit
                        </Link>
                        <button onClick={() => setDeleteId(donation._id)} className="btn btn-xs rounded-md border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100">
                          <FaTrashAlt />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => setPage(num + 1)}
              className={`btn btn-sm rounded-md ${page === num + 1 ? "border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
            >
              {num + 1}
            </button>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box rounded-lg border border-red-100">
            <h3 className="text-xl font-bold text-slate-950">Delete donation request?</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">This action removes this request from your dashboard.</p>
            <div className="modal-action">
              <button className="btn rounded-md" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700" onClick={handleDelete}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDonationRequests;
