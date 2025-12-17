import React, { use, useEffect, useState } from "react";
import { AuthContext } from "../../Authprovider/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";



const Profile =()=>{
    const {user,loading,updateUser} = use(AuthContext);
    const axios = useAxiosSecure();
    const queryClient = useQueryClient();


    const [isEditing,setIsEditing] = useState(false);
    const [formData,setFormData] = useState({});

    const [selectedDistrict,setSelectedDistrict] = useState("");

    if(loading) return <p className="text-center mt-10">Loading.....</p>
    if(!user)return <p className="text-center mt-10">Not logged in</p>


    //district....

    const {data:districts=[]} = useQuery({
        queryKey:["districts"],
        queryFn: async()=>(await axios.get("/district")).data,
    });

    //upazila....

     const {data:upazilas=[]} = useQuery({
        queryKey:["upazilas"],
        queryFn: async()=>(await axios.get("/upazila")).data,
    });

    //profile...

     const {data:profile={},isLoading} = useQuery({
        queryKey:["profile",user.email],
        enabled: !!user.email&&districts.length>0,
        queryFn: async()=>(await axios.get(`/profile/${user.email}`,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                })
                
        
    ).data,
    });


    useEffect(()=>{
        if(!profile|| !districts.length) return;

        setFormData(profile);

        const districtObj = districts.find(d=>d.name===profile.district);
        setSelectedDistrict(districtObj?.id||"");

    },[profile,districts]);


    const filteredUpazilas = upazilas.filter(u=>u.district_id === selectedDistrict);

    const mutation = useMutation({

        mutationFn: async(data)=>axios.patch("/profile",data,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                }),

        onSuccess:()=>{
            queryClient.invalidateQueries(["profile",user.email]);
            setIsEditing(false);

            
            toast.success('Successfully Profile Updated!')

        }

    })


    const handleChange = (e)=>{
        const {name,value}=e.target;

        if(name === "district"){
            setSelectedDistrict(value);
            setFormData(p=>({
                ...p,upozila:""
            }));
            return;
        }

        setFormData(p=>({...p,[name]:value}));

    };

    const handleSave = async()=>{
        const districtName = districts.find(d=>d.id === selectedDistrict)?.name||"";

        try{
            await updateUser({displayName:formData.name,photoURL:formData.photo});

            mutation.mutate({
                ...formData,
                email:user.email,
                district:districtName,
            });
        }catch(err){
            console.log("firebase upadetd failed:",err);

           toast.success('firebase upadetd failed!')

        }
    };

    if(isLoading)return <p className="text-center mt-10">Loading Profile......</p>


    return(
        <div className="flex justify-center mt-30 mb-30 p-4">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div className="min-w-[280px] border p-4 rounded-lg">

                {!isEditing?(
                    <button
                    onClick={()=>setIsEditing(true)}
                    className="btn bg-red-600 w-full mb-4 text-xl font-bold text-white"
                    >
                        Edit
                    </button>

                ):(
                    <button
                    onClick={handleSave}
                    className="btn bg-red-600 w-full mb-4 text-xl font-bold text-white"
                    >
                        Save
                    </button>
                )}

                <img 
                src={formData.photo} 
                className="w-24 h-24 rounded-full mx-auto mb-4"
                alt="avatar" />

                <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="input input-bordered w-full mb-2 text-black font-bold"
                />

                
                <input
                value={user.email}
                disabled
                className="input input-bordered w-full mb-2 text-black font-bold"
                />

                
                <input
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                disabled={!isEditing}
                className="input input-bordered w-full mb-2 text-black font-bold"
                />


                <select 
                name="blood"
                value={formData.blood}
                onChange={handleChange}
                disabled={!isEditing}
                className="select select-bordered w-full mb-2 text-black font-bold"
                >

                <option value="">Blood Group</option>
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg=>(
                        <option key={bg} value={bg}>{bg}</option>
                    ))}

                </select>


                <select 
                name="district"
                value={selectedDistrict}
                onChange={handleChange}
                disabled={!isEditing}
                className="select select-bordered w-full mb-2 text-black font-bold"
                >

                <option value="">District</option>
                    {districts.map(d=>(
                        <option key={d._id} value={d.id}>{d.name}</option>
                    ))}

                </select>


                <select 
                name="upozila"
                value={formData.upozila}
                onChange={handleChange}
                disabled={!isEditing}
                className="select select-bordered w-full mb-2 text-black font-bold"
                >

                <option value="">Upazila</option>
                    {filteredUpazilas.map(d=>(
                        <option key={d._id} value={d.name}>{d.name}</option>
                    ))}

                </select>

            </div>

        </div>
    )




}

export default Profile;