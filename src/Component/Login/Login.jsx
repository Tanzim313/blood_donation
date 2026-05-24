import React, { useContext, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../Authprovider/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";


const Login = () => {
  const { signInUser } = useContext(AuthContext);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef();
  const navigate = useNavigate();

  const handleTogglePasswordShow = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    setError("");

    signInUser(email, password)
      .then(() => {
        event.target.reset();
        toast.success("Login Successful!");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleForgetPassword = () => {
    const email = emailRef.current?.value;
    navigate("/forgot-password", { state: { email } });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.18),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(248,113,113,0.16),_transparent_30%),bg-slate-950] py-16">
      <Toaster />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6 text-slate-100">
            <div className="inline-flex items-center gap-3 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
              Secure access for donors, hospitals, and volunteers
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Login to LifeFlow</h1>
              <p className="mt-4 max-w-xl text-slate-300">
                Manage your donor profile, create meaningful blood requests, and access hospital and volunteer dashboards in one modern platform.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.2em] text-red-300">Quick Access</p>
                <p className="mt-3 text-xl font-semibold text-white">Fast donor search</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.2em] text-red-300">Secure</p>
                <p className="mt-3 text-xl font-semibold text-white">Cookie-based auth</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-red-500/10">
            <h2 className="text-3xl font-semibold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Enter your credentials to continue.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  ref={emailRef}
                  name="email"
                  type="email"
                  required
                  placeholder="example@mail.com"
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>
              <div className="relative">
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Your password"
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 pr-14 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordShow}
                  className="absolute right-3 top-11 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                >
                  {showPassword ? <IoEye size={18} /> : <IoMdEyeOff size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <button type="button" onClick={handleForgetPassword} className="font-medium text-red-600 hover:text-red-700">
                  Forgot password?
                </button>
                <span>Need help?</span>
              </div>

              {error && <p className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-600">{error}</p>}

              <button type="submit" className="w-full rounded-3xl bg-red-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-700">
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              New to LifeFlow? <Link to="/register" className="font-semibold text-red-600 hover:text-red-700">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
