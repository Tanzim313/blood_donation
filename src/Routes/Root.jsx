import React from "react";
import { Outlet } from "react-router";
import Nabvar from "../LayOut/Nabvar";
import Footer from "../LayOut/Footer";

const Root = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Nabvar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Root;
