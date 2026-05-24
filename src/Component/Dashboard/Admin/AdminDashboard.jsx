import React, { useContext } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaArrowRight, FaDonate, FaUsers } from "react-icons/fa";
import { MdBloodtype, MdVerifiedUser } from "react-icons/md";
import { AuthContext } from "../../../Authprovider/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const StatCard = ({ icon, label, value, tone }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      </div>
      <span className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl ${tone}`}>
        {icon}
      </span>
    </div>
  </article>
);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();

  const authHeader = {
    headers: {
      authorization: `Bearer ${user?.accessToken}`,
    },
  };

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    enabled: !!user,
    queryFn: async () => {
      const res = await axios.get("/users", authHeader);
      return res.data;
    },
  });

  const { data: funding = [], isLoading: fundingLoading } = useQuery({
    queryKey: ["funding"],
    enabled: !!user,
    queryFn: async () => {
      const res = await axios.get("/funding", authHeader);
      return res.data;
    },
  });

  const { data, isLoading: donationLoading } = useQuery({
    queryKey: ["donations"],
    enabled: !!user,
    queryFn: async () => {
      const res = await axios.get("/donations-request", authHeader);
      return res.data;
    },
  });

  const totalFunding = funding.reduce((acc, item) => acc + Number(item.amount || 0), 0);
  const activeUsers = users.filter((item) => item.status === "active").length;
  const totalDonation = data?.total || 0;
  const recentRequests = data?.result || [];
  const loading = usersLoading || fundingLoading || donationLoading;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase text-red-300">Admin command center</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Welcome back, {user?.displayName || "Admin"}.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Monitor donors, review donation requests, manage user access, and keep the blood donation workflow moving.
            </p>
          </div>
          <div className="grid min-w-64 grid-cols-2 gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
            <div>
              <p className="text-xs text-slate-400">Active users</p>
              <p className="mt-1 text-2xl font-bold">{activeUsers}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Blocked users</p>
              <p className="mt-1 text-2xl font-bold">{users.length - activeUsers}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/" className="btn btn-outline rounded-md border-slate-300 bg-slate-950 text-white hover:bg-slate-900">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard icon={<FaUsers />} label="Total users" value={users.length} tone="bg-blue-50 text-blue-600" />
        <StatCard icon={<FaDonate />} label="Total funding" value={formatMoney(totalFunding)} tone="bg-amber-50 text-amber-600" />
        <StatCard icon={<MdBloodtype />} label="Blood requests" value={totalDonation} tone="bg-red-50 text-red-600" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.55fr]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Recent requests</h3>
              <p className="text-sm text-slate-500">Latest donation requests in the system</p>
            </div>
            <Link to="/dashboard/all-donations" className="btn btn-sm rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700">
              View all
              <FaArrowRight />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th>Recipient</th>
                  <th>Blood</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.slice(0, 5).map((request) => (
                  <tr key={request._id}>
                    <td className="font-semibold text-slate-900">{request.recipientName}</td>
                    <td>
                      <span className="rounded-md bg-red-50 px-2.5 py-1 text-sm font-bold text-red-700">{request.bloodGroup}</span>
                    </td>
                    <td className="text-slate-600">{request.recipientDistrict}, {request.recipientUpazila}</td>
                    <td>
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
                        {request.donationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-xl text-emerald-600">
              <MdVerifiedUser />
            </span>
            <div>
              <h3 className="font-bold text-slate-950">Operational checklist</h3>
              <p className="text-sm text-slate-500">Admin focus for today</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {["Review pending requests", "Check blocked users", "Monitor new donations"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default AdminDashboard;
