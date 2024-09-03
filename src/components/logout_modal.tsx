import React from "react";
import DialogModal from "./dialog_modal";

function LogoutModal({ open, onLogout, onClose }) {
  return (
    <DialogModal open={open} handleClose={onClose}>
      <div className="p-6 bg-white w-[30rem] rounded-lg shadow-lg">
        <p className="mb-6 text-xl font-semibold text-center text-gray-800">
          Are you sure you want to logout?
        </p>

        <div className="flex justify-center gap-6">
          <button
            className="px-6 py-2 text-white transition duration-200 bg-red-600 rounded-md shadow-sm hover:bg-red-700"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-6 py-2 text-white transition duration-200 bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </DialogModal>
  );
}

export default LogoutModal;
