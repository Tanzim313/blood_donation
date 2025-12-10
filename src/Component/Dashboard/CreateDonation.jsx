import React, { use, useState } from "react";
import { auth } from "../../firebase.init";
import { AuthContext } from "../../Authprovider/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useLoaderData } from "react-router";


const CreateDonation =()=>{

    const {user} = use(AuthContext);

    console.log("user:",user);

    const {districts,upozilas} = useLoaderData();

    const [selectedDistrict,setSelectedDistrict] = useState("");
    const [filteredUpozilas,setFilteredUpozilas] = useState([]);

    const handleDistrictChange = (e)=>{
        const selected = e.target.value;
        setSelectedDistrict(selected);
        console.log("selected:",selected)


        const filtered = upozilas.filter(upozila=>upozila.district_id === selected);
        setFilteredUpozilas(filtered);


    }


    const mutation = useMutation({
        mutationFn: async (donationData)=>{
            const res = await fetch("http://localhost:3000/donations-request",{
                method: "POST",
                headers:{"content-type":"application/json"},
                body: JSON.stringify(donationData),

            });
            return res.json();
        },

        onSuccess: ()=>{
                alert("Donation Request Created Successfully!");
        },
    });


    // submit handle...

    const handleSubmit =(e)=>{
        e.preventDefault();


        const form = e.target;


        const donationData={

            requesterName: user?.displayName,
            requesterEmail: user?.email,

            recipientName: form.recipientName.value,
            recipientDistrict: form.district.value,
            recipientUpazila: form.upozila.value,

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
        <div>
            <div className="mt-10 flex flex-col justify-center items-center text-center">
                <h2 className="mb-10 text-4xl font-bold">Create Donation Request</h2>

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
                    <select name="district" className="select select-bordered" onChange={handleDistrictChange} required>
                    <option value="">Select District</option>
                    {districts.map((district, index) => (
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


                    <button className="btn btn-neutral mt-4"> Donation Request </button>
                </fieldset>
                
                </form>
            </div>

        </div>
    )
}

export default CreateDonation