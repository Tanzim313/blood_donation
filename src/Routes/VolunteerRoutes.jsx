import React, { use } from "react";
import { Navigate, useLocation } from "react-router";
import useRole from "../hooks/useRole";
import { AuthContext } from "../Authprovider/AuthContext";
import Error from "../Error/Error";


const VolunteerRoutes =({children})=>{

    const {user,loading} = use(AuthContext);
    const {role,isRoleLoading} = useRole();

    //const location = useLocation();

    if(loading || isRoleLoading){
        return <span className="loading loading-spinner text-neutral"></span>;
    }

    if(role !== 'volunteer' ){
        return <Error/>; 
    }
    return children ;

    
};

export default  VolunteerRoutes;