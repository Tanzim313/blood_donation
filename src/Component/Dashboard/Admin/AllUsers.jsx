import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEnvelope, FaMapMarkerAlt, FaUserCircle, FaUsers } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { AuthContext } from "../../../Authprovider/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import UserActions from "./UserActions";

const statusOptions = [
  { value: "all", label: "All users" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

const roleTone = {
  admin: "bg-purple-50 text-purple-700 ring-purple-200",
  volunteer: "bg-blue-50 text-blue-700 ring-blue-200",
  donor: "bg-red-50 text-red-700 ring-red-200",
};

const AllUsers = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: userData = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["users", statusFilter],
    enabled: !!user,
    queryFn: async () => {
      const url = statusFilter === "all" ? "/users" : `/users?status=${statusFilter}`;
      const res = await axios.get(url, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      return res.data;
    },
  });

  const handleBlock = async (id) => {
    try {
      await axios.patch(`/users/${id}/status`, { status: "blocked" }, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      refetch();
      toast.success("User blocked successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to block user.");
    }
  };

  const handleUnblock = async (id) => {
    try {
      await axios.patch(`/users/${id}/status`, { status: "active" }, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      refetch();
      toast.success("User unblocked successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to unblock user.");
    }
  };

  const updateRole = async (id, role) => {
    try {
      await axios.patch(`/users/${id}/role`, { role }, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      refetch();
      toast.success(`User changed to ${role}.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }
  if (isError) return <p className="text-center text-red-600">Failed to load users.</p>;

  const activeUsers = userData.filter((item) => item.status === "active").length;
  const blockedUsers = userData.filter((item) => item.status === "blocked").length;

  return (
    <div className="space-y-6">
      <Toaster position="top-center" reverseOrder={false} />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-red-600">User management</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">Manage platform users</h2>
            <p className="mt-2 text-sm text-slate-500">Review profiles, roles, and access status across the platform.</p>
          </div>
          <label className="form-control w-full max-w-xs">
            <span className="label-text mb-2 font-medium text-slate-700">Status filter</span>
            <select className="select select-bordered w-full rounded-md bg-white" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Visible users</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{userData.length}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{activeUsers}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Blocked</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{blockedUsers}</p>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <FaUsers />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-950">Users</h3>
            <p className="text-sm text-slate-500">Role and access controls</p>
          </div>
        </div>

        {userData.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No users found for this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th>User</th>
                  <th>Blood</th>
                  <th>Location</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((item) => (
                  <tr key={item._id || item.email} className="align-top">
                    <td>
                      <div className="flex items-center gap-3">
                        {item.photo ? (
                          <img src={item.photo} alt="User avatar" className="h-12 w-12 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-2xl text-slate-400">
                            <FaUserCircle />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-950">{item.name || "Unnamed user"}</p>
                          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                            <FaEnvelope />
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
                        <MdBloodtype />
                        {item.blood || "N/A"}
                      </span>
                    </td>
                    <td>
                      <p className="flex items-center gap-1 text-sm text-slate-600">
                        <FaMapMarkerAlt className="text-slate-400" />
                        {item.district || "Not set"}, {item.upozila || "Not set"}
                      </p>
                    </td>
                    <td>
                      <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${roleTone[item.role] || "bg-slate-100 text-slate-700 ring-slate-200"}`}>
                        {item.role || "donor"}
                      </span>
                    </td>
                    <td>
                      <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${item.status === "active" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200"}`}>
                        {item.status || "active"}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end">
                        <UserActions
                          user={item}
                          onBlock={handleBlock}
                          onUnblock={handleUnblock}
                          onMakeVolunteer={(id) => updateRole(id, "volunteer")}
                          onMakeAdmin={(id) => updateRole(id, "admin")}
                          onMakeDonor={(id) => updateRole(id, "donor")}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export { AllUsers };
