import React from "react";
import { Slide, ToastContainer } from "react-toastify";

function Toast({ type = "" }) {
  return (
    <ToastContainer
      position="top-right"
      autoClose={type == "auth" ? 1500 : 2500}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      transition={Slide}
      draggable
      pauseOnHover
      limit={2}
      theme="colored"
    />
  );
}

export default Toast;
