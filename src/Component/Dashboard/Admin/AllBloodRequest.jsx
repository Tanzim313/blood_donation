import React, { use, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../Authprovider/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";

const AllBloodRequest=()=>{

    const {user} = use(AuthContext);
    const  axios = useAxiosSecure();

    const [statusFilter,setStatusFilter] = useState("all")
    const [page,setPage] = useState(1);
    const limit = 5;

    const [deleteId,setDeleteId]= useState(null)


    const {data,isLoading,isError} = useQuery({
    
            queryKey:["donations",user,statusFilter,page],
            enabled: !!user,
            queryFn: async ()=>{
                    const res = await axios.get(`/all-donation-request?status=${statusFilter}&page=${page}&limit=${limit}`,{
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

       

    
    
        if (!user) return <p>Loading user...</p>;
        if (isLoading) return <p>Loading donation requests...</p>;
        if (isError) return <p>Failed to load donation requests.</p>;


        const handleDelete= async()=>{
            
            if(!deleteId) return;

                await axios.delete(`/donations-request/${deleteId}`,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });

            
            toast.success('Successfully toasted!')

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

        }
    
        
        const recentDonations = [...donations]
        .sort((a,b)=> new Date(b.donationDate)-new Date(a.donationDate));


    
    
    return(
        <div className="flex flex-col justify-center items-center mt-20">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="mb-10">
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
            <tr key={donation._id}>
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
                    onClick={()=>setDeleteId(donation._id)}
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

export default AllBloodRequest;