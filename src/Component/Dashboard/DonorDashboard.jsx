import React, { use } from "react";
import { AuthContext } from "../../Authprovider/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";


const DonorDashboard =()=>{

    const {user} = use(AuthContext);

    const {data:donations =[],isLoading,isError} = useQuery({

        queryKey:["donations",user?.email],
        queryFn: async ()=>{
                if(!user) return [];
                const res = await fetch(`http://localhost:3000/donations-request?email=${user.email}`);
                return res.json();
        },
        enabled: !!user,
    });


    if (!user) return <p>Loading user...</p>;
    if (isLoading) return <p>Loading donation requests...</p>;
    if (isError) return <p>Failed to load donation requests.</p>;

    
    const recentDonations = donations
    .sort((a,b)=> new Date(b.donationDate)-new Date(a.donationDate))
    .slice(0,3);



    return(
        <div>

            <div>
                <h1 className="text-center p-10 text-5xl font-bold">Welcome,<span>{user?.displayName}</span></h1>
            </div>

            {recentDonations.length > 0 &&(
        <div className="p-4 flex flex-col items-center text-center">

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
                        <p>Name:</p>
                        <p>Email:</p>
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

<div className="">
    <Link to="/dashboard/my-donation-requests">
        <button className=" btn btn-success min-w-[300px] h-[50px] mt-10 mb-10 " >View All My Requests</button>
    </Link>
  </div>

</div>

)}



        </div>
    )

}

export default DonorDashboard;