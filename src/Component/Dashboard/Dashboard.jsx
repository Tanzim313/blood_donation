import React, { use } from "react";
import { Link, Outlet } from "react-router";
import useRole from "../../Authprovider/useRole";
import { AuthContext } from "../../Authprovider/AuthContext";

const Dashboard = () => {
  const { role, isRoleLoading } = useRole();
  const {user} = use(AuthContext);

  if (isRoleLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="drawer ">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <nav className="navbar w-full bg-base-300 p-4">
          <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
            
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>

          </label>
          <div className="px-5 font-bold text-red-600 text-xl">Dashboard</div>
          <div className="mx-10">
          <img className="sm:w-[50px] sm:h-[50px] w-[30px] h-[30px] rounded-full border-2 border-red-600 border-[#ffffff8c]" src={user.photoURL} alt="" /> 
          </div>
        </nav>

        <Outlet />

      </div>

      
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

        <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content">

          
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/dashboard/profile">Profile</Link>
          </li>

          

          {role === "admin" && (
            <>
              <li><Link to="/dashboard">Admin Dashboard</Link></li>
              <li><Link to="/dashboard/all-users">Manage Users</Link></li>
              <li><Link to="/dashboard/all-donations">All Donations</Link></li>
            </>
          )}

          {role === "volunteer" && (
            <>
              <li><Link to="/dashboard">Volunteer Dashboard</Link></li>
              <li><Link to="/dashboard/all-donations-volunteer">All Donations</Link></li>
            </>
          )}


         
          {role === "donor" && (
            <>
              <li><Link to="/dashboard">Donor Dashboard</Link></li>
              <li><Link to="/dashboard/my-donation-requests">My Donation Requests</Link></li>
              <li><Link to="/dashboard/create-donation-request">Create Donation Request</Link></li>
            </>
          )}

        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
