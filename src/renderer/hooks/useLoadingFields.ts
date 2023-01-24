import { useState } from "react";

interface IFields {
  [x: string]: boolean;
}

export default function useLoadingFields<T = IFields[] | boolean>(
  register: T
): [
  T,
  T extends boolean
    ? (state: boolean) => void
    : (fieldName: string, state: boolean) => void
] {
  const [loading, setLoading] = useState<T>(register);

  // Change field state as multiple
  function setMultipleState(fieldName: string, state: boolean) {
    setLoading((fields) => ({ ...(fields as T), [fieldName]: state }));
  }

  // Change field state as single
  function setSingleState(state: boolean) {
    setLoading(state as T);
  }

  // Set object
  const setObject =
    typeof register === "boolean" ? setSingleState : setMultipleState;

  return [loading, setObject as any];
}
