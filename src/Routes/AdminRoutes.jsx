import React, { use } from "react";
import { Navigate, useLocation } from "react-router";
import useRole from "../hooks/useRole";
import { AuthContext } from "../Authprovider/AuthContext";
import Error from "../Error/Error";


const AdminRoutes =({children})=>{

    const {user,loading} = use(AuthContext);
    const {role,isRoleLoading} = useRole();

    const location = useLocation();

    if(loading || isRoleLoading){
        return <span className="loading loading-spinner text-neutral"></span>;
    }

    if(role !== 'admin' ){
        return <Error/>; 
    }
    return children ;

    
};

export default AdminRoutes;