//import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import React, { use, useState } from "react";
//import { auth } from "../../firebase.init";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { Link, useLoaderData, useNavigate } from "react-router";
import { AuthContext } from "../../Authprovider/AuthContext";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "../../firebase.init";
import { useMutation } from "@tanstack/react-query";


const Register =()=>{
    
    const {createUser} = use(AuthContext);
    const navigate = useNavigate();

    const [success,setSuccess] = useState(false);
    const [error,setError] = useState('');
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirm,setShowConfirm] = useState(false);


    const {districts,upozilas} = useLoaderData();

    const [selectedDistrict,setSelectedDistrict] = useState("");
    const [filteredUpozilas,setFilteredUpozilas] = useState([]);
    


    const handleDistrictChange = (e)=>{
        const selected = e.target.value;
        setSelectedDistrict(selected);
        console.log("selected:",selected)


        const filtered = upozilas.filter(upozila=>upozila.district_id === selected);
        setFilteredUpozilas(filtered);


    }

    
    const handleRegister =(event)=>{
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const terms = event.target.terms.checked;
        const name = event.target.name.value;
        const photo = event.target.photo.value;
        const blood = event.target.blood.value;
        const confirm = event.target.confirm.value;
        const upozila = event.target.upozila.value;



        console.log('register click',name);

        //reset error
        setError('');
        setSuccess(false);


        if(password !== confirm){
            setError('Password & Confirm Password does not match');
            return;
        }

        const Uppercase = /[A-Z]/.test(password);
        const Lowercase = /[a-z]/.test(password);
        const isLength = password.length>=6;

        if(!Uppercase){
            setError('Password Must Contain At Least 1 UpperCase Letter');
            return;
        }
        if(!Lowercase){
            setError('PassWord Must Contain At Least 1 LowerCase Letter');
            return;
        }
        if(!isLength){
            setError('PassWord Must be at Least 6 characters Long');
            return ;
        }

        if(!terms){
            setError('Please accept our terms and conditions');

            return ;
        }

        createUser(email,password)
        .then(result => {

                const firebaseUser = result.user;

                console.log('after creation a new user',result.user)
                setSuccess(true);

                event.target.reset();

                //update user profile
                const profile ={
                    displayName:name,
                    photoURL:photo


                }

                updateProfile(result.user,profile)
                .then(()=>{})
                .catch()

                //send verification email

                sendEmailVerification(result.user)
                    .then(()=>{
                        alert('please login to your email and verify our email')
                    })
                
                const districtName = districts.find(d => d.id === selectedDistrict)?.name || "";
                const upozilaName = filteredUpozilas.find(u => u.id === upozila)?.name || "";   

                userMutation.mutate({
                    uid: firebaseUser.uid,
                    name,
                    email,
                    photo,
                    blood,
                    district: districtName,
                    upozila: upozilaName,
                    
                    });

                    navigate("/");

                    //auth.signOut()
                    ///.then(()=>{
                    //        navigate("/login");
                   // }); 

            })
            .catch((error)=>{
                console.log(error.message)
                setError(error.message);
            })


    }

    const handleTogglePasswordShow = (event) =>{
        event.preventDefault();
        setShowPassword(!showPassword);
    }


    const userMutation = useMutation({
        mutationFn: async(userData)=>{
            const res = await fetch("http://localhost:3000/users",{
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body:JSON.stringify(userData),
            });
            return res.json();
        },
        onSuccess:()=>{
            console.log("User saved to db successfully!!")
        }
    })



  return(
        <div>
        <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
         <h1 className="text-5xl font-bold mb-10">Register now!</h1>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
        <form onSubmit={handleRegister} action="">
        <fieldset className="fieldset">
        <label className="label">Your Name</label>
            <input type="text" name="name" className="input" placeholder="Your Name" />

        <label className="label">Email</label>
        <input type="email" name="email" className="input" placeholder="Email" />
            

            {/* photo Url */}

            <label className="label"> Your Photo </label>
            <input type="file" name="photo" className="file-input" />
            
            
            <label className="label" >Blood Group</label>
            <select name="blood" className="select select-bordered" required>
                <option >A+</option>
                <option >A-</option>
                <option >B+</option>
                <option >B-</option>
                <option >AB+</option>
                <option >AB-</option>
                <option >O+</option>
                <option >O-</option>
            </select>

            <label className="label">District</label>
                  <select name="district" className="select select-bordered" onChange={handleDistrictChange} required>
                    <option value="">Select District</option>
                    {districts.map((district, index) => (
                      <option key={index} value={district.id}>{district.name}</option>
                    ))}
                  </select>

                  <label className="label">Upozila</label>
                  <select name="upozila" className="select select-bordered" required>
                    <option value="">Select Upozila</option>
                    {filteredUpozilas.map((upozila, index) => (
                      <option key={index} value={upozila.id}>{upozila.name}</option>
                    ))}
                  </select>
            
            
            
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



            <label className="label">Confirm Password</label>
            <div className="relative">
                <input 
                    type={showConfirm? "text":"password"}
                    name="confirm" 
                    className="input" 
                    placeholder="Confirm Password"
                    required
                    />

                <button onClick={(e)=>{
                    e.preventDefault();
                    setShowConfirm(!showConfirm);
                }} 
                className="absolute right-2 top-1 rounded-md btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
                    {showConfirm? <IoEye /> : <IoMdEyeOff /> }</button>
            </div>





            <div>
                <label class="label">
                    <input 
                    type="checkbox"  
                    class="checkbox"
                    name="terms"

                    />
                        Accept our terms and Condition
                </label>
            </div>

            <button className="btn btn-neutral mt-4">Register</button>

        </fieldset>
        {
            error && <p className="text-red-600">{error}</p>
        }
        {
            success && <p className="text-green-600 font-bold " >Account Created Successfully!</p>
        }
        </form>

        <p className="">Already have an ccount? Please <Link to="/login" className="text-blue-500 underline" >Login</Link> </p>

      </div>
    </div>
  </div>
</div>
        </div>
    )
}

export  default Register;