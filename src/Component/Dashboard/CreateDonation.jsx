import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { FaCalendarAlt, FaClock, FaHospital, FaMapMarkerAlt, FaPaperPlane, FaUser } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { AuthContext } from "../../Authprovider/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const inputClass = "input input-bordered w-full rounded-md bg-white";
const selectClass = "select select-bordered w-full rounded-md bg-white";

const CreateDonation = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const { data: currentUser = {}, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`/currentUsers?email=${user.email}`, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      return res.data;
    },
  });

  const { data: district = [] } = useQuery({
    queryKey: ["district"],
    queryFn: async () => {
      const res = await axios.get("/district");
      return res.data;
    },
  });

  const { data: upazila = [] } = useQuery({
    queryKey: ["upazila"],
    queryFn: async () => {
      const res = await axios.get("/upazila");
      return res.data;
    },
  });

  const filteredUpozilas = upazila.filter((item) => item.district_id === selectedDistrict);
  const districtName = district.find((item) => item.id === selectedDistrict)?.name || "";

  const mutation = useMutation({
    mutationFn: async (donationData) => {
      const res = await axios.post("/donations-request", donationData, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Donation request created successfully.");
    },
    onError: () => {
      toast.error("Failed to create donation request.");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const selectedUpozilaId = form.upozila.value;
    const upozilaName = filteredUpozilas.find((item) => item.id === selectedUpozilaId)?.name || "";

    const donationData = {
      requesterName: user?.displayName,
      requesterEmail: user?.email,
      recipientName: form.recipientName.value,
      recipientDistrict: districtName,
      recipientUpazila: upozilaName,
      hospitalName: form.hospitalName.value,
      fullAddress: form.fullAddress.value,
      bloodGroup: form.blood.value,
      donationDate: form.donationDate.value,
      donationTime: form.donationTime.value,
      requestMessage: form.requestMessage.value,
      donationStatus: "pending",
    };

    mutation.mutate(donationData, {
      onSuccess: () => {
        form.reset();
        setSelectedDistrict("");
      },
    });
  };

  if (userLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (currentUser?.status && currentUser.status !== "active") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-red-700">Account blocked</h2>
        <p className="mt-2 text-sm text-red-600">You cannot create a donation request while your account is blocked.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" reverseOrder={false} />

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <p className="text-sm font-semibold uppercase text-red-600">Create request</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-950">New blood donation request</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Add recipient, hospital, schedule, and blood details so donors and admins can respond quickly.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_0.38fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-950">Request details</h3>
            <p className="text-sm text-slate-500">All fields are required for accurate matching.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <label className="form-control">
              <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><FaUser /> Requester name</span>
              <input type="text" className={inputClass} value={user?.displayName || ""} readOnly />
            </label>
            <label className="form-control">
              <span className="label-text mb-2 font-medium text-slate-700">Requester email</span>
              <input type="email" value={user?.email || ""} readOnly className={inputClass} />
            </label>
            <label className="form-control">
              <span className="label-text mb-2 font-medium text-slate-700">Recipient name</span>
              <input name="recipientName" type="text" className={inputClass} placeholder="Patient or recipient name" required />
            </label>
            <label className="form-control">
              <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><MdBloodtype /> Blood group</span>
              <select name="blood" className={selectClass} required defaultValue="">
                <option value="" disabled>Select blood group</option>
                {BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
              </select>
            </label>
            <label className="form-control">
              <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><FaMapMarkerAlt /> District</span>
              <select name="district" className={selectClass} value={selectedDistrict} onChange={(event) => setSelectedDistrict(event.target.value)} required>
                <option value="">Select district</option>
                {district.map((item) => <option key={item._id || item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="form-control">
              <span className="label-text mb-2 font-medium text-slate-700">Upazila</span>
              <select name="upozila" className={selectClass} required disabled={!selectedDistrict}>
                <option value="">Select upazila</option>
                {filteredUpozilas.map((item) => <option key={item._id || item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="form-control">
              <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><FaHospital /> Hospital name</span>
              <input name="hospitalName" type="text" className={inputClass} placeholder="Hospital or clinic name" required />
            </label>
            <label className="form-control">
              <span className="label-text mb-2 font-medium text-slate-700">Full address</span>
              <input name="fullAddress" type="text" className={inputClass} placeholder="Ward, road, building, area" required />
            </label>
            <label className="form-control">
              <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><FaCalendarAlt /> Donation date</span>
              <input name="donationDate" type="date" className={inputClass} required />
            </label>
            <label className="form-control">
              <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><FaClock /> Donation time</span>
              <input name="donationTime" type="time" className={inputClass} required />
            </label>
            <label className="form-control lg:col-span-2">
              <span className="label-text mb-2 font-medium text-slate-700">Request message</span>
              <textarea name="requestMessage" className="textarea textarea-bordered min-h-32 w-full rounded-md bg-white" placeholder="Add urgent instructions, patient condition, contact window, or hospital notes." required />
            </label>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
          <h3 className="text-lg font-bold">Before submitting</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>Confirm the blood group and hospital location.</p>
            <p>Use a reachable phone/contact detail in the message if needed.</p>
            <p>Requests are created with pending status.</p>
          </div>
          <button disabled={mutation.isPending} className="btn mt-6 w-full rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700">
            <FaPaperPlane />
            {mutation.isPending ? "Submitting..." : "Submit Request"}
          </button>
        </aside>
      </form>
    </div>
  );
};

export default CreateDonation;
