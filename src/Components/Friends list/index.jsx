import { useEffect, useState } from "react";
import FriendsChat from "../Friends Chat";
import styles from "./index.module.css";
import db from "../../FireBase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { usersRepo } from "../../Data/Repos/users_repo";
import { curretUserId } from "../../Store";

export default function FriendsList() {
  const [chats, setChats] = useState([]);

  const getChatLive = (userId) => {
    onSnapshot(
      query(collection(db, "chats"), where("users", "array-contains", userId)),
      async (chats) => {
        let final = [];
        let promises = chats.docs.map(async (chat) => {
          let chatObj = { ...chat.data(), documentId: chat.id };
          let receiverId = chatObj.users.find((el) => el !== userId);
          let userData = await usersRepo.getUserData(receiverId);
          return { ...chatObj, name: userData.name, imgUrl: userData.imgUrl };
        });
        final = await Promise.all(promises);
        // console.log(final);
        setChats(final);
      }
    );
  };

  useEffect(() => {
    getChatLive(curretUserId);
  }, []);

  return (
    <div className="col-12 h-100 d-flex flex-column p-3" id={styles.parent}>
      <div
        className="d-flex align-items-start justify-content-start"
        id={styles.header}
      >
        <h6>Friends</h6>
      </div>
      <div className="d-flex flex-column gap-3 overflow-auto">
        {chats.map((el) => (
          <FriendsChat
            key={el.documentId}
            chatId={el.documentId}
            name={el.name}
            imgUrl={el.imgUrl}
          />
        ))}
      </div>
    </div>
  );
}
