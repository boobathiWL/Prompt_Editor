import React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid";

function NavigateIcon({ position, onClick }) {
  return (
    <div className="relative flex gap-4 w-max group">
      {/* Tooltip for the Down Arrow */}
      <div className="absolute hidden group-hover:block -bottom-7 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-medium text-white bg-black rounded shadow-lg whitespace-nowrap">
        {position ? "Close" : "Open"}
      </div>
      <button
        className="relative h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg bg-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        data-ripple-light="true"
        onClick={onClick}
      >
        <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          {position ? (
            <ChevronUpIcon className="h-5 w-5 text-white" aria-hidden="true" />
          ) : (
            <ChevronDownIcon
              className="h-5 w-5 text-white"
              aria-hidden="true"
            />
          )}
        </span>
      </button>
    </div>
  );
}

export default NavigateIcon;
