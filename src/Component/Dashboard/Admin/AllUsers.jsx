import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUserCircle } from "react-icons/fa";
import UserActions from "./UserActions";


export const AllUsers =()=>{
    
    const axios = useAxiosSecure();
    const [statusFilter,setStatusFilter] = useState("all");
    
    const {data:user=[],isLoading,isError} = useQuery({

        queryKey: ["users",statusFilter],
        queryFn: async ()=>{

            const url = 
            statusFilter === "all"
            ?"/users"
            :`/users?status=${statusFilter}`;
            

            const res = await axios.get(url);

            return res.data;
        }
    })



    if (isLoading) return <p className="text-center mt-12">Loading users...</p>;
    if (isError) return <p className="text-center mt-12">Failed to load users.....</p>;

    console.log("users_admin:",user);


    //actions.....

    const handleBlock=async(id)=>{
    try{
        await axios.patch(`/users/${id}/status`,{status:"blocked"});
        alert("user blocked successfully")
    }
    catch(err){
        console.error(err);
        }
    };

    const handleUnblock = async(id)=>{
        try{
            await axios.patch(`/users/${id}/status`,{status:"active"});
            alert("user Unblocked successfully")

        }catch(err){
        console.error(err);
        }
    };

    const handleMakeDonor = async(id)=>{
        try{
            console.log("donor ID:", id);
            await axios.patch(`/users/${id}/role`,{role:"donor"});
            alert("user changed to donor successfully")

        }catch(err){
            console.error(err);
        }
    }

    const handleMakeVolunteer = async(id)=>{
        try{
            console.log("Volunteer ID:", id);
            await axios.patch(`/users/${id}/role`,{role:"volunteer"});
            alert("user changed to volunteer successfully")

        }catch(err){
            console.error(err);
        }
    }

    const handleMakeAdmin = async(id)=>{
        try{
            console.log("Volunteer ID:", id);
            await axios.patch(`/users/${id}/role`,{role:"admin"});
            alert("user changed to admin successfully")

        }catch(err){
            console.error(err);
        }
    };



    return(
        <div className="mt-4 flex flex-col justify-center items-center p-2">

             <div className="w-[250px] mb-4">
                <select className=" select select-bordered" 
                value={statusFilter}
                onChange={(e)=>setStatusFilter(e.target.value)}
                >

                    <option value="all">All</option>
                    <option value="active">active</option>
                    <option value="blocked">blocked</option>

                </select>

            </div>

            
            <div className="overflow-auto w-full p-2 border-2">

                <table className="table">
                       {/* head */}
                <thead>
                <tr className="text-center">
                        
                    <th>User Avatar</th>
                    <th>User Email</th>
                    <th>User Name</th>
                    <th>User Role</th>
                    <th>User Status</th>
                    <th>Action</th>

                </tr>
            </thead>
        

        {user.map((u)=>(
            <div>

            </div>
        ))}

        <tbody>


            {user.map((u)=>(
            <tr className="text-center">
                <td>
            <div className="flex items-center gap-3">
                <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                        {u.photo?(
                        <img
                            src={u.photo}
                            alt="user Avatar"
                        />
                        ):( <FaUserCircle size={40} color="#555" />)}
                    </div>
                </div>
            <div>
        </div>
          </div>

        </td>

        <td>
            <div>
                <p>{u.email}</p>
            </div>
        </td>


        <td>
            <p>{u.name}</p>
        </td>

        <td>
            <p>{u.role}</p>
        </td>

        <td className="font-bold">
            <p className={u.status==="active"?"text-green-500":"text-red-500"}>
                {u.status}</p>
        </td>

        <td>
        <UserActions
                user={u}
                onBlock={handleBlock}
                onUnblock={handleUnblock}
                onMakeVolunteer={handleMakeVolunteer}
                onMakeAdmin={handleMakeAdmin}
                onMakeDonor={handleMakeDonor}
        />

        </td>
    </tr>

    ))}

    </tbody>

  </table>
</div>


        </div>
    )
}
