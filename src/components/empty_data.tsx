import React from "react";
import LibraryBooksTwoToneIcon from "@mui/icons-material/LibraryBooksTwoTone";

function EmptyData(props) {
  const { message = "No data available", className = "" } = props;
  return (
    <div
      className={`flex flex-col items-center justify-center h-full p-6 text-center ${className}`}
    >
      {/* Replace the icon with a similar one from Heroicons or any other icon library */}
      <LibraryBooksTwoToneIcon className="w-20 h-20 text-gray-400" />
      <h6 className="mt-4 text-lg font-semibold text-gray-600">{message}</h6>
    </div>
  );
}

export default EmptyData;
