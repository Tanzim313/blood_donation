import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const DonationEdit=()=> {

    const {id}=useParams();
    const axios = useAxiosSecure();
    const navigate = useNavigate();
    const queryClient = useQueryClient();


    const [donationData,setDonationData] = useState({

        requesterName:"",
        requesterEmail: "",
        recipientName: "",
        recipientDistrict: "",
        recipientUpazila: "",
        hospitalName: "",
        fullAddress: "",
        bloodGroup: "",
        donationDate: "",
        donationTime: "",
        requestMessage: ""
    
    });

    const [selectedDistrict,setSelectedDistrict] = useState("");

    
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

    //const districtName = district.find(d => d.id === selectedDistrict)?.name || "";
    


    const {data:donation,isLoading} = useQuery({
        queryKey:["donation-details",id],
        queryFn: async()=>{
            const res = await axios.get(`/donations-request/${id}`);
            //setDonationData(res.data);
        return res.data;
        }

    });
    

    useEffect(()=>{
        if(donation && district.length>0){
        
    setDonationData({
        requesterName: donation.requesterName ||"",
        requesterEmail: donation.requesterEmail||"",
        recipientName: donation.recipientName||"",
        recipientDistrict: donation.recipientDistrict||"",
        recipientUpazila: donation.recipientUpazila ||"",
        hospitalName: donation.hospitalName||"",
        fullAddress: donation.fullAddress||"",
        bloodGroup: donation.bloodGroup||"",
        donationDate: donation.donationDate||"",
        donationTime: donation.donationTime||"",
        requestMessage: donation.requestMessage||"",

        });

        const districtObj = district.find(
            (d)=>d.name === donation.recipientDistrict
        );
        setSelectedDistrict(districtObj?.id||"");
        
        }
    },[donation,district])


    const updateDonationMutation = useMutation({
        mutationFn:async(updatedData)=>{
            const res = await axios.patch(`/donations-request/edit/${id}`,updatedData);
            return res.data;
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(["donation-details",id]);
            alert("Donation updated Successfully!");
            navigate("/dashboard/my-donation-requests");
        },
        onError:()=>{
            alert("Failed to update donation");
        }
    });

    const handleUpdate=(e)=>{
        e.preventDefault();
        updateDonationMutation.mutate(donationData);
    };

    if (isLoading) return <p>Loading...</p>;
    if (!donation) return <p>No donation found</p>;



  return (
    <div>

        <form onSubmit={handleUpdate}>

                <fieldset className="fieldset bg-base-200 border-base-500 rounded-box min-w-xs border p-4">
                    
                    <label className="label">Requester Name</label>
                    <input 
                    type="text" 
                    className="input" 
                    value={donationData.requesterName}
                    readOnly
                    placeholder="" />

                    <label className="label">Requester Email</label>
                    <input 
                    type="Email" 
                    value={donationData.requesterEmail}
                    readOnly
                    className="input" 
                    placeholder="" />

                    <label className="label">Recipient Name</label>
                    <input 
                    name="recipientName"
                    value={donationData.recipientName}
                    type="text" 
                    className="input" 
                    placeholder=""
                    onChange={(e)=>setDonationData({...donationData,recipientName:e.target.value})}
                     />

                <label className="label">District</label>
                    <select 
                    name="district" 
                    className="select select-bordered"
                    value={selectedDistrict} 
                    onChange={(e)=>{
        
                        
                        setSelectedDistrict(e.target.value);
                        
                        const districtObj = district.find(d => d.id === e.target.value);

                        
                        setDonationData({
                            ...donationData,
                            recipientDistrict: districtObj?.name,
                            recipientUpazila:"",
                        });
                    }}
                    required
                    >

                    <option value="">Select District</option>

                    {district.map((district, index) => (
                    <option key={index} value={district.id}>{district.name}</option>
                    ))}

                </select>

                <label className="label">Upozila</label>
                <select 
                    name="upozila" 
                    className="select select-bordered" 

                    value={donationData.recipientUpazila}

                    onChange={(e)=>
                    setDonationData({
                        ...donationData,
                        recipientUpazila:e.target.value,
                    })
                }
                required
                >
                    
                    <option >Select Upozila</option>
                    {filteredUpozilas.map((upozila, index) => (
                    <option key={index} value={upozila.name}>{upozila.name}</option>
                    ))}

                </select>



                    <label className="label">Hospital Name</label>
                    <input
                    name="hospitalName" 
                    value={donationData.hospitalName}
                    type="text" 
                    className="input" 
                    onChange={(e)=>setDonationData({...donationData,hospitalName:e.target.value})}
                    placeholder="" />

                    <label className="label">Full Address</label>
                    <input 
                    name="fullAddress"
                    value={donationData.fullAddress}
                    onChange={(e)=>setDonationData({...donationData,fullAddress:e.target.value})}
                    type="text" 
                    className="input" 
                    placeholder="" />

            <label className="label" >Blood Group</label>
            <select 
            name="blood" 
            value={donationData.bloodGroup}
            onChange={(e)=>setDonationData({...donationData,bloodGroup:e.target.value})}
            className="select select-bordered" required>
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
                    value={donationData.donationDate}
                    type="date"
                     onChange={(e)=>setDonationData({...donationData,donationDate:e.target.value})} 
                    className="input" 
                    placeholder="" />

                    <label className="label">donation time</label>
                    <input 
                    name="donationTime"
                    value={donationData.donationTime}
                    onChange={(e)=>setDonationData({...donationData,donationTime:e.target.value})}
                    type="time" 
                    className="input" 
                    placeholder="" />

                    <label className="label">request message</label>
                    <input
                    name="requestMessage"
                    value={donationData.requestMessage} 
                    type="text" 
                    className="input"
                    onChange={(e)=>setDonationData({...donationData,requestMessage:e.target.value})} 
                    placeholder="" />


                    <button className="btn btn-neutral mt-4"> updated Request </button>
                </fieldset>
                
                </form>
      
    </div>
  )
}
export default DonationEdit;