import React from "react";
import { FaHandHoldingHeart, FaMapMarkedAlt, FaUsers } from "react-icons/fa";


const Featured =()=>{


    return(
        <div className="py-16 bg-red-50 mt-15 ">
            <h2 className="text-4xl font-bold text-center text-red-600 mb-10">
                Why Donate Blood?
            </h2>

        <div className="">

            <div className="p-4 flex flex-col md:grid-cols-3 gap-2 px-6 md:px-16 mt-4">
                <div className="flex justify-center mb-4">
                    <FaHandHoldingHeart className="text-red-600 text-5xl"></FaHandHoldingHeart>
                </div>
                <h2 className="text-xl font-semibold text-center text-red-600">
                    Join Our Donor Community
                </h2>
                <p className="text-gray-500 mt-2 text-center">
                    connect with thousands of active donors ready to help people across the country.
                </p>
            </div>

            <div className="flex flex-col gap-2 px-6 md:px-16 mt-8">
                <div className="flex justify-center mb-4">
                    <FaMapMarkedAlt className="text-red-600 text-5xl"></FaMapMarkedAlt>
                </div>
                <h2 className="text-xl font-semibold text-center text-red-600">
                    Join Our Donor Community
                </h2>
                <p className="text-gray-500 mt-2 text-center">
                    connect with thousands of active donors ready to help people across the country.
                </p>
            </div>


             <div className="flex flex-col gap-2 px-6 md:px-16 mt-8">
                <div className="flex justify-center mb-4">
                    <FaUsers className="text-red-600 text-5xl"></FaUsers>
                </div>
                <h2 className="text-xl font-semibold text-center text-red-600">
                    Join Our Donor Community
                </h2>
                <p className="text-gray-500 text-center">
                    connect with thousands of active donors ready to help people across the country.
                </p>
            </div>


        </div>
            

        </div>
    )

}

export default Featured;