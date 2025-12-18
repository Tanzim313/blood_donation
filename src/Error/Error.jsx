import { div } from "framer-motion/client";
import React from "react";
import { useNavigate } from "react-router";

const Error=()=>{
    const navigate = useNavigate();

    const handleHome = ()=>{
        navigate("/");
    }

    return(

        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200">
            <h1 className="text-5xl font-bold text-center text-red-600">404</h1>
            <h2 className="text-2xl text-black font-bold mt-4">Oops! Page Not Found</h2>
            <p  className="mt-2 text-gray-700">The page your are looking for does not exist.</p>

            <button
                onClick={handleHome}
                className="mt-4 btn btn-primary rounded-md hover:bg-blue-600">
                Back to Home
            </button>

        </div>
    
    );


}


export default Error;
