import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";



const FundingSuccess=()=>{

    const [params] = useSearchParams();
    const session_id = params.get("session_id");

    const axios = useAxiosSecure();
    const queryClient = useQueryClient();


    const hasCalled = useRef(false);

    const fundingMutation = useMutation({
        mutationFn:async(session_id)=>{

        const res = await axios.post("/funds",{session_id});
        
        return res.data;

        },
        onSuccess:()=>{
            console.log("Funding save...")

            queryClient.invalidateQueries(["funds"])
        },

        onError:(err)=>{
            console.log("Error funds:",err)
        }
    });

    useEffect(()=>{
        if(session_id && !hasCalled.current){
            hasCalled.current = true;
            fundingMutation.mutate(session_id);
        }
    },[session_id]);

    return(
        <div className="p-40 text-center">
            <h1>Payment Successful.....</h1>
            <p>Thank You For  Your Donation</p>

        </div>
    )

}

export default FundingSuccess;