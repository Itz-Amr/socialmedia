import styles from "./index.module.css";
import user from "../../../../assets/user.jpg";
import { VscSend } from "react-icons/vsc";
import { curretUserId, useChat } from "../../../../Store";
import { useEffect, useRef, useState } from "react";
import db from "../../../../FireBase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { RiAddLine } from "react-icons/ri";
import { FaRegFaceSmile } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import { usersRepo } from "../../../../Data/Repos/users_repo";

export default function MessagesContent() {
  const [msgs, setMsgs] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const { chat_id } = useChat();
  const [usersData, setUsersData] = useState([]);
  const inputRef = useRef();
  const handleEnter = (event) => {
    if (event.shiftKey && event.key === "Enter") {
      //aa
    } else if (event.key === "Enter") {
      event.preventDefault();
      sendMsg();
      emoji.emoji;
    }
  };

  const sendMsg = async () => {
    const msg = inputRef.current?.value.trim();
    if (!msg) return;

    await addDoc(collection(db, `chats/${chat_id}/messages`), {
      msgContent: msg,
      userSend: curretUserId,
      dataAndTime: new Date(),
    });

    inputRef.current.value = "";
  };

  useEffect(() => {
    const q = query(
      collection(db, `chats/${chat_id}/messages`),
      orderBy("dataAndTime")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let final = snapshot.docs.map((chat) => {
        return { ...chat.data(), documentId: chat.id };
      });
      console.log(final);
      setMsgs(final);
    });

    return () => unsubscribe(); // cleanup when unmount or chat_id changes
  }, [chat_id]);

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;

    const newText = text.slice(0, start) + emoji + text.slice(end);
    input.value = newText;
  };

  useEffect(() => {
    usersRepo.getAllUsers(chat_id).then((res) => {
      setUsersData(res);
      console.log(res);
    });
  }, [chat_id]);

  return (
    <div
      onClick={() => setShowEmoji(false)}
      className="flex-grow-1 d-flex flex-column"
      id={styles.parnet}
    >
      {usersData &&
        usersData.map((el, index) => (
          <header key={index} className="d-flex align-items-center p-3 gap-2">
            <img src={el.imgUrl} alt="" />
            <h5>{el.name}</h5>
          </header>
        ))}

      {/* <header className="d-flex align-items-center p-3 gap-2">
        <img src={user} alt="" />
        <h5>ahmed</h5>
      </header> */}

      <div className="p-3 d-flex flex-column gap-3" id={styles.chat}>
        {msgs &&
          msgs.map((el) => (
            <div key={el.documentId} id={styles.msgs}>
              <p
                className={
                  el.userSend == curretUserId ? styles.myMsg : styles.otherMsg
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
          {/* <input type="image" /> */}

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
            <button className="d-flex align-items-center gap-2">
              Send
              <VscSend className="fs-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
