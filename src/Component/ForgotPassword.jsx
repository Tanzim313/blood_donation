import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { auth } from "../firebase.init";
import toast, { Toaster } from "react-hot-toast";


const ForgotPassword =()=>{

    const location = useLocation();
    const [email,setEmail] = useState(location.state?.email || "");
    const [isSubmitting,setIsSubmitting] = useState(false);


     const handleReset =(e)=>{

        e.preventDefault();

        if(!email){
            toast.error("Please enter your email address.");
            return;
        }

        setIsSubmitting(true);
        sendPasswordResetEmail(auth,email)
                    .then(()=>{
                        toast.success('Reset instructions have been sent to your email.');
                    })
                    .catch((error)=>{
                        toast.error(error.message || 'Failed to send reset email.');
                    })
                    .finally(()=>{
                        setIsSubmitting(false);
                    })
     }

    return(
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.18),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(248,113,113,0.16),_transparent_30%),bg-slate-950] py-20">
            <Toaster />
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] bg-slate-900/95 border border-white/10 p-10 shadow-2xl">
                    <div className="mb-8 text-center">
                        <p className="text-sm uppercase tracking-[0.3em] text-red-300">Forgot Password</p>
                        <h1 className="mt-3 text-4xl font-extrabold text-white">Reset your account access</h1>
                        <p className="mt-4 text-slate-400">Enter your email address and we will send a secure reset link to your inbox.</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleReset}>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-200">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full rounded-3xl bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending reset email...' : 'Send reset email'}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-slate-400">
                        Remembered your password? <Link to="/login" className="font-semibold text-red-400 hover:text-red-300">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;
