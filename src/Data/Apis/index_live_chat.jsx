import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../FireBase";
import { usersRepo } from "../Repos/users_repo";

export const indexLiveChat = (userId, callBack) => {
  return onSnapshot(
    query(collection(db, "chats"), where("users", "array-contains", userId)),
    async (chats) => {
      let promises = chats.docs.map(async (chat) => {
        let chatObj = { ...chat.data(), documentId: chat.id };
        let receiverId = chatObj.users.find((el) => el !== userId);
        let userData = await usersRepo.getUserData(receiverId);

        return { ...chatObj, name: userData.name, imgUrl: userData.imgUrl };
      });
      const final = await Promise.all(promises);
      console.log(final);
      callBack(final);
    }
  );
};
