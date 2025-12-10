import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";


const BloodDonationRequests =()=>{

    const axios = useAxiosSecure();

    const {data:donations=[],isLoading} = useQuery({
        queryKey:["pending-donations"],
        queryFn: async()=>{
                const res = await axios.get("/pending-donations");
                return res.data
        },
    })

    console.log("pending-data:",donations);

    if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }


    return(
        <div>

            <div>
            

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">


                  {donations.map((pending)=>(
                    <div 
                    key={pending._id}
                    className="bg-white rounded-lg shadow p-5  hover:shadow-2xl transition-shadow duration-300 border-l-10 border-red-500"
                    >
                        <div>
                            <h1 className="text-2xl text-red-500 font-bold">{pending.recipientName}</h1>

                        </div>
                    
                        <div className="text-gray-700 space-y-1 mb-4">

                        <p> <span className="font-semibold">Location:</span>
                            {pending.recipientDistrict},{pending.recipientUpazila}</p>
                        <p> <span className="font-semibold">Blood Group:</span>
                            {pending.bloodGroup}</p>
                        <p> <span className="font-semibold">Date:</span>
                            {pending.donationDate}</p>
                        <p> <span className="font-semibold">Time:</span>
                            {pending.donationTime}</p>


                        </div>
                        
                        <div className="text-right">
                            <Link to="/pending-details"
                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >View  Details</Link>
                        </div>

                    </div>
                  ))}


                </div>
                



            </div>



        </div>
    )

}

export default BloodDonationRequests;