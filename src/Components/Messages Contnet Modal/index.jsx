import Messages from "../../Pages/Chat Page/Components/Messages";
import { useFriendsModal } from "../../Store";
import styles from "./index.module.css";

export default function MessagesModal() {
  const { isFriendsListOpen } = useFriendsModal();
  const { closeFriendList } = useFriendsModal();

  if (!isFriendsListOpen) return null;

  return (
    <div
      className="col-12 h-100 d-flex justify-content-end"
      id={styles.body}
      onClick={closeFriendList}
    >
      <div
        className="animate__animated animate__fadeInRight"
        id={styles.friendList}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Messages />
      </div>
    </div>
  );
}
