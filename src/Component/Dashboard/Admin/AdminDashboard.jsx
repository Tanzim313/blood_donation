import React, { use } from "react";
import { AuthContext } from "../../../Authprovider/AuthContext";

const AdminDashboard =()=>{

    const {user} = use(AuthContext);

    return(
        <div>
            <div className="bg-red-600 text-white p-12  shadow mb-8 font-bold">
                <h1 className="text-4xl  text-center" >Welcome,{user.displayName}</h1>

                <p className="text-center mt-2 text-lg">
                        Manage users,donations and Statistics from your dashboard
                </p>
            </div>
           

            <div>
                <div className="">


                </div>
            </div>
        </div>
    )

}

export default AdminDashboard;