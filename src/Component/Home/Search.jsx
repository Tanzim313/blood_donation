import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaMapMarkerAlt, FaSearch, FaTint, FaUserCircle } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const Search =()=>{
    
    const [selectedDistrict,setSelectedDistrict] = useState("");
        
    const axios = useAxiosSecure();

    const [blood,setBlood]=useState("");
    const [selectedUpozila,setSelectedUpozila]=useState("");
    const [donors,setDonors]=useState([]);
    const [searched,setSearched]=useState(false);
    const [searchError, setSearchError] = useState("");




     //districts
    const {data:district=[], isLoading: districtsLoading}=useQuery({

        queryKey: ["district"],
        queryFn: async()=>{
            const res = await axios.get("/district");

            return res.data;
        },

    });

    //upazilas

    const {data:upozila = [], isLoading: upazilasLoading} = useQuery({
        queryKey: ["upazila"],
        queryFn: async()=>{
            const res = await axios.get("/upazila");

            return res.data;
        }
    })

    const filteredUpozilas = upozila.filter(
        (u)=>u.district_id === selectedDistrict
    );

    const handleSearch = async (event)=>{
        event.preventDefault();

        setSearched(true);
        setSearchError("");

        const districtName = district.find(d=>d.id === selectedDistrict)?.name || "";

        const params = {};

        if(blood)params.blood = blood;
        if(districtName)params.district = districtName;
        if(selectedUpozila)params.upozila = selectedUpozila;

        try {
            const res = await axios.get("/donor-search", { params });
            setDonors(res.data || []);
        } catch (error) {
            setSearchError(error?.message || "Unable to complete search. Please try again.");
        }
    };

    return (
        <section className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 max-w-3xl">
                    <p className="text-sm font-semibold uppercase text-red-600">Donor search</p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                        Find compatible blood donors near your patient.
                    </h1>
                    <p className="mt-4 text-base leading-7 text-slate-600">
                        Filter by blood group and location to get a focused list of registered donors.
                    </p>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_1fr_auto]"
                >
                    <label className="form-control w-full">
                        <span className="label-text mb-2 font-medium text-slate-700">Blood group</span>
                        <select
                            value={blood}
                            onChange={(e)=>setBlood(e.target.value)}
                            className="select select-bordered w-full bg-white"
                        >
                            <option value="">Any blood group</option>
                            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b)=>(
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control w-full">
                        <span className="label-text mb-2 font-medium text-slate-700">District</span>
                        <select
                            value={selectedDistrict}
                            onChange={(e)=>{
                                setSelectedDistrict(e.target.value);
                                setSelectedUpozila("");
                            }}
                            className="select select-bordered w-full bg-white"
                            disabled={districtsLoading}
                        >
                            <option value="">{districtsLoading ? "Loading districts..." : "Any district"}</option>
                            {district.map((d)=>(
                                <option key={d._id || d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control w-full">
                        <span className="label-text mb-2 font-medium text-slate-700">Upazila</span>
                        <select
                            value={selectedUpozila}
                            onChange={(e)=>setSelectedUpozila(e.target.value)}
                            className="select select-bordered w-full bg-white"
                            disabled={!selectedDistrict || upazilasLoading}
                        >
                            <option value="">{upazilasLoading ? "Loading upazilas..." : "Any upazila"}</option>
                            {filteredUpozilas.map((d)=>(
                                <option key={d._id || d.id} value={d.name}>{d.name}</option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="submit"
                        className="btn min-h-12 self-end border-red-600 bg-red-600 px-6 text-white hover:border-red-700 hover:bg-red-700"
                    >
                        <FaSearch />
                        Search
                    </button>
                </form>

                <div className="mt-8">
                    {searchError && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {searchError}
                        </div>
                    )}

                    {searched && donors.length === 0 && !searchError && (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
                            No donors found yet. Try a broader district or blood group.
                        </div>
                    )}

                    {donors.length > 0 && (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {donors.map((donor)=>(
                                <article key={donor._id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <FaUserCircle className="mt-1 text-4xl text-slate-300" />
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-900">{donor.name}</h2>
                                            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-red-600">
                                                <FaTint /> {donor.blood}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-slate-600">
                                        <FaMapMarkerAlt className="mt-1 text-slate-400" />
                                        <span>{donor.district || "Unknown district"}, {donor.upozila || "Unknown upazila"}</span>
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Search;
