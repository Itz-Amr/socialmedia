import { indexLiveChat } from "../Apis/index_live_chat";

export const liveChatRepo = {
  subscribeToLiveChats: (userId, onDataChange) => {
    return indexLiveChat(userId, onDataChange);
  },
};
