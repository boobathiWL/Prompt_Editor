import { useState } from "react";
import { toast } from "react-toastify";

export const useSetState = (initialState) => {
  const [state, setState] = useState(initialState);
  const newState = (newState, override) => {
    override
      ? setState(newState)
      : setState((prevState) => ({ ...prevState, ...newState }));
  };
  return [state, newState];
};

export const throwError = (error) => {
  toast.error(error, { hideProgressBar: true });
};

export const success = (success) => {
  toast.success(success, {
    hideProgressBar: true,
  });
};

export const formatNameFirstLetterCap = (name) =>
  name
    .toLowerCase() // Convert to lowercase
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
