import { useContext } from "react";
import { CompareContext } from "../../context/CompareContextModel";

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
