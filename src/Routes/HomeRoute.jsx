import React, { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../Authprovider/AuthContext";
import Home from "../Component/Home/Home";

const HomeRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return <Home />;
};

export default HomeRoute;
