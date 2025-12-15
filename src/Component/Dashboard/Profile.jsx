import React, { use, useState } from "react";
import { AuthContext } from "../../Authprovider/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQuery } from "@tanstack/react-query";


const Profile =()=>{

    const {user} = use(AuthContext);
    const axios = useAxiosSecure();

    const [isEditing,setIsEditing] = useState(false);
    const [formData,setFormData] = useState({});
    const [selectedDistrict, setSelectedDistrict] = useState("");

    //districts
        const {data:district=[]}=useQuery({
    
            queryKey: ["district"],
            queryFn: async()=>{
                const res = await axios.get("/district");
    
                return res.data;
            },
    
        });
    
        //upazilas
    
        const {data:upozila = []} = useQuery({
            queryKey: ["upazila"],
            queryFn: async()=>{
                const res = await axios.get("/upazila");
    
                return res.data;
            }
        })
    
        const filteredUpozilas = upozila.filter(
            (u)=>u.district_id === selectedDistrict
        );
    



    const {data:profile=[]}=useQuery({
        queryKey: ["profile"],

        queryFn: async()=>{
            const res = await axios.get(`/profile/${user.email}`);
            
            setFormData(res.data);
            setSelectedDistrict(res.data?.district);

            return res.data;
        }
    })

    
    

    const mutation = useMutation({
        mutationFn: async(updatedData)=>{
            const res = await axios.patch("/profile",updatedData)
            return res.data;
        },
        onSuccess:()=>{
            setIsEditing(false);
            alert("profile updated successfully");
        }
    })

    const handleChange = (e)=>{
        const{name,value}= e.target;
        setFormData({...formData,[name]:value});

        if(name === "district"){
            setSelectedDistrict(value);
            setFormData((prev) => ({ ...prev, upazila: "" }));
        }

    };

    const districtName = district.find(d => d.id === selectedDistrict)?.name || "";

    const handleSave=()=>{


        mutation.mutate({
            ...formData,
            email:user.email,
            district:districtName,
        });

        

        

    }

   
    return(
        <div className="p-4 flex flex-col justify-center items-center" >


            <div className="mt-10 w-[300px] ">

             {!isEditing?(
                <button
                onClick={()=>setIsEditing(true)}
                className="btn bg-red-600 w-full font-bold text-xl rounded-md text-white"
                >
                    Edit
                </button>
            ):(
                <button
                onClick={handleSave}
                className="btn btn-success w-full text-white rounded-md text-xl"
                >
                    save
                </button>
            )}
        </div>
            




            <div className=" border-4 border-red-600 flex flex-col justify-center items-center text-center mt-5  p-10 gap-2 ">
                

                <img 
                src={formData.photo}
                onChange={handleChange}
                disabled={!isEditing}
                className="mb-4 rounded-full w-[50px]"
                />
                
                
                <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Name"
                className="input input-bordered text-black font-bold "
                />


                <input 
                type="email"
                value={formData.email}
                disabled
                className="input input-bordered text-black font-bold "
                />

                <select 
                name="blood" 
                value={formData.blood}
                onChange={handleChange}
                disabled={!isEditing}
                className="select select-bordered text-black font-bold "
                >  

                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(
                    bg=>(
                        <option key={bg} value={bg}>{bg}</option>
                    )
                )}
            </select>

            { !isEditing?
            (<span className="select select-bordered text-black font-bold">{formData.district}</span>)
            :
            (
            <select 
            name="district"
            value={formData.district || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="select select-bordered text-black font-bold  "
            placeholder="District"
            >
                    <option>Select your District</option>
                    {   
                    
                        district.map((d)=>(
                            <option key={d._id} value={d.id}>
                                {d.name}
                            </option>

                        ))
                      
                    }
               
            </select>
            )
        }




                   {
                    !isEditing?
                    (
                        <span  className="select select-bordered text-black font-bold ">{formData.upozila}</span>
                    ):(

                     <select 
            name="upozila"
            value={formData.upozila}
            onChange={handleChange}
            disabled={!isEditing}
            className="select select-bordered text-black font-bold  "
            placeholder="upozila"
            >

                     <option>select your upazila</option>
                    {
                        filteredUpozilas.map((d)=>(
                            <option key={d._id} value={d.name}>
                                {d.name}
                            </option>

                        ))
                      }
                      
                    </select>


                    )

             }
               



            </div>

            
        </div>
    )
}

export default Profile;