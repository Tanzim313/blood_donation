import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";




const Donate = ({isOpen,setIsOpen,selectedDonation,user})=>{

     
    const axios = useAxiosSecure();
    const queryClient = useQueryClient();


    const donationMutation = useMutation({
        mutationFn:async()=>{
            const res = await axios.put(`/pending-donations/${selectedDonation._id}`,{
                donationStatus:"inprogress",
                donorName:user.displayName,
                donorEmail:user.email,
            });
            return res.data;
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(["pending-donations"]);
            setIsOpen(false);

            alert("Donation confirmed successfully!");
        },
        onError:(err)=>{
            console.error("Error confirming donation:",err);
            alert("Failed to confirm donation!");
        },
    });

    if(!isOpen) return null;

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="text-black bg-white rounded-lg p-6 w-96 shadow-lg">
                <h3 className="text-xl font-bold mb-4">
                    Confirm Donation
                </h3>

                <p>
                    <span>
                        Donor Name:
                    </span>
                    {user.displayName}
                </p>
                <p>
                    <span>
                        Donor Email:
                    </span>
                    {user.email}
                </p>
                <div className="flex justify-end mt-6 gap-3">

                    <button
                        onClick={()=> setIsOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>

                    <button
                    onClick={()=>{
                        console.log("Confirming donation:",selectedDonation._id);
                        donationMutation.mutate()}}

                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                        Confirm
                    </button>

                </div>

            </div>
        </div>
    )



}

export default Donate;