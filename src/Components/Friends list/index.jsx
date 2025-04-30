import { useEffect, useState } from "react";
import FriendsChat from "../Friends Chat";
import styles from "./index.module.css";
import { liveChatRepo } from "../../Data/Repos/live_chat_repo";
import { useAuthStore } from "../../Store/authStore";

export default function FriendsList() {
  const [chats, setChats] = useState([]);
  const { currentUser } = useAuthStore(); // Get the current user
  const userId = currentUser?.uid; // Safely access the uid

  useEffect(() => {
    if (userId) {
      const unsubscribe = liveChatRepo.subscribeToLiveChats(userId, (data) => {
        setChats(data);
      });
      return () => unsubscribe();
    }
  }, [userId]); // Subscribe to chats when userId changes

  return (
    <div className="col-12 h-100 d-flex flex-column p-3" id={styles.parent}>
      <div
        className="d-flex align-items-start justify-content-start"
        id={styles.header}
      >
        <h6>Friends</h6>
      </div>
      <div className="d-flex flex-column overflow-auto">
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
