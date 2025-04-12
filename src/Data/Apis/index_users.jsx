import { collection, getDocs } from "firebase/firestore";
import db from "../../FireBase";

export const indexUsers = async () => {
  const users = await getDocs(collection(db, "users"));
  let final = [];
  users.forEach((user) => {
    let userObj = { ...user.data(), documentId: user.id };
    final.push(userObj);
  });
  return final;
};
