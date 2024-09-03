import React, { useEffect, useState } from "react";
import Toast from "@/components/toast_container";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/side_bar";


interface AdminProps {
  title?: string;
  children: React.ReactNode;
}

const Admin = ({ title = "", children }: AdminProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
      <div className="gap-3 min-h-screen">
        <div>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        <main
          style={{ marginLeft: isSidebarOpen ? "12rem" : "5rem" }} // Use inline styles for dynamic margin
          className="flex-1 transition-all duration-300"
        >
          <Toast />
          <div className="w-full">{children}</div>
        </main>
      </div>
  );
};

export default Admin;
