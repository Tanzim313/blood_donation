import React from "react";
import { useNavigate } from "react-router";

const Banner =()=>{
    const navigate = useNavigate();

    return(
        <div className="bg-red-50 h-[70vh] flex flex-col justify-center text-center">
            <div>
                <h1 className="text-5xl font-bold text-red-600">
                    Donate Blood,Save Life</h1>
                <p className="mt-4 text-xl text-red-800 ">
                    Become a donor or search for donors near you</p>

                <div className="flex flex-row justify-center gap-4 my-8">
                    <button 
                    onClick={()=>navigate("/register")}
                    className="bg-red-500 p-3 text-white font-bold rounded-lg ">
                        Join as a Donor
                    </button>

                    <button 
                    onClick={() => navigate("/search")}
                    className="bg-red-500 p-3 text-white font-bold rounded-lg ">
                        Search Donors
                    </button>
                </div>
            </div>

        </div>
    )
}
export default Banner;
