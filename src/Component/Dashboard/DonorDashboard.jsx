import React, { use, useState } from "react";
import { AuthContext } from "../../Authprovider/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast, { Toaster } from "react-hot-toast";


const DonorDashboard =()=>{

    const {user} = use(AuthContext);

    const axios = useAxiosSecure();

    const [deleteId,setDeleteId]= useState(null)




    const {data,isLoading,isError,refetch} = useQuery({

        queryKey:["donations",user?.email],
        queryFn: async ()=>{
                ///if(!user) return [];
                const res = await axios.get(`/donations-request?email=${user.email}`,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });
                return res.data;
        },
        enabled: !!user,
    });


    if (!user) return <p>Loading user...</p>;
    if (isLoading) return <p>Loading donation requests...</p>;
    if (isError) return <p>Failed to load donation requests.</p>;

    const donations = data?.result;
    const recentDonations = donations
    .sort((a,b)=> new Date(b.donationDate)-new Date(a.donationDate))
    .slice(0,3);



    const handleDelete= async()=>{
            
            if(!deleteId) return;

           
                await axios.delete(`/donations-request/${deleteId}`,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });

            
            toast.success('Successfully Delete!')

            setDeleteId(null);
            refetch();
        };
        
        


    const handleStatus = async(id,donationStatus)=>{
        await axios.patch(`/donations-request/status/${id}`,{donationStatus},{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });
        console.log("status:",donationStatus)

        refetch();
    }



    return(
        <div>

            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div>
                <h1 className="text-center p-10 text-5xl font-bold">Welcome,<span>{user?.displayName}</span></h1>
            </div>

            {recentDonations.length > 0 &&(
        <div className="p-4 flex flex-col items-center text-center">

           <div className="p-4 w-full overflow-x-auto  border border-base-content/5 bg-base-100 font-bold">
            <table className="table ">
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
                        <p>{donation.donorEmail}</p>
                        <p>{donation.donorName}</p>
                    </div>
                ):(
                    <p>Not Assigned</p>
                )}</td>
                <td>
                    {donation.donationStatus === "inprogress" &&(
                        <div className="flex flex-col gap-2 mb-2">
                            <button
                            onClick={()=>handleStatus(donation._id,"done")} 
                            className="btn bg-red-600 text-white font-bold" >Done</button>
                            <button
                            onClick={()=>handleStatus(donation._id,"cancel")}
                            className="btn bg-red-600 text-white font-bold" >Cancel</button>
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                    <Link to={`/dashboard/donation-request/${donation._id}`} className="btn bg-red-600 text-white font-bold">View</Link>
                    
                    <Link to={`/dashboard/donation-edit/${donation._id}`} className="btn bg-red-600 text-white font-bold">Edit</Link>


                    <button
                    onClick={()=>setDeleteId(donation._id)}
                    className="btn bg-red-600 text-white font-bold">Delete</button>
                    </div>
                </td>
            </tr>
      ))}
    </tbody>
  </table>
</div>

<div className="">
    <Link to="/dashboard/my-donation-requests">
        <button className=" btn bg-red-600 min-w-[300px] h-[50px] mt-10 mb-10  text-white" >View All My Requests</button>
    </Link>
  </div>

</div>

)}


{deleteId && (
  <div open className="modal modal-open inset-0 shadow">
    <div className="modal-box border-4 border-red-600 p-4 min-w-[300px]">
      <h3 className="font-bold text-xl text-center">Delete Donation Request</h3>
      <p className="p-4">
        Are You Sure,You wanted to Delete this Blood Request?
      </p>
      <div className="modal-action flex flex-row justify-center items-center">
        <button
          className="btn"
          onClick={() => setDeleteId(null)}
        >
          Cancel
        </button>
        <button
          className="btn bg-red-600 text-white"
          onClick={handleDelete}
        >
          Confirm Delete
        </button>
      </div>
    </div>
  </div>
)}




</div>
    )

}

export default DonorDashboard;