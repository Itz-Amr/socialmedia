import styles from "./index.module.css";
import { VscSend } from "react-icons/vsc";
import { useChat, useFriendsModal } from "../../../../Store";
import { useEffect, useRef, useState } from "react";
import db from "../../../../FireBase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  getDoc,
  doc,
} from "firebase/firestore";
import { RiAddLine } from "react-icons/ri";
import { FaRegFaceSmile } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import { usersRepo } from "../../../../Data/Repos/users_repo";
import { useAuthStore } from "../../../../Store/authStore";
import { Outlet } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import MessagesModal from "../../../../Components/Messages Contnet Modal";

export default function MessagesContent() {
  const [msgs, setMsgs] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const { chat_id } = useChat();
  const [chatPartner, setChatPartner] = useState(null);
  const inputRef = useRef();
  const { currentUser } = useAuthStore();
  const userId = currentUser?.uid;

  const handleEnter = (event) => {
    if (event.shiftKey && event.key === "Enter") {
      //
    } else if (event.key === "Enter") {
      event.preventDefault();
      sendMsg();
    }
  };

  const sendMsg = async () => {
    const msg = inputRef.current?.value.trim();
    if (!msg || !userId) return;

    await addDoc(collection(db, `chats/${chat_id}/messages`), {
      msgContent: msg,
      userSend: userId,
      dataAndTime: new Date(),
    });

    inputRef.current.value = "";
  };

  useEffect(() => {
    if (!chat_id) return;

    const q = query(
      collection(db, `chats/${chat_id}/messages`),
      orderBy("dataAndTime")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let final = snapshot.docs.map((chat) => {
        return { ...chat.data(), documentId: chat.id };
      });
      setMsgs(final);
    });

    return () => unsubscribe(); // cleanup when unmount or chat_id changes
  }, [chat_id]);

  useEffect(() => {
    const getChatPartnerInfo = async () => {
      if (!chat_id) return;

      try {
        const chatDoc = await getDoc(doc(db, "chats", chat_id));

        if (chatDoc.exists()) {
          const chatData = chatDoc.data();

          const receiverId = chatData.users.find((id) => id !== userId);

          if (receiverId) {
            // Get the receiver's user data
            const userData = await usersRepo.getUserData(receiverId);
            setChatPartner(userData);
          }
        }
      } catch (error) {
        console.error("Error fetching chat partner info:", error);
      }
    };

    getChatPartnerInfo();
  }, [chat_id, userId]); // Include userId in dependency array

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;

    const newText = text.slice(0, start) + emoji + text.slice(end);
    input.value = newText;

    // Set cursor position after the inserted emoji
    input.selectionStart = start + emoji.length;
    input.selectionEnd = start + emoji.length;
    input.focus();
  };
  const { openFriendList } = useFriendsModal();

  if (!chat_id) {
    return (
      <div
        className="flex-grow-1 d-flex flex-column justify-content-center align-items-center"
        id={styles.parnet}
      >
        <div className="text-center">
          <h6>Select a chat to start messaging</h6>
          <p className="text-muted">
            Choose a friend from the list to begin your conversation
          </p>
        </div>
        <Outlet />
      </div>
    );
  }

  return (
    <div
      onClick={() => setShowEmoji(false)}
      className="flex-grow-1 d-flex flex-column"
      id={styles.parnet}
    >
      <MessagesModal />

      {/* Header with chat partner info */}
      {chatPartner && (
        <header className="p-3 d-flex justify-content-between">
          <div className="d-flex align-items-center gap-2">
            {chatPartner.imgUrl ? (
              <img src={chatPartner.imgUrl} className={styles.avatarImg} />
            ) : (
              <FaUserCircle className="fs-2" />
            )}
            <h5 className="mb-0">{chatPartner.name}</h5>
          </div>

          <FiMessageSquare
            className="fs-4 d-lg-none d-sm-block d-md-none"
            onClick={openFriendList}
          />
        </header>
      )}

      <div className="p-3 d-flex flex-column gap-3" id={styles.chat}>
        {msgs &&
          msgs.map((el) => (
            <div key={el.documentId} id={styles.msgs}>
              <p
                className={
                  el.userSend === userId ? styles.myMsg : styles.otherMsg
                }
              >
                {el.msgContent}
              </p>
            </div>
          ))}
      </div>

      <div
        className="p-3 d-flex align-items-center justify-content-center"
        id={styles.footer}
      >
        <div className="col-12 d-flex align-items-center justify-content-center position-relative">
          <RiAddLine className={styles.icon} />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMsg();
            }}
            className="col-12 d-flex gap-2 align-items-center"
          >
            <div onClick={(event) => event.stopPropagation()}>
              <FaRegFaceSmile
                onClick={() => setShowEmoji(true)}
                className={styles.emjiIcon}
              />
              {showEmoji && (
                <EmojiPicker
                  height={300}
                  className={styles.emjiPicker}
                  onEmojiClick={handleEmojiClick}
                />
              )}
            </div>

            <textarea
              ref={inputRef}
              onKeyDown={handleEnter}
              placeholder="Send a Message"
            />
            <button
              className="d-flex align-items-center gap-2"
              disabled={!userId}
            >
              Send
              <VscSend className="fs-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
