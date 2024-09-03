import React from "react";
import Toast from "@/components/toast_container";
import "react-toastify/dist/ReactToastify.css";


export default function Auth({ title = "", children }) {
  return (
      <main>
        <div className="flex h-full content-center items-center justify-center">
          <div className="w-full px-4 lg:w-4/12">
            {children}
          </div>
          <Toast type="auth"/>
        </div>
      </main>
  );
}
