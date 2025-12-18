import React, { use } from "react";
import { AuthContext } from "../Authprovider/AuthContext";
import { Navigate, useLocation } from "react-router";


const PrivateRoutes =({children})=>{

    const {user,loading} = use(AuthContext);

    const location = useLocation();

    if(loading){
        return <span className="loading loading-spinner text-neutral"></span>;
    }

    if(user){
        return children;
    }
    return <Navigate state={{from:location}} to="/login" replace></Navigate>;

    
};

export default PrivateRoutes;