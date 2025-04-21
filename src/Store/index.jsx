import { FiMessageSquare } from "react-icons/fi";
import { GoPersonAdd } from "react-icons/go";
import { LiaBellSolid, LiaHomeSolid } from "react-icons/lia";
import { RiGroupLine, RiUser3Line } from "react-icons/ri";
import { create } from "zustand";

// export const usePaths = create(() => ({
//   paths: [
//     { path: "/", icon: <LiaHomeSolid /> },
//     { path: "/", icon: <GoPersonAdd /> },
//     { path: "/chat", icon: <FiMessageSquare /> },
//     { path: "/", icon: <LiaBellSolid /> },
//   ],
// }));

// export const SideMenuPaths = [
//   { path: "/", icon: <LiaHomeSolid />, element: <h1>home</h1> },
//   { path: "/chat", icon: <FiMessageSquare />, element: <h1>chat</h1> },
//   { path: "/groups", icon: <RiGroupLine />, element: <h1>groups</h1> },
//   { path: "/", icon: <RiUser3Line />, element: <h1>home</h1> },
// ];

export const curretUserId = "1";

export const useChat = create((set) => ({
  chat_id: 0,
  setOpenedChat: (chat_id) => set(() => ({ chat_id })),
}));

export const useMsgModal = create(() => ({
  msgModal: true,
}));

export const useCommentModal = create((set) => ({
  commentsModal: false,
  selectedPostId: null,

  openCommentsModal: (postId) =>
    set(() => ({ commentsModal: true, selectedPostId: postId })),

  closeCommentsModal: () => set(() => ({ commentsModal: false })),
}));
