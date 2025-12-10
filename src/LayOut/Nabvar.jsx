import React, { use, useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../Authprovider/AuthContext";


const Nabvar =()=>{

    const {user,signOutUser} = use(AuthContext);

    const handleSignOut =()=>{
        signOutUser()
        .then(()=>{})
        .catch(error=>{
            console.log(error)
        })
    }

    const links =( 
            <>
            { !user && <>
                        <li className="text-xl font-bold text-[#ff0000] "><NavLink to="/login">Login</NavLink></li>
                        <li className="text-xl font-bold text-[#ff0000]"><NavLink to="/register">Register</NavLink></li>
                         <li className="text-xl font-bold text-[#ff0000] "><NavLink to="/pending-donation">Donation Request</NavLink></li>
                        
                </>
            }
            {
            user && <>
                <li className="text-xl font-bold text-[#ff0000] "><NavLink to="/pending-donation">Donation Request</NavLink></li>
                <li className="text-xl font-bold text-[#ff0000] "><NavLink to="/funding">Funding</NavLink></li>

            </>
            }
    </>
    )

    const [theme,setTheme] = useState(localStorage.getItem('theme')||"Light")

    useEffect(()=>{
      const html = document.querySelector('html')
      html.setAttribute("data-theme",theme)
      localStorage.setItem("theme",theme)
    },[theme])


    const handleTheme=(checked)=>{
        
      setTheme(checked? "dark":"light")

      console.log(checked)
    }


    const [dropdownOpen,setDropdownOpen] = useState(false);

    
    const toggleDropdown = ()=>{
        setDropdownOpen(!dropdownOpen);
    };


    return(

        <div className="">
                <div className="navbar shadow-sm ">
  <div className=" navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-4 w-50 p-4 shadow absolute z-40">
        {links}
      </ul>
    </div>
    <a className="text-xl">
      <span className="text-[#ff0000] text-2xl sm:text-3xl italic font-bold ">Blood</span><span className="italic font-bold">Finding</span></a>
  </div>
  <div className=" navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
        {links}
    </ul>
  </div>
  

  <div className="navbar-end p-2 ">
   {user?
   <div className="flex gap-x-4 items-center">

<div
 className="tooltip tooltip-bottom" 
 //data-tip={user.displayName}
 onClick={toggleDropdown}
 >
   <img className="sm:w-[50px] sm:h-[50px] w-[30px] h-[30px] rounded-full border-2 border-[#ffffff8c]" src={user.photoURL} alt="" /> 
</div >


    {dropdownOpen && (
        <div className="relative">
            <ul className="border-2 absolute top-12 right-0 p-2 dropdown-center ">
                <li>
                     <a className="hover:bg-red-700 btn bg-[#ff0000] font-bold  w-20  text-white"><NavLink to="/dashboard">Dashboard</NavLink></a>
                </li>
                <li>
                    <a onClick={handleSignOut} className="hover:bg-red-700 btn bg-[#ff0000] font-bold  w-20  text-white">Signout</a>
                </li>
                <li>
                    <input 
                        onChange={(e)=>handleTheme(e.target.checked)}
                        type="checkbox" 
                        defaultChecked className="toggle toggle-sm" />
                </li>
            </ul>
        </div>
    )}

   </div>
   :<Link className="btn bg-[#ff0000] text-xl  font-bold   w-20  text-white" to="/login">Login</Link>}
  </div>
</div>
        </div>

    );
};

export default Nabvar;