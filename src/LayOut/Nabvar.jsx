import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../Authprovider/AuthContext";

const Nabvar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error(error);
    }
  };

  const links = (
    <>
      {!user && (
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition text-base md:text-lg font-medium ${
                isActive ? "text-red-600" : "text-slate-800"
              }`
            }
          >
            Home
          </NavLink>
        </li>
      )}
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `transition text-base md:text-lg font-medium ${
                isActive ? "text-red-600" : "text-slate-800"
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
      <li>
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `transition text-base md:text-lg font-medium ${
              isActive ? "text-red-600" : "text-slate-800"
            }`
          }
        >
          Search Donors
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/pending-donation"
          className={({ isActive }) =>
            `transition text-base md:text-lg font-medium ${
              isActive ? "text-red-600" : "text-slate-800"
            }`
          }
        >
          Requests
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/funding"
            className={({ isActive }) =>
              `transition text-base md:text-lg font-medium ${
                isActive ? "text-red-600" : "text-slate-800"
              }`
            }
          >
            Funding
          </NavLink>
        </li>
      )}
      {!user && (
        <>
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `transition text-base md:text-lg font-medium ${
                  isActive ? "text-red-600" : "text-slate-800"
                }`
              }
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `transition text-base md:text-lg font-medium ${
                  isActive ? "text-red-600" : "text-slate-800"
                }`
              }
            >
              Register
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-red-600 text-white shadow-sm">
            BF
          </span>
          <div className="hidden sm:block">
            <p className="text-sm uppercase tracking-[0.2em] text-red-600">BloodFinding</p>
            <p className="font-semibold text-slate-900">Blood Donation Platform</p>
          </div>
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">{links}</ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-300 hover:text-red-600"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm"
              >
                <img src={user.photoURL || "https://i.pravatar.cc/40"} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
                  <div className="space-y-2 p-4">
                    <Link
                      to="/dashboard"
                      className="block rounded-md px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-red-50"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              Login
            </Link>
          )}
        </div>

        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="dropdown-content menu rounded-box mt-3 w-52 bg-white p-4 shadow-xl ring-1 ring-slate-900/5">
            {links}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Nabvar;
