import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { FaEnvelope, FaMapMarkerAlt, FaPen, FaSave, FaTint, FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../Authprovider/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

const fieldClass = "input input-bordered w-full rounded-md bg-white text-slate-900 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-600";
const selectClass = "select select-bordered w-full rounded-md bg-white text-slate-900 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-600";

const Profile = () => {
  const { user, loading, updateUser } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => (await axios.get("/district")).data,
  });

  const { data: upazilas = [] } = useQuery({
    queryKey: ["upazilas"],
    queryFn: async () => (await axios.get("/upazila")).data,
  });

  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["profile", user?.email],
    enabled: !!user?.email && districts.length > 0,
    queryFn: async () => (
      await axios.get(`/profile/${user.email}`, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      })
    ).data,
  });

  const profileDistrictId = districts.find((item) => item.name === profile.district)?.id || "";
  const activeDistrictId = isEditing ? selectedDistrict : profileDistrictId;
  const visibleData = isEditing ? formData : profile;
  const filteredUpazilas = upazilas.filter((item) => item.district_id === activeDistrictId);

  const mutation = useMutation({
    mutationFn: async (data) => axios.patch("/profile", data, {
      headers: {
        authorization: `Bearer ${user?.accessToken}`,
      },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", user.email]);
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    },
    onError: () => {
      toast.error("Profile update failed.");
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "district") {
      setSelectedDistrict(value);
      setFormData((current) => ({
        ...current,
        upozila: "",
      }));
      return;
    }

    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async () => {
    const districtName = districts.find((item) => item.id === selectedDistrict)?.name || "";

    try {
      await updateUser({ displayName: formData.name, photoURL: formData.photo });
      mutation.mutate({
        ...formData,
        email: user.email,
        district: districtName,
      });
    } catch (err) {
      console.error("Firebase profile update failed:", err);
      toast.error("Firebase profile update failed.");
    }
  };

  const handleEdit = () => {
    setFormData(profile || {});
    setSelectedDistrict(profileDistrictId);
    setIsEditing(true);
  };

  if (loading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }
  if (!user) return <p className="text-center text-slate-600">Not logged in</p>;

  return (
    <div className="space-y-6">
      <Toaster position="top-center" reverseOrder={false} />

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            {visibleData.photo ? (
              <img src={visibleData.photo} className="h-24 w-24 rounded-lg object-cover ring-4 ring-red-50" alt="Profile avatar" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100 text-5xl text-slate-300">
                <FaUserCircle />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold uppercase text-red-600">Member profile</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">{visibleData.name || user.displayName || "BloodFinding Member"}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <FaEnvelope />
                {user.email}
              </p>
            </div>
          </div>

          {!isEditing ? (
            <button onClick={handleEdit} className="btn rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700">
              <FaPen />
              Edit Profile
            </button>
          ) : (
            <button onClick={handleSave} disabled={mutation.isPending} className="btn rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700">
              <FaSave />
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-500"><FaTint className="text-red-600" /> Blood group</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{visibleData.blood || "Not set"}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-500"><FaMapMarkerAlt className="text-red-600" /> Location</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{visibleData.district || "District not set"}, {visibleData.upozila || "Upazila not set"}</p>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-950">Profile information</h3>
          <p className="text-sm text-slate-500">Keep your contact and donor details accurate.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <label className="form-control">
            <span className="label-text mb-2 font-medium text-slate-700">Name</span>
            <input name="name" value={visibleData.name || ""} onChange={handleChange} disabled={!isEditing} className={fieldClass} />
          </label>
          <label className="form-control">
            <span className="label-text mb-2 font-medium text-slate-700">Email</span>
            <input value={user.email} disabled className={fieldClass} />
          </label>
          <label className="form-control lg:col-span-2">
            <span className="label-text mb-2 font-medium text-slate-700">Photo URL</span>
            <input name="photo" value={visibleData.photo || ""} onChange={handleChange} disabled={!isEditing} className={fieldClass} />
          </label>
          <label className="form-control">
            <span className="label-text mb-2 font-medium text-slate-700">Blood group</span>
            <select name="blood" value={visibleData.blood || ""} onChange={handleChange} disabled={!isEditing} className={selectClass}>
              <option value="">Blood Group</option>
              {BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text mb-2 font-medium text-slate-700">District</span>
            <select name="district" value={activeDistrictId} onChange={handleChange} disabled={!isEditing} className={selectClass}>
              <option value="">District</option>
              {districts.map((item) => <option key={item._id || item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text mb-2 font-medium text-slate-700">Upazila</span>
            <select name="upozila" value={visibleData.upozila || ""} onChange={handleChange} disabled={!isEditing} className={selectClass}>
              <option value="">Upazila</option>
              {filteredUpazilas.map((item) => <option key={item._id || item.id} value={item.name}>{item.name}</option>)}
            </select>
          </label>
        </div>
      </section>
    </div>
  );
};

export default Profile;
