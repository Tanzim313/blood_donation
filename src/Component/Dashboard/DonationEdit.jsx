import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { FaCalendarAlt, FaClock, FaHospital, FaSave, FaUser } from "react-icons/fa";
import { MdBloodtype, MdLocationOn } from "react-icons/md";
import { AuthContext } from "../../Authprovider/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const inputClass = "input input-bordered w-full rounded-md bg-white";
const selectClass = "select select-bordered w-full rounded-md bg-white";

const DonationEdit = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const axios = useAxiosSecure();
  const queryClient = useQueryClient();

  const [donationChanges, setDonationChanges] = useState({});
  const [selectedDistrict, setSelectedDistrict] = useState("");

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

  const { data: donation, isLoading } = useQuery({
    queryKey: ["donation-details", id],
    enabled: !!id && !!user,
    queryFn: async () => {
      const res = await axios.get(`/donations-request/${id}`, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      return res.data;
    },
  });

  const donationDistrictId = district.find((item) => item.name === donation?.recipientDistrict)?.id || "";
  const activeDistrictId = selectedDistrict || donationDistrictId;
  const filteredUpozilas = upazila.filter((item) => item.district_id === activeDistrictId);

  const donationData = {
    requesterName: donation?.requesterName || "",
    requesterEmail: donation?.requesterEmail || "",
    recipientName: donation?.recipientName || "",
    recipientDistrict: donation?.recipientDistrict || "",
    recipientUpazila: donation?.recipientUpazila || "",
    hospitalName: donation?.hospitalName || "",
    fullAddress: donation?.fullAddress || "",
    bloodGroup: donation?.bloodGroup || "",
    donationDate: donation?.donationDate || "",
    donationTime: donation?.donationTime || "",
    requestMessage: donation?.requestMessage || "",
    ...donationChanges,
  };

  const updateDonationField = (field, value) => {
    setDonationChanges((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateDonationMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axios.patch(`/donations-request/edit/${id}`, updatedData, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["donation-details", id]);
      toast.success("Donation request updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update donation request.");
    },
  });

  const handleUpdate = (event) => {
    event.preventDefault();
    updateDonationMutation.mutate(donationData);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }
  if (!donation) return <p className="text-center text-slate-600">No donation found.</p>;

  return (
    <div className="space-y-6">
      <Toaster position="top-center" reverseOrder={false} />

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <p className="text-sm font-semibold uppercase text-red-600">Edit request</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-950">Update donation request</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Adjust recipient, hospital, location, schedule, or request message details.
        </p>
      </section>

      <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleUpdate}>
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="form-control">
            <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><FaUser /> Requester name</span>
            <input type="text" className={inputClass} value={donationData.requesterName} readOnly />
          </label>
          <label className="form-control">
            <span className="label-text mb-2 font-medium text-slate-700">Requester email</span>
            <input type="email" value={donationData.requesterEmail} readOnly className={inputClass} />
          </label>
          <label className="form-control">
            <span className="label-text mb-2 font-medium text-slate-700">Recipient name</span>
            <input name="recipientName" value={donationData.recipientName} type="text" className={inputClass} onChange={(event) => updateDonationField("recipientName", event.target.value)} />
          </label>
          <label className="form-control">
            <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><MdBloodtype /> Blood group</span>
            <select name="blood" value={donationData.bloodGroup} onChange={(event) => updateDonationField("bloodGroup", event.target.value)} className={selectClass} required>
              {BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><MdLocationOn /> District</span>
            <select
              name="district"
              className={selectClass}
              value={activeDistrictId}
              onChange={(event) => {
                setSelectedDistrict(event.target.value);
                const districtObj = district.find((item) => item.id === event.target.value);
                setDonationChanges((current) => ({
                  ...current,
                  recipientDistrict: districtObj?.name || "",
                  recipientUpazila: "",
                }));
              }}
              required
            >
              <option value="">Select District</option>
              {district.map((item) => <option key={item._id || item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text mb-2 font-medium text-slate-700">Upazila</span>
            <select name="upozila" className={selectClass} value={donationData.recipientUpazila} onChange={(event) => updateDonationField("recipientUpazila", event.target.value)} required>
              <option value="">Select Upazila</option>
              {filteredUpozilas.map((item) => <option key={item._id || item.id} value={item.name}>{item.name}</option>)}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><FaHospital /> Hospital name</span>
            <input name="hospitalName" value={donationData.hospitalName} type="text" className={inputClass} onChange={(event) => updateDonationField("hospitalName", event.target.value)} />
          </label>
          <label className="form-control">
            <span className="label-text mb-2 font-medium text-slate-700">Full address</span>
            <input name="fullAddress" value={donationData.fullAddress} onChange={(event) => updateDonationField("fullAddress", event.target.value)} type="text" className={inputClass} />
          </label>
          <label className="form-control">
            <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><FaCalendarAlt /> Donation date</span>
            <input name="donationDate" value={donationData.donationDate} type="date" onChange={(event) => updateDonationField("donationDate", event.target.value)} className={inputClass} />
          </label>
          <label className="form-control">
            <span className="label-text mb-2 flex items-center gap-2 font-medium text-slate-700"><FaClock /> Donation time</span>
            <input name="donationTime" value={donationData.donationTime} onChange={(event) => updateDonationField("donationTime", event.target.value)} type="time" className={inputClass} />
          </label>
          <label className="form-control lg:col-span-2">
            <span className="label-text mb-2 font-medium text-slate-700">Request message</span>
            <textarea name="requestMessage" value={donationData.requestMessage} className="textarea textarea-bordered min-h-32 w-full rounded-md bg-white" onChange={(event) => updateDonationField("requestMessage", event.target.value)} />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="btn rounded-md border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700" disabled={updateDonationMutation.isPending}>
            <FaSave />
            {updateDonationMutation.isPending ? "Updating..." : "Update Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationEdit;
