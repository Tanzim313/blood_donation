import React, { useEffect, useState } from "react";
import { FaCalendarCheck, FaMapMarkerAlt, FaSearch, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router";

const statsTarget = {
  donors: 1250,
  bloodUnits: 3200,
  livesSaved: 2800,
};

const Banner = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    donors: 0,
    bloodUnits: 0,
    livesSaved: 0,
  });

  useEffect(() => {
    const duration = 1400;
    const interval = 24;
    let elapsed = 0;

    const counter = setInterval(() => {
      elapsed += interval;
      const progress = Math.min(elapsed / duration, 1);

      setStats({
        donors: Math.floor(statsTarget.donors * progress),
        bloodUnits: Math.floor(statsTarget.bloodUnits * progress),
        livesSaved: Math.floor(statsTarget.livesSaved * progress),
      });

      if (progress === 1) clearInterval(counter);
    }, interval);

    return () => clearInterval(counter);
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <p className="inline-flex rounded-md bg-red-50 px-3 py-2 text-sm font-semibold uppercase text-red-700">
            Blood donation network
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-6xl">
            Donate blood and reach urgent patients faster.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            LifeFlow connects donors, recipients, volunteers, and administrators in one focused platform for time-sensitive blood requests.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/register")}
              className="btn min-h-12 rounded-md border-red-600 bg-red-600 px-6 text-white hover:border-red-700 hover:bg-red-700"
            >
              <FaUserPlus />
              Join as Donor
            </button>
            <button
              onClick={() => navigate("/search")}
              className="btn min-h-12 rounded-md border-slate-300 bg-white px-6 text-slate-900 hover:border-red-300 hover:bg-red-50"
            >
              <FaSearch />
              Search Donors
            </button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ["Donors", stats.donors],
              ["Units", stats.bloodUnits],
              ["Lives", stats.livesSaved],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-2xl font-bold text-slate-950">{value}+</p>
                <p className="mt-1 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80"
            alt="Healthcare professional preparing blood donation equipment"
            className="h-[420px] w-full rounded-lg object-cover shadow-xl lg:h-[560px]"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/60 bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-red-600">
                  <FaMapMarkerAlt />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Location aware</p>
                  <p className="text-xs text-slate-500">District and upazila filters</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                  <FaCalendarCheck />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Request tracking</p>
                  <p className="text-xs text-slate-500">Pending, active, and complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
