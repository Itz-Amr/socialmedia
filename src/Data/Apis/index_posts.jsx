import { collection, getDocs } from "firebase/firestore";
import db from "../../FireBase";

export const indexPosts = async () => {
  const posts = await getDocs(collection(db, "posts"));
  let final = [];
  posts.forEach((post) => {
    let postObj = { ...post.data(), documentId: post.id };
    final.push(postObj);
  });
  return final;
};
