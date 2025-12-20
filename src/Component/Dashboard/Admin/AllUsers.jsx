import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { use, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUserCircle } from "react-icons/fa";
import UserActions from "./UserActions";
import { AuthContext } from "../../../Authprovider/AuthContext";
import toast, { Toaster } from "react-hot-toast";


export const AllUsers =()=>{

    const {user} = use(AuthContext);
    
    const axios = useAxiosSecure();
    const [statusFilter,setStatusFilter] = useState("all");
    
    const {data:userData=[],isLoading,isError,refetch} = useQuery({

        queryKey: ["users",statusFilter],
        queryFn: async ()=>{

            const url = 
            statusFilter === "all"
            ?"/users"
            :`/users?status=${statusFilter}`;
            

            const res = await axios.get(url,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });

            return res.data;
        }
    })



    if (isLoading) return <p className="text-center mt-12">Loading users...</p>;
    if (isError) return <p className="text-center mt-12">Failed to load users.....</p>;

    console.log("users_admin:",userData);


    //actions.....

    const handleBlock=async(id)=>{
    try{
        await axios.patch(`/users/${id}/status`,{status:"blocked"},{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });
        refetch();
        toast.success('user blocked Successfully!')

    }
    catch(err){
        console.error(err);
        }
    };

    const handleUnblock = async(id)=>{
        try{
            await axios.patch(`/users/${id}/status`,{status:"active"},{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });
            refetch();
            toast.success('user Unblocked successfully')

        }catch(err){
        console.error(err);
        }
    };

    const handleMakeDonor = async(id)=>{
        try{
            console.log("donor ID:", id);
            await axios.patch(`/users/${id}/role`,{role:"donor"},{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });
            refetch();
            toast.success('user changed to donor successfully')

        }catch(err){
            console.error(err);
        }
    }

    const handleMakeVolunteer = async(id)=>{
        try{
            console.log("Volunteer ID:", id);
            await axios.patch(`/users/${id}/role`,{role:"volunteer"},{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });
            refetch();
            toast.success('user changed to volunteer successfully')

        }catch(err){
            console.error(err);
        }
    }

    const handleMakeAdmin = async(id)=>{
        try{
            console.log("Volunteer ID:", id);
            await axios.patch(`/users/${id}/role`,{role:"admin"},{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });
            refetch();
            toast.success('user changed to admin successfully')
            

        }catch(err){
            console.error(err);
        }
    };



    return(
        <div className="mt-4 flex flex-col justify-center items-center p-2">

            <Toaster position="top-center" reverseOrder={false}/>

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
        

        {userData.map((u)=>(
            <div>

            </div>
        ))}

        <tbody>


            {userData.map((u)=>(
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
