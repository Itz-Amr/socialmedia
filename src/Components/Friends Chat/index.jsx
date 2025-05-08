import { useChat } from "../../Store";
import styles from "./index.module.css";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import db from "../../FireBase";
import { useAuthStore } from "../../Store/authStore";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function FriendsChat({ name, imgUrl, chatId }) {
  const { setOpenedChat } = useChat();
  const { currentUser } = useAuthStore();
  const userId = currentUser?.uid;
  const [isLoading, setIsLoading] = useState(false);

  const getMsgId = async () => {
    if (!userId || !chatId) return;

    try {
      setIsLoading(true);

      const sortedUsers = [userId, chatId].sort();

      const chatQuery = query(
        collection(db, "chats"),
        where("users", "==", sortedUsers)
      );

      const chatSnapshot = await getDocs(chatQuery);

      if (!chatSnapshot.empty) {
        setOpenedChat(chatSnapshot.docs[0].id);
      } else {
        // Create a new chat with sorted user IDs for consistency
        const newChatRef = await addDoc(collection(db, "chats"), {
          users: sortedUsers,
          createdAt: new Date(),
          lastMessage: null,
          lastMessageTimestamp: null,
        });
        setOpenedChat(newChatRef.id);
      }
    } catch (error) {
      console.error("Error getting or creating chat:", error);
      // Handle the error appropriately (could show a notification to the user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={getMsgId}
      className={`d-flex align-items-center justify-content-start flex-row gap-3 ${
        isLoading ? styles.loading : ""
      }`}
      id={styles.parent}
    >
      {imgUrl ? (
        <img src={imgUrl || "/default-avatar.png"} alt={name} />
      ) : (
        <FaUserCircle className="fs-2" />
      )}
      <h6>{name}</h6>
      {isLoading && <span className={styles.loadingIndicator}>•••</span>}
    </div>
  );
}
