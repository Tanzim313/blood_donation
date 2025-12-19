import React, { use } from "react";
import { AuthContext } from "./AuthContext";
import { useQuery } from "@tanstack/react-query";



const useRole = ()=>{
    const {user} = use(AuthContext);

    

    const {data: role, isLoading:isRoleLoading} = useQuery({
        queryKey:['role',user?.email],
        queryFn:async () =>{
                const res = await fetch(
                        `https://blood-server-topaz.vercel.app/users/${user?.email}/role`
                );
                const data = await res.json();
        

                return data.role;
        },
    });

    return {role:role,isRoleLoading};
};

export default useRole;