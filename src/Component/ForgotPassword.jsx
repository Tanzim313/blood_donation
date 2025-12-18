import { sendPasswordResetEmail } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { auth } from "../firebase.init";
import toast, { Toaster } from "react-hot-toast";


const ForgotPassword =()=>{

    const location = useLocation();
    const navigate = useNavigate();

    const [email,setEmail] = useState("");

    useEffect(()=>{
        if(location.state?.email){
            setEmail(location.state.email);
        }
    },[location.state]);


     const handleReset =(e)=>{

        e.preventDefault();

        if(!email){
            toast.error("please fill your email");
            return;
        }

        sendPasswordResetEmail(auth,email)
                    .then(()=>{
                            toast.success('please cheack your email')
                            
                            setTimeout(()=>{
                            window.location.href = "https://mail.google.com";
                            },1500);
                        })
                    .catch(()=>{
                        toast.error(error.message);
                    })
     }

    return(

        <div>
            <Toaster></Toaster>

            <div className="p-30 flex flex-col justify-center items-center">
                <h1 className="text-center text-4xl font-bold mb-10">Forgot Password</h1>
                <div className="flex flex-col justify-center items-center border-2 p-10">
                    <form className="flex flex-col justify-center items-center" onSubmit={handleReset} action="">
                        <label className="floating-label mb-4">
                                <span>Your Email</span>
                                <input 
                                type="email" 
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="mail@site.com" 
                                className="input input-md min-w-[250px]" />
                        </label>

                        <button type="submit" className="btn btn-primary">
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>

        </div>

    )

}

export default ForgotPassword;