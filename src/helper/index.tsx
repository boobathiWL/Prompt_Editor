import { useState } from "react";

export const useSetState = (initialState) => {
  const [state, setState] = useState(initialState);
  const newState = (newState, override) => {
    override
      ? setState(newState)
      : setState((prevState) => ({ ...prevState, ...newState }));
  };
  return [state, newState];
};


