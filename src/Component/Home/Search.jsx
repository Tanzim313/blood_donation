import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const Search =()=>{
    
    const [selectedDistrict,setSelectedDistrict] = useState("");
        
    const axios = useAxiosSecure();

    const [blood,setBlood]=useState("");
    const [selectedUpozila,setSelectedUpozila]=useState("");
    const [donors,setDonors]=useState([]);
    const [searched,setSearched]=useState(false);




     //districts
    const {data:district=[]}=useQuery({

        queryKey: ["district"],
        queryFn: async()=>{
            const res = await axios.get("/district");

            return res.data;
        },

    });

    //upazilas

    const {data:upozila = []} = useQuery({
        queryKey: ["upazila"],
        queryFn: async()=>{
            const res = await axios.get("/upazila");

            return res.data;
        }
    })

    const filteredUpozilas = upozila.filter(
        (u)=>u.district_id === selectedDistrict
    );

    const handleSearch = async ()=>{

        setSearched(true);

        const districtName = district.find(d=>d.id === selectedDistrict)?.name || "";

        const params = {};

        if(blood)params.blood = blood;
        if(districtName)params.district = districtName;
        if(selectedUpozila)params.upozila = selectedUpozila;

        const res = await axios.get("/donor-search",{params})
        setDonors(res.data);

        

    };

    return(
        <div className="p-10">
            <h2 className="text-red-600 text-center mt-4 mb-4 font-bold text-4xl">Search Donors</h2>


            <div className="p-4 space-y-3">
                <select 
                value={blood}
                onChange={(e)=>setBlood(e.target.value)}
                className="select select-bordered w-full"
                >
                    <option value="">Select Blood Group</option>
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b)=>(
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>


                <select 
                value={selectedDistrict}
                onChange={(e)=>{
                    setSelectedDistrict(e.target.value);
                    setUpozila("");
                }}
                className="select select-bordered w-full"
                >
                    <option value="">Select District</option>
                    {district.map((d)=>(
                        <option key={d._id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>


                <select 
                value={selectedUpozila}
                onChange={(e)=>
                    setSelectedUpozila(e.target.value)
                }
                className="select select-bordered w-full"
                disabled={!selectedDistrict}
                >
                    <option value="">Select Upazila</option>
                    {filteredUpozilas.map((d)=>(
                        <option key={d._id} value={d.name}>
                            {d.name}
                        </option>
                    ))}
                </select>


                <button onClick={handleSearch} className="btn btn-primary w-full">
                    Search
                </button>
            </div>

            <div className="p-4">
                {searched&&donors.length === 0 && (
                    <p>No donors Found</p>
                )}

                {donors.map((d)=>(
                    <div key={d._id} className="border p-4 rounded mb-4 mt-4 ">
                        <p><b>Name:</b>{d.name}</p>
                        <p><b>Blood:</b>{d.blood}</p>
                        <p><b>District:</b>{d.district}</p>
                        <p><b>Upazila:</b>{d.upozila}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Search;