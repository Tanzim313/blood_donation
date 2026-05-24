import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const actionClass = "w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100";

const UserActions = ({ user, onBlock, onUnblock, onMakeVolunteer, onMakeAdmin, onMakeDonor }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="btn btn-sm rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
        aria-label="Open user actions"
      >
        <BsThreeDotsVertical />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
          {user.status === "active" ? (
            <button
              className={actionClass}
              onClick={() => {
                onBlock(user._id);
                setOpen(false);
              }}
            >
              Block User
            </button>
          ) : (
            <button
              className={actionClass}
              onClick={() => {
                onUnblock(user._id);
                setOpen(false);
              }}
            >
              Unblock User
            </button>
          )}

          {user.role !== "donor" && (
            <button
              className={actionClass}
              onClick={() => {
                onMakeDonor(user._id);
                setOpen(false);
              }}
            >
              Make Donor
            </button>
          )}

          {user.role !== "volunteer" && (
            <button
              className={actionClass}
              onClick={() => {
                onMakeVolunteer(user._id);
                setOpen(false);
              }}
            >
              Make Volunteer
            </button>
          )}

          {user.role !== "admin" && (
            <button
              className={actionClass}
              onClick={() => {
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
  );
};

export default UserActions;
