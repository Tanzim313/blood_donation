//import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import React, { use, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { auth } from "../../firebase.init";
import { AuthContext } from "../../Authprovider/AuthContext";
import { GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";


const Login = () =>{
    
    const {signInUser,signInWithGoogle} = use(AuthContext);

    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [showPassword,setShowPassword] = useState(false);


    const [error,setError] = useState('');
    const emailRef = useRef();
    const navigate = useNavigate();

    const handleTogglePasswordShow = (e)=>{
      e.preventDefault();
      setShowPassword(!showPassword);
    }


    const handleSignIn =(event)=>{

        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        setError('');



        signInUser(email,password)
            .then(result=>{
                console.log(result.user);
                event.target.reset();


                 toast.success("Login Successful!")
                    navigate(from,{replace:true});

                {/**if(!result.user.emailVerified){
                          toast.error('please verify your email address')
                }
                else{
                    toast.success("Login Successful!")
                    navigate(from,{replace:true});
                    //navigate(location.state || '/home');
                }**/}


            })
            .catch(error => {
                console.log(error.message);
                setError(error.message);
            })


    }

    const handleForgetPassword =()=>{
                const email = emailRef.current.value;
                navigate("/forgot-password",{state:{email}});
    }



    /*const handleGoogleSignIn=()=>{

            signInWithGoogle()
            .then((result)=>{

                console.log(result.user)
                navigate(from,{replace:true});
               // navigate(location?.state || '/home')
            })
            .catch(error=>toast.error(error.message));
    }*/


    


    return(
        <div className="">

        <Toaster></Toaster>

            <div className=" hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold">Login now!</h1>
      <p className="py-6 text-3xl font-bold">
          Blood Donation Request 
      </p>
    </div>
    <div className="card text-white font-bold bg-red-600 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <form action="" onSubmit={handleSignIn}>
            <fieldset className="fieldset">
          <label className="label ">Email</label>
          <input type="email" 
          name="email" 
          className="input" 
          ref={emailRef}
          placeholder="Email" />

          <label className="label">Password</label>
           <div className="relative">
                          <input 
                              type={showPassword? "text":"password"}
                              name="password" 
                              className="input" 
                              placeholder="Password" />
          
                          <button onClick={handleTogglePasswordShow} className="absolute right-2 top-1 rounded-md btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
                              {showPassword? <IoEye /> : <IoMdEyeOff /> }</button>
            </div>

          <div><a onClick={handleForgetPassword} className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
        </form>

        {
            error && <p className="text-red-600">{error}</p>
        }

        {/* Google */}
  {/*<button onClick={handleGoogleSignIn} className="btn bg-white text-black border-[#e5e5e5]">
      <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
      Login with Google
    </button>*/}


        <p>New to Our Website? Please <Link className="text-blue-600 underline" to="/register">Register</Link></p>
      </div>
    </div>
  </div>
</div>

        </div>
    )

}

export default Login;