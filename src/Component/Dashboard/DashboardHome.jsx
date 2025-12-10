import React from "react";
import useRole from "../../Authprovider/useRole";
import AdminDashboard from "./Admin/AdminDashboard";
import DonorDashboard from "./DonorDashboard";

const DashboardHome = () => {
  const { role, isRoleLoading } = useRole();

  if (isRoleLoading) {
    return <div>Loading...</div>;
  }

  if (role === "admin") return <AdminDashboard />;
  
  
  return <DonorDashboard/>;

};

export default DashboardHome;

