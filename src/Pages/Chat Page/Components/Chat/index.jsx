import styles from "./index.module.css";
import user from "../../../../assets/user.jpg";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { VscSend } from "react-icons/vsc";
import { useChat } from "../../../../Store";
import { useEffect, useState } from "react";
import db from "../../../../FireBase";
import { collection, onSnapshot } from "firebase/firestore";

export default function MessagesContent() {
  const [msgs, setMsgs] = useState([]);
  const { chat_id } = useChat();

  useEffect(() => {
    onSnapshot(collection(db, `chats/${chat_id}/messages`), (msgs) => {
      let final = msgs.docs.map((chat) => ({
        ...chat.data(),
        documentId: chat.id,
      }));
      setMsgs(final);
    });
  }, [chat_id]);

  return (
    <div className="flex-grow-1 d-flex flex-column" id={styles.parnet}>
      <header className="d-flex align-items-center p-3 gap-2">
        <img src={user} alt="" />
        <h5>Ali Ahmed</h5>
      </header>

      <div className="p-3 d-flex flex-column gap-3" id={styles.chat}>
        {msgs &&
          msgs.map((el) => (
            <div key={el.documentId} id={styles.msgs}>
              <p
                className={el.userSend == "1" ? styles.myMsg : styles.otherMsg}
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
          <MdOutlineAddPhotoAlternate className={styles.icon} />
          <form className="col-12 d-flex gap-2 align-items-center">
            <textarea placeholder="Send a Message" />
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
