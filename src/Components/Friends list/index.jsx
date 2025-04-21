import { useEffect, useState } from "react";
import FriendsChat from "../Friends Chat";
import styles from "./index.module.css";
import { curretUserId } from "../../Store";
import { liveChatRepo } from "../../Data/Repos/live_chat_repo";

export default function FriendsList() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = liveChatRepo.subscribeToLiveChats(
      curretUserId,
      (data) => {
        setChats(data);
      }
    );

    return () => unsubscribe();
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
