import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MyComponent = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard", { scroll: false });
  }, []);
  return (
    <div className="flex min-h-screen p-8 bg-gray-100">
      Welcome to prompt editor
    </div>
  );
};

export default MyComponent;
