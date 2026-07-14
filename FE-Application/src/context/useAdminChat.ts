import { useContext } from "react";
import { AdminChatContext } from "./AdminChatContextDefinition";

export const useAdminChat = () => {
  const context = useContext(AdminChatContext);
  if (!context) {
    throw new Error("useAdminChat must be used within AdminChatProvider");
  }
  return context;
};
