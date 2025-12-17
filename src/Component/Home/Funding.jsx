import React, { use, useState } from "react";
import { AuthContext } from "../../Authprovider/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const Funding =()=>{

    const {user} = use(AuthContext);
    const [amount,setAmount] = useState("");

    const axios = useAxiosSecure();

    console.log("pay_users:",user);



    const handleFunding = async ()=>{



        if(!amount||amount<=0){
            alert("please enter a valid amount!");

            return;
        }

        const paymentInfo = {
            amount: Number(amount),
            userId: user?.uid,
            name: user?.displayName,
            email: user?.email,
        };

        const res = await axios.post("/payment-checkout-session",paymentInfo,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                }
        );

        console.log("stripe-session:",res.data)

        if(res.data.url){
            window.location.href = res.data.url;
        }

    }

    const{data:funding=[]}=useQuery({
        queryKey:["funding",user?.uid],
        queryFn:async()=>{
            const res = await axios.get(`/funds-data/${user?.uid}`,{
                    headers:{
                        authorization: `Bearer ${user?.accessToken}`
                    }
                });

            return res.data;
        },
        enabled: !!user?.uid,
    })




    return(
        <div className="p-4">

            <div className="flex flex-row justify-center mt-10 mb-10">

                <input 
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e)=>setAmount(e.target.value)}
                className="input input-bordered"
                />

                <button className="btn" onClick={handleFunding}>Give Fund</button>

            </div>

            <div>
                <h1 className="text-center text-4xl font-bold mb-10">Users Payment List</h1>

                <table className="table w-full border overflow-auto text-center p-4 mb-20">
                    <thead>
                    <tr className="">
                        <th >Name</th>
                        <th>Amount</th>
                        <th>Funding Date</th>
                    </tr>
                    </thead>

                    <tbody>
                        {funding.map((f)=>{

                            const date = new Date(f.created_at);
                            const datetime = date.toLocaleString();

                            
                            return(
                            <tr key={f._id}>
                                <td>{f.name}</td>
                                <td>${f.amount}</td>
                                <td>{datetime}</td>
                            </tr>)
                        
                        })}

                    </tbody>

                </table>

            </div>

        </div>
    )

}

export default Funding;