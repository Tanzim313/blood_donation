import React, { use, useContext, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Authprovider/AuthContext";
import Donate from "./Donate";
import { useParams } from "react-router";


const BloodDonationDetails=()=>{

const {id} = useParams();
const axios = useAxiosSecure();
const {user} = useContext(AuthContext);
const queryClient = useQueryClient();

console.log("Logged in user:", user);



    const {data:pending=[]} = useQuery({
        queryKey:["pending-donations",id],
        queryFn: async()=>{
                const res = await axios.get(`/pending-donations/${id}`);
                return res.data
        },
    })

    console.log("pending-data2:",pending);



    //modal:

    const [isOpen,setIsOpen] = useState(false);
    const [selectedDonation,setSelectedDonation] = useState(null);


    const openModal = (donation) => {

        setSelectedDonation(donation);
        setIsOpen(true);
  
    };

    

    return(

        <div>

            <div>
            

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">


                 
                    <div 
                    key={pending._id}
                    className="bg-white rounded-lg shadow p-5  hover:shadow-2xl transition-shadow duration-300 border-l-10 border-red-500"
                    >
                        <div className="mb-4">
                            <h1 className="text-2xl text-red-500 font-bold">{pending.recipientName}</h1>
                            <p className=" text-red-500 font-bold">{pending.requesterEmail}</p>

                        </div>
                    
                        <div className="text-gray-700 space-y-1 mb-4">

                        <p> <span className="font-semibold">District:</span>
                            {pending.recipientDistrict}</p>

                        <p> <span className="font-semibold">Upazila:</span>
                            {pending.recipientUpazila}</p>
                        <p> <span className="font-semibold">Hospital Name:</span>
                            {pending.hospitalName}</p>
                        <p> <span className="font-semibold">Full Address:</span>
                            {pending.fullAddress}</p>

                        <p> <span className="font-semibold">Blood Group:</span>
                            {pending.bloodGroup}</p>

                        <p> <span className="font-semibold">Donation Date:</span>
                            {pending.donationDate}</p>
                        <p> <span className="font-semibold">Donation Time:</span>
                            {pending.donationTime}</p>

                        <p> <span className="font-semibold">Request Message:</span>
                            {pending.requestMessage}</p>

                        <p> <span className="font-semibold">Donation Status:</span>
                            {pending.donationStatus}</p>

                        </div>
                        
                        <div className="text-right">
                            <button
                            onClick={()=>openModal(pending)}
                           
                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >Donate</button>
                        </div>

                    </div>

                </div>


            </div>


            {
                isOpen && selectedDonation && (

                     <Donate

                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedDonation={selectedDonation}
                user={user}>

                </Donate>

                )
            }



        </div>
    )


}

export default BloodDonationDetails;