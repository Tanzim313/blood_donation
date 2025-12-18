import React, { use, useEffect, useState } from "react";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../../Authprovider/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { BsThreeDotsVertical } from "react-icons/bs";

const AllBloodVolunteer=()=>{
    
    const axios = useAxiosSecure();
    const queryClient = useQueryClient();
    const {user} = use(AuthContext);
    const [statusFilter,setStatusFilter] = useState("all")

    const [page,setPage] = useState(1);
    const limit = 5;

    const {data,isLoading,isError} = useQuery({
    
            queryKey:["donations",user,statusFilter,page],
            enabled: !!user,
            queryFn: async ()=>{
                    if(!user) return [];

                    
                    const params = new URLSearchParams();

                    if(statusFilter !== "all"){
                        params.append("status",statusFilter);
                    }
                    
                    const res = await axios.get(`/all-donation-request?${params.toString()}&page=${page}&limit=${limit}`,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });

                return res.data;
            },
            keepPreviousData:true,
        });


                
                const donations = data?.result || [];
                const total = data?.total||0;
                const totalPages = Math.ceil(total/limit);
        
                useEffect(()=>{
                    setPage(1);
        
                },[statusFilter]);

    

        const statusMutation = useMutation({
            mutationFn: async({id,status})=>{
                const res = await axios.patch(`donation-status/${id}`,{
                    status,
                },{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });

                return res.data;
            },
            onSuccess:()=>{
                queryClient.invalidateQueries(["donations"]);
            },
        })

        const handleStatusUpdate = (id,status)=>{
            statusMutation.mutate({id,status});
        };

    
        
        
        if (!user) return <p>Loading user...</p>;
        if (isLoading) return <p>Loading donation requests...</p>;
        if (isError) return <p>Failed to load donation requests.</p>;
    
       

        const recentDonations = [...donations]
        .sort((a,b)=> new Date(b.donationDate)-new Date(a.donationDate));



    return(
        <div className="flex flex-col justify-center items-center ">

            <div className="mt-10 mb-10">
                <select className="select select-bordered w-[280px]" 
                value={statusFilter}
                onChange={(e)=>setStatusFilter(e.target.value)}
                >

                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="cancel">Cancel</option>
                
                </select>

            </div>


             {recentDonations.length > 0 &&(
        <div className="p-4 flex flex-col items-center text-center w-full ">

           <div className="p-4 w-full overflow-x-auto  border border-base-content/5 bg-base-100">
            <table className="table">
    {/*head*/}
    <thead>
      <tr>
        <th>Recipient Name</th>
        <th>Location</th>
        <th>Donation Date</th>
        <th>Donation Time</th>
        <th>Blood Group</th>
        <th>Donation Status</th>
        <th>Donor Information</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {recentDonations.map((donation)=>(
            <tr key={donation._id}>
                <td>{donation.recipientName}</td>
                <td>{donation.recipientDistrict}, {donation.recipientUpazila}</td>
                <td>{donation.donationDate}</td>
                <td>{donation.donationTime}</td>
                <td>{donation.bloodGroup}</td>
                <td>{donation.donationStatus}</td>
                <td>{donation.donationStatus === "inprogress" ? (
                    <div>
                        <p>Name:{donation.donorEmail}</p>
                        <p>Email:{donation.donorName}</p>
                    </div>
                ):(
                    <p>Not Assigned</p>
                )}</td>
                <td>
                    <div className="dropdown dropdown-left">
                        
                        <label tabIndex={0} className="btn btn-ghost btn-sm">
                            <BsThreeDotsVertical />
                        </label>

                        <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow bg-red-600 rounded-box w-44 text-white text-center font-bold "
                        >
                        {donation.donationStatus === "pending" && (

                            <li>
                                <button
                                    onClick={()=>
                                        handleStatusUpdate(
                                            donation._id,
                                            "inprogress"
                                        )
                                    }
                                >
                                    inprogress
                                </button>
                            </li>
                        )}


                        {donation.donationStatus === "inprogress" && (
                        <>
                            <li>
                                <button
                                    onClick={()=>
                                        handleStatusUpdate(
                                            donation._id,
                                            "done"
                                        )
                                    }
                                >
                                    done
                                </button>
                            </li>

                            <li>
                                <button
                                    onClick={()=>
                                        handleStatusUpdate(
                                            donation._id,
                                            "cancel"
                                        )
                                    }
                                >
                                    cancel
                                </button>
                            </li>
                        </>
                            
                        )}

                        {(donation.donationStatus==="done"||donation.donationStatus==="cancel")&&(
                            <li>
                                {donation.donationStatus === "cancel"? "cancel successfully" :"done successfully"}
                            </li>
                        )}
                        
                        </ul>

                    </div>
                   
                </td>
            </tr>
      ))}
    </tbody>
  </table>
</div>


</div>

)}

<div className="flex gap-2 mt-8">
    {[...Array(totalPages).keys()].map((num)=>(
        <button
        key={num}
        onClick={()=>setPage(num+1)}
        className={`btn btn-sm ${page === num+1? "bg-red-600":"btn-outline"}`}
        >
            {num+1}
        </button>
    ))}
</div>

</div>
) 

}

export default AllBloodVolunteer;