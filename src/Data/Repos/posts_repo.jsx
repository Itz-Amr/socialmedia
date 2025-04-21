import { indexPosts } from "../Apis/index_posts";

export const postsRepo = {
  getAllPosts: async () => {
    return await indexPosts();
  },
};
