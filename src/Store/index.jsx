import { FiMessageSquare } from "react-icons/fi";
import { GoPersonAdd } from "react-icons/go";
import { LiaBellSolid, LiaHomeSolid } from "react-icons/lia";
import { create } from "zustand";

export const usePaths = create(() => ({
  paths: [
    { path: "/", icon: <LiaHomeSolid /> },
    { path: "/", icon: <GoPersonAdd /> },
    { path: "/chat", icon: <FiMessageSquare /> },
    { path: "/", icon: <LiaBellSolid /> },
  ],
}));

export const useChat = create((set) => ({
  chat_id: 0,
  setOpenedChat: (chat_id) => set(() => ({ chat_id })),
}));
