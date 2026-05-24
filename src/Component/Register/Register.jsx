import React, { useContext, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { AuthContext } from "../../Authprovider/AuthContext";
import { auth } from "../../firebase.init";
import { sendEmailVerification } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const { createUser, updateUser } = useContext(AuthContext);
  const { districts = [], upozilas = [] } = useLoaderData();
  const navigate = useNavigate();
  const axios = useAxiosSecure();

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredUpozilas = useMemo(
    () => upozilas.filter((item) => item.district_id === selectedDistrict),
    [upozilas, selectedDistrict]
  );

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleTogglePassword = (event) => {
    event.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.target;
    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const blood = form.blood.value;
    const districtId = form.district.value;
    const upozila = form.upozila.value;
    const districtName = districts.find((district) => district.id === districtId)?.name || "";

    if (!fullName || !email || !password || !confirmPassword || !blood || !districtId || !upozila) {
      setError("Please complete all required fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await createUser(email, password);
      await updateUser({ displayName: fullName, photoURL: photoPreview || "" });
      await axios.post("/users", {
        name: fullName,
        email,
        photo: photoPreview || "",
        blood,
        district: districtName,
        upozila,
      });
      await sendEmailVerification(auth.currentUser);

      toast.success("Registration successful. Please verify your email.");
      form.reset();
      setSelectedDistrict("");
      setPhotoPreview("");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.18),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(248,113,113,0.16),_transparent_30%),bg-slate-950] py-16">
      <Toaster />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6 text-slate-100">
            <div className="inline-flex items-center gap-3 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
              Create a donor profile with district and upazila selection
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Join BloodFinding today</h1>
              <p className="mt-4 max-w-xl text-slate-300">
                Register as a donor to manage your profile, save your preferred location, and receive updates for blood requests near you.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.2em] text-red-300">Verified members</p>
                <p className="mt-3 text-xl font-semibold text-white">Secure donor registration</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.2em] text-red-300">Local coverage</p>
                <p className="mt-3 text-xl font-semibold text-white">Choose your district and upazila</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-red-500/10">
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-slate-900">Create account</h2>
              <p className="mt-2 text-sm text-slate-500">Register now to support blood donation requests across your area.</p>
            </div>

            {error && (
              <div className="mb-4 rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                <input
                  name="fullName"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="example@mail.com"
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a password"
                    className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 pr-14 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute right-3 top-[42px] inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                  >
                    {showPassword ? <IoEye size={18} /> : <IoMdEyeOff size={18} />}
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Confirm your password"
                    className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Blood group</label>
                  <select
                    name="blood"
                    required
                    className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Profile photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:text-white file:font-semibold focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              {photoPreview && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Photo preview</p>
                  <img src={photoPreview} alt="Avatar preview" className="mt-3 h-24 w-24 rounded-full object-cover" />
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">District</label>
                  <select
                    name="district"
                    required
                    value={selectedDistrict}
                    onChange={(event) => {
                      setSelectedDistrict(event.target.value);
                    }}
                    className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Upozila</label>
                  <select
                    name="upozila"
                    required
                    disabled={!selectedDistrict}
                    className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">Select Upozila</option>
                    {filteredUpozilas.map((upozila) => (
                      <option key={upozila.id} value={upozila.name}>
                        {upozila.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-red-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="font-semibold text-red-600 hover:text-red-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
