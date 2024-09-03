import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const Unauthorized = ({
  message = "You are not authorized to view this page.",
}) => {


  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
      <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
      <p className="text-lg mb-6">{message}</p>
    </div>
  );
};

export default Unauthorized;
