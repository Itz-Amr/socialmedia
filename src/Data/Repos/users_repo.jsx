import { indexUsers } from "../Apis/index_users";
import { showUser } from "../Apis/show_users";

export const usersRepo = {
  getAllUsers: async () => {
    return await indexUsers();
  },
  getUserData: async (userId) => {
    return await showUser(userId);
  },
};
