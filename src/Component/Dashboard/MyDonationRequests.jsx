import React, { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Authprovider/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";

const MyDonationRequests=()=>{

    const {user} = use(AuthContext);
    const  axios = useAxiosSecure();

    const [statusFilter,setStatusFilter] = useState("all")

    const {data:donations =[],isLoading,isError} = useQuery({
    
            queryKey:["donations",user?.email,statusFilter],
            enabled: !!user,
            queryFn: async ()=>{

                    if(!user) return [];

                    
                    const params = new URLSearchParams();
                    params.append("email",user.email);

                    if(statusFilter !== "all"){
                        params.append("status",statusFilter);
                    }
                    
                    const res = await axios.get(`/donations-request?${params.toString()}`,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });

                    return res.data;
            },
    
        });
    
    
        if (!user) return <p>Loading user...</p>;
        if (isLoading) return <p>Loading donation requests...</p>;
        if (isError) return <p>Failed to load donation requests.</p>;


        const handleDelete= async(id)=>{
            const confirm = window.confirm("Are You Sure?")
                if(!confirm) return;

                await axios.delete(`/donations-request/${id}`,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });
            
            toast.success('Successfully toasted!')

            refetch();
        };
        
        
        const handleStatus = async(id,donationStatus)=>{
        await axios.patch(`/donations-request/status/${id}`,{donationStatus},{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });
                
        console.log("status:",donationStatus)
        
        toast.success('Successfully toasted!')

        refetch();
        }

    
        
        const recentDonations = donations
        .sort((a,b)=> new Date(b.donationDate)-new Date(a.donationDate));


    return(
        <div className="flex flex-col justify-center items-center mt-10">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div className="w-[250px]">
                <select className=" select select-bordered" 
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
        <div className="p-4 flex flex-col items-center text-center w-full">

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
            <tr>
                <td>{donation.recipientName}</td>
                <td>{donation.recipientDistrict}, {donation.recipientUpazila}</td>
                <td>{donation.donationDate}</td>
                <td>{donation.donationTime}</td>
                <td>{donation.bloodGroup}</td>
                <td>{donation.donationStatus}</td>
                <td>{donation.donationStatus === "inprogress" ? (
                    <div>
                        <p>Name:{donation.donorName}</p>
                        <p>Email:{donation.donorEmail}</p>
                    </div>
                ):(
                    <p>Not Assigned</p>
                )}</td>
                <td>
                    {donation.donationStatus === "inprogress" &&(
                        <div className="flex flex-col gap-2 mb-2">
                            <button
                            onClick={()=>handleStatus(donation._id,"done")} 
                            className="btn bg-red-600" >Done</button>
                            <button
                            onClick={()=>handleStatus(donation._id,"cancel")}
                            className="btn bg-red-600" >Cancel</button>
                        </div>
                    )}
                <div className="flex flex-col gap-2">
                    <Link to={`/dashboard/donation-request/${donation._id}`} className="btn bg-red-600">View</Link>
                    
                    <Link to={`/dashboard/donation-edit/${donation._id}`} className="btn bg-red-600">Edit</Link>


                    <button
                    onClick={()=>handleDelete(donation._id)}
                    className="btn bg-red-600">Delete</button>
                
                </div>
                </td>
            </tr>
      ))}
    </tbody>
  </table>
</div>


</div>

)}

</div>
)

}

export default MyDonationRequests;