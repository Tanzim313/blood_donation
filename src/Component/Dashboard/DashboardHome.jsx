import React from "react";
import useRole from "../../Authprovider/useRole";
import AdminDashboard from "./Admin/AdminDashboard";
import DonorDashboard from "./DonorDashboard";
import VolunteerDashboard from "./Volunteer/VolunteerDashboard";

const DashboardHome = () => {
  const { role, isRoleLoading } = useRole();

  if (isRoleLoading) {
    return <div>Loading...</div>;
  }

  if (role === "admin") return <AdminDashboard />;
  else if (role === "volunteer") return <VolunteerDashboard/>
  
  return <DonorDashboard/>;

};

export default DashboardHome;

