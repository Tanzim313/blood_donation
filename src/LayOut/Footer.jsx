import React from "react";
import { Link } from "react-router";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-4 py-12 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-white">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-red-600 font-bold">LF</span>
            <span className="font-semibold">LifeFlow</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            A focused blood donation platform for donors, recipients, volunteers, and administrators.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase text-white">Quick links</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link className="hover:text-white" to="/">Home</Link></li>
            <li><Link className="hover:text-white" to="/search">Search Donors</Link></li>
            <li><Link className="hover:text-white" to="/pending-donation">Donation Requests</Link></li>
            <li><Link className="hover:text-white" to="/funding">Funding</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase text-white">Stay connected</h3>
          <div className="mt-4 flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white hover:bg-red-600">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="YouTube" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white hover:bg-red-600">
              <FaYoutube />
            </a>
            <a href="#" aria-label="LinkedIn" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white hover:bg-red-600">
              <FaLinkedinIn />
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-400">support@lifeflow.com</p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-800 pt-6 text-sm text-slate-500">
        &copy; {new Date().getFullYear()} LifeFlow. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
