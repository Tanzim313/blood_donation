import React, { use, useState } from "react";
import { auth } from "../../firebase.init";
import { AuthContext } from "../../Authprovider/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const CreateDonation =()=>{

    const {user} = use(AuthContext);
    const axios = useAxiosSecure();

    console.log("user:",user);

    //const {districts,upozilas} = useLoaderData();

    const [selectedDistrict,setSelectedDistrict] = useState("");
    //const [filteredUpozilas,setFilteredUpozilas] = useState([]);

    
    const {data:currentUser = {}}=useQuery({
        
        queryKey: ["currentUser",user?.email],
        enabled: !!user?.email,

        queryFn: async()=>{
            const res = await axios.get(`/currentUsers?email=${user.email}`,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });

            return res.data;
        }
    })


    
    const {data:district = []}=useQuery({
        queryKey: ["district"],
        queryFn: async()=>{
            const res = await axios.get("/district");

            return res.data;
        }
    })

    const {data:upazila = []}=useQuery({
        queryKey:["upazila"],
        queryFn: async()=>{
            const res = await axios.get("upazila");

            return res.data;
        }
    })

    const filteredUpozilas = upazila.filter(u=>u.district_id === selectedDistrict);


    
    const mutation = useMutation({
        mutationFn: async (donationData)=>{
            const res = await axios.post("/donations-request",donationData,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });
            return res.data;
        },

        onSuccess: ()=>{
                alert("Donation Request Created Successfully!");
        },
    });


   

    const districtName = district.find(d => d.id === selectedDistrict)?.name || "";
    



    // submit handle...

    const handleSubmit =(e)=>{
        e.preventDefault();


        const form = e.target;

        const selectedUpozilaId = form.upozila.value;

        const upozilaName = filteredUpozilas.find(u => u.id === selectedUpozilaId)?.name || "";   


        const donationData={

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

        mutation.mutate(donationData);

        console.log("req_data:",donationData)

    };


    return(
        
        
        <div className="">
        {currentUser?.status === "active"?(
            <div className="mt-10 flex flex-col justify-center items-center text-center mb-10">
                <h2 className="mb-10 text-4xl font-bold text-red-600">Create Donation Request</h2>

                <form onSubmit={handleSubmit}>

                <fieldset className="fieldset bg-base-200 border-base-500 rounded-box min-w-xs border p-4">
                    
                    <label className="label">Requester Name</label>
                    <input 
                    type="text" 
                    className="input" 
                    value={user?.displayName}
                    readOnly
                    placeholder="" />

                    <label className="label">Requester Email</label>
                    <input 
                    type="Email" 
                    value={user?.email}
                    readOnly
                    className="input" 
                    placeholder="" />

                    <label className="label">Recipient Name</label>
                    <input 
                    name="recipientName"
                    type="text" 
                    className="input" 
                    placeholder="" />

                <label className="label">District</label>
                    <select 
                    name="district" 
                    className="select select-bordered"
                    value={selectedDistrict} 
                    onChange={(e)=>setSelectedDistrict(e.target.value)} 
                    required>

                    <option value="">Select District</option>

                    {district.map((district, index) => (
                    <option key={index} value={district.id}>{district.name}</option>
                    ))}
                </select>

                <label className="label">Upozila</label>
                <select name="upozila" className="select select-bordered" required>
                    <option value="">Select Upozila</option>
                    {filteredUpozilas.map((upozila, index) => (
                    <option key={index} value={upozila.id}>{upozila.name}</option>
                    ))}
                </select>



                    <label className="label">Hospital Name</label>
                    <input
                    name="hospitalName" 
                    type="text" 
                    className="input" 
                    placeholder="" />

                    <label className="label">Full Address</label>
                    <input 
                    name="fullAddress"
                    type="text" 
                    className="input" 
                    placeholder="" />

            <label className="label" >Blood Group</label>
            <select name="blood" className="select select-bordered" required>
                <option >A+</option>
                <option >A-</option>
                <option >B+</option>
                <option >B-</option>
                <option >AB+</option>
                <option >AB-</option>
                <option >O+</option>
                <option >O-</option>
            </select>


                    <label className="label">donation date</label>
                    <input 
                    name="donationDate"
                    type="date" 
                    className="input" 
                    placeholder="" />

                    <label className="label">donation time</label>
                    <input 
                    name="donationTime"
                    type="time" 
                    className="input" 
                    placeholder="" />

                    <label className="label">request message</label>
                    <input
                    name="requestMessage" 
                    type="text" 
                    className="input" 
                    placeholder="" />


                    <button className="btn bg-red-600 text-white mt-4"> Donation Request </button>
                </fieldset>
                
                </form>
            </div>
            ):(

                <div className="text-center text-red-600 text-2xl font-semibold">
                    You are blocked.You Cannot Create a donation request.
                </div>

            )
            }

        </div>
        
    )
}

export default CreateDonation