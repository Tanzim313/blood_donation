import React, { use } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../Authprovider/AuthContext";
import { FaDonate, FaUsers } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";



const VolunteerDashboard =()=>{

    const {user} = use(AuthContext);
    const axios = useAxiosSecure();

    const {data:users = []}=useQuery({
        queryKey: ["users"],
        queryFn: async()=>{
            const res = await axios.get("/users",{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });

            return res.data;
        },
    });


    const {data:funding = []}=useQuery({
        queryKey: ["funding"],
        queryFn: async()=>{
            const res = await axios.get("/funding",{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });

            return res.data;
        },
    });


    const {data}=useQuery({
        queryKey: ["donations"],
        queryFn: async()=>{
            const res = await axios.get("/donations-request",{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });
            return res.data;
        },
    });

    const totalDonation = data?.total;

    return(
    <div>
                <div className="bg-red-600 text-white p-12  shadow mb-8 font-bold">
                    <h1 className="text-4xl  text-center" >Welcome,{user.displayName}</h1>
    
                    <p className="text-center mt-2 text-lg">
                            Manage users,donations and Statistics from your dashboard
                    </p>
                </div>
    
    
                <div className="text-black grid grid-cols-1 sm:grid-cols-3 p-4 gap-6 ">
                    <div className=" card bg-white shadow-lg p-6 rounded text-center flex flex-col justify-center items-center gap-2 ">
                        <FaUsers className="text-blue-600 text-5xl mb-3" />
                        <h2 className="font-bold">{users.length}</h2>
                        <p className="font-bold">Total Donors</p>
                    </div>
    
                    <div className="card bg-white shadow-lg p-6 rounded text-center flex flex-col justify-center items-center gap-2 ">
                        <FaDonate className="text-yellow-600 text-5xl mb-3"/>
                        <h2 className="font-bold">${funding.reduce((acc,f)=>acc+f.amount,0)}</h2>
                        <p className="font-bold">Total Funding</p>
                    </div>
    
                    <div className="card bg-white shadow-lg p-6 rounded text-center flex flex-col justify-center items-center gap-2 ">
                        <MdBloodtype className="text-red-600 text-5xl mb-3"/>
                        <h2 className="font-bold ">{totalDonation}</h2>
                        <p className="font-bold">Total Blood Requests</p>
                    </div>
    
                </div>
    
    
            </div>
    )

}

export default VolunteerDashboard;