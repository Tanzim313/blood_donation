import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";


const UserActions = ({user,onBlock,onUnblock,onMakeVolunteer,onMakeAdmin,onMakeDonor})=>{
  
  const [open,setOpen] = useState(false)
  
  return(
    

      <div className="relative">
        <button
            onClick={()=>setOpen(!open)}>
               <BsThreeDotsVertical />
        </button>

        {open&&(
          <div className="absolute right-0 mt-2 w-48 bg-white border shadow rounded-md p-2 z-50">
                
                {user.status === "active"?(
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={()=>{
                      onBlock(user._id);
                      setOpen(false);
                    }}
                  >
                    Block User
                  </button>
                ):(
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={()=>{
                      onUnblock(user._id);
                      setOpen(false);
                    }}
                  >
                    Unblock User
                  </button>
                )}

                {user.role!=="donor"&&(
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={()=>{
                      onMakeDonor(user._id);
                      setOpen(false);
                    }}
                  >
                    Make Donor
                  </button>
                )}

                {user.role!=="volunteer"&&(
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={()=>{
                      onMakeVolunteer(user._id);
                      setOpen(false);
                    }}
                  >
                    Make Volunteer
                  </button>
                )}

                 {user.role!=="admin"&&(
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={()=>{
                      onMakeAdmin(user._id);
                      setOpen(false);
                    }}
                  >
                    Make Admin
                  </button>
                )}

                
          </div>
        )}

      </div>


  )
}

export default UserActions;