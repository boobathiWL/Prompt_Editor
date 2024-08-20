import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline"; // For outline icons

const EyeButton = ({ show, onClick, disabled }) => (
  <div className="relative flex gap-4 w-max group">
    <div className="absolute hidden group-hover:block -bottom-4 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-medium text-white bg-black rounded shadow-lg whitespace-nowrap">
      {disabled
        ? "AI Data not generated"
        : show
        ? "Hide AI Response"
        : "Show AI Response"}{" "}
    </div>
    <button
      disabled={disabled}
      onClick={!disabled && onClick}
      className={`relative p-2 text-gray-800 hover:text-gray-700 transition-colors ${
        disabled ? "opacity-30 cursor-not-allowed" : ""
      }`}
      aria-label={show ? "Hide content" : "Show content"}
    >
      {show ? (
        <EyeIcon className="h-6 w-6" aria-hidden="true" />
      ) : (
        <EyeOffIcon className="h-6 w-6" aria-hidden="true" />
      )}{" "}
    </button>
  </div>
);

export default EyeButton;
