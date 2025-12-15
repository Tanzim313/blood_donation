import React, { use, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { AuthContext } from "../../Authprovider/AuthContext";
import Donate from "../Home/Donate";


const DonationDetails=()=>{
    const axios = useAxiosSecure();
    const {user} = use(AuthContext);
    const [isOpen,setIsOpen] = useState(false);
    const [selectedDonation,setSelectedDonation] = useState(null);
    

    const {id}=useParams();

    const {data:donation,isLoading}=useQuery({
        queryKey:["donation-details",id],
        queryFn:async()=>{
            const res = await axios.get(`/donations-request/${id}`);
            return res.data;
        }
    })

    if (isLoading) return <p className="text-center mt-10">Loading......</p>;
    if (!donation) return <p className="text-center mt-10">No data found</p>;

    
        const openModal = (donation) => {
    
            setSelectedDonation(donation);
            setIsOpen(true);
      
        };
    


    return(

        <div className="max-w-3xl mx-auto mt-10">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Donation Request Details</h2>


                <div className="space-y-2 text-gray-700">
                    <p>Recipient Name:{donation.recipientName}</p>
                    <p>Blood Group:{donation.bloodGroup}</p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>


                      <div className="text-right">
                            <button
                            onClick={()=>openModal(donation)}
                           
                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >Donate</button>
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

export default DonationDetails;