import React, { useContext } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { FaClipboardList, FaHeartPulse, FaHouse, FaUser, FaUsersGear } from "react-icons/fa6";
import { MdBloodtype, MdOutlineVolunteerActivism } from "react-icons/md";
import useRole from "../../Authprovider/useRole";
import { AuthContext } from "../../Authprovider/AuthContext";

const linkBase =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition";

const Dashboard = () => {
  const { role, isRoleLoading } = useRole();
  const { user } = useContext(AuthContext);

  const links = [
    { to: "/", label: "Home", icon: <FaHouse />, end: true },
    { to: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
    ...(role === "admin"
      ? [
          { to: "/dashboard", label: "Admin Overview", icon: <FaHeartPulse />, end: true },
          { to: "/dashboard/all-users", label: "Manage Users", icon: <FaUsersGear /> },
          { to: "/dashboard/all-donations", label: "All Requests", icon: <MdBloodtype /> },
        ]
      : []),
    ...(role === "volunteer"
      ? [
          { to: "/dashboard", label: "Volunteer Overview", icon: <MdOutlineVolunteerActivism />, end: true },
          { to: "/dashboard/all-donations-volunteer", label: "All Requests", icon: <MdBloodtype /> },
        ]
      : []),
    ...(role === "donor"
      ? [
          { to: "/dashboard", label: "Donor Overview", icon: <FaHeartPulse />, end: true },
          { to: "/dashboard/my-donation-requests", label: "My Requests", icon: <FaClipboardList /> },
          { to: "/dashboard/create-donation-request", label: "Create Request", icon: <MdBloodtype /> },
        ]
      : []),
  ];

  if (isRoleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open bg-slate-100">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content min-h-screen">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost lg:hidden">
                <span className="sr-only">Open dashboard menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
              <div>
                <p className="text-xs font-semibold uppercase text-red-600">{role || "member"} workspace</p>
                <h1 className="text-lg font-bold text-slate-950 sm:text-2xl">BloodFinding Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <img
                className="h-10 w-10 rounded-lg object-cover"
                src={user?.photoURL || "https://i.pravatar.cc/80"}
                alt={user?.displayName || "User avatar"}
              />
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-950">{user?.displayName || "BloodFinding User"}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <aside className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <div className="flex min-h-full w-72 flex-col border-r border-slate-200 bg-slate-950 p-4 text-slate-300">
          <Link to="/" className="mb-8 flex items-center gap-3 rounded-lg bg-white/5 p-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-600 font-bold">BF</span>
            <div>
              <p className="font-bold">BloodFinding</p>
              <p className="text-xs text-slate-400">Donation operations</p>
            </div>
          </Link>

          <nav className="space-y-1">
            {links.map((item) => (
              <NavLink
                key={`${item.to}-${item.label}`}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Account role</p>
            <p className="mt-1 text-sm capitalize text-slate-400">{role}</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
