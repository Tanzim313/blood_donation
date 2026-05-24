import React, { useContext } from "react";
import useRole from "../hooks/useRole";
import { AuthContext } from "../Authprovider/AuthContext";
import Error from "../Error/Error";


const AdminRoutes =({children})=>{

    const {loading} = useContext(AuthContext);
    const {role,isRoleLoading} = useRole();

    if(loading || isRoleLoading){
        return <span className="loading loading-spinner text-neutral"></span>;
    }

    if(role !== 'admin' ){
        return <Error/>; 
    }
    return children ;

    
};

export default AdminRoutes;
