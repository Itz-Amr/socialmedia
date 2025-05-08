import { create } from "zustand";

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

export const useFriendsModal = create((set) => ({
  isFriendsListOpen: false,

  openFriendList: () => set({ isFriendsListOpen: true }),
  closeFriendList: () => set({ isFriendsListOpen: false }),
}));
