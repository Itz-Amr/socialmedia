import { FiMessageSquare } from "react-icons/fi";
import { GoPersonAdd } from "react-icons/go";
import { LiaBellSolid, LiaHomeSolid } from "react-icons/lia";
import { RiGroupLine, RiUser3Line } from "react-icons/ri";
import { create } from "zustand";

// Remove the hardcoded currentUserId
// export const curretUserId = "1";

export const useUserStore = create((set) => ({
  users: {},
  setUser: (userId, userData) =>
    set((state) => ({
      users: { ...state.users, [userId]: userData },
    })),
}));

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

export const useEditUserInfoModal = create((set) => ({
  isOpen: false,

  userInfo: {
    studiedAt: "",
    marriedTo: "",
    from: "",
    livesIn: "",
  },

  updatedUserInfo: null,

  openModal: (userInfo) => set({ isOpen: true, userInfo }),
  closeModal: () => set({ isOpen: false }),

  updateUserInfo: (newUserInfo) => set({ updatedUserInfo: newUserInfo }),
}));
