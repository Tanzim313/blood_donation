import React, { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Authprovider/AuthContext";

const MyDonationRequests=()=>{

    const {user} = use(AuthContext);

    const [statusFilter,setStatusFilter] = useState("all")

    const {data:donations =[],isLoading,isError} = useQuery({
    
            queryKey:["donations",user?.email,statusFilter],
            queryFn: async ()=>{
                    if(!user) return [];

                    
                    const params = new URLSearchParams();
                    params.append("email",user.email);

                    if(statusFilter !== "all"){
                        params.append("status",statusFilter);
                    }
                    
                    const res = await fetch(`http://localhost:3000/donations-request?${params.toString()}`);
                    return res.json();
            },
            enabled: !!user,
        });
    
    
        if (!user) return <p>Loading user...</p>;
        if (isLoading) return <p>Loading donation requests...</p>;
        if (isError) return <p>Failed to load donation requests.</p>;
    
        
        const recentDonations = donations
        .sort((a,b)=> new Date(b.donationDate)-new Date(a.donationDate));


    return(
        <div className="flex flex-col justify-center items-center mt-10">

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
                            <button className="btn btn-success" >Done</button>
                            <button className="btn btn-success" >Cancel</button>
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                    <button className="btn btn-success">View</button>
                    <button className="btn btn-success">Edit</button>
                    <button className="btn btn-success">Delete</button>
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