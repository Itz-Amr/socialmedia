import { useChat } from "../../Store";
import styles from "./index.module.css";
export default function FriendsChat({ name, imgUrl, chatId }) {
  const { setOpenedChat } = useChat();
  const getMsgId = () => {
    let id = chatId;
    setOpenedChat(id);
  };
  return (
    <div
      onClick={getMsgId}
      className="d-flex align-items-center justify-content-start flex-row gap-3"
      id={styles.parent}
    >
      <img src={imgUrl} alt="" />
      <h6>{name}</h6>
    </div>
  );
}
